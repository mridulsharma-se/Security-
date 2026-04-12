import { generateObject, embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { ATTACKER_SYSTEM_PROMPT } from './prompts/attacker';
import { supabaseAdmin } from '@/lib/supabase/admin';

const FindingSchema = z.object({
  category: z.enum([
    'idor',
    'broken_access_control',
    'rls_misconfiguration',
    'missing_input_validation',
    'sql_injection',
    'ssrf',
    'xss',
    'secret_exposure',
  ]),
  severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
  title: z.string().max(80),
  line_start: z.number().int().nonnegative(),
  line_end: z.number().int().nonnegative(),
  cwe: z.string().nullable(),
  exploit_narrative: z.string(),
  proof_of_concept: z.string(),
});

export const AuditReportSchema = z.object({
  findings: z.array(FindingSchema),
});

export type Finding = z.infer<typeof FindingSchema>;
export type AuditReport = z.infer<typeof AuditReportSchema>;

export interface AuditInput {
  repositoryId: string;
  commitSha: string;
  filePath: string;
  source: string;
  artifactKind: 'route' | 'server_action' | 'sql_schema';
}

export async function runAttackerAgent(input: AuditInput): Promise<AuditReport> {
  const numbered = input.source
    .split('\n')
    .map((l, i) => `${i + 1}\t${l}`)
    .join('\n');

  const { object } = await generateObject({
    model: openai('gpt-4.1'),
    system: ATTACKER_SYSTEM_PROMPT,
    schema: AuditReportSchema,
    temperature: 0.1,
    prompt: [
      `Artifact kind: ${input.artifactKind}`,
      `File: ${input.filePath}`,
      `--- BEGIN SOURCE ---`,
      numbered,
      `--- END SOURCE ---`,
    ].join('\n'),
  });

  const novel = await filterNovelFindings(input.repositoryId, object.findings, input.source);
  await persistFindings(input, novel);
  return { findings: novel.map(({ embedding: _e, ...rest }) => rest) };
}

type EmbeddedFinding = Finding & { embedding: number[] };

async function filterNovelFindings(
  repositoryId: string,
  findings: Finding[],
  source: string,
): Promise<EmbeddedFinding[]> {
  const novel: EmbeddedFinding[] = [];
  const lines = source.split('\n');

  for (const f of findings) {
    const snippet = lines.slice(f.line_start - 1, f.line_end).join('\n');
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: `${f.category}::${f.title}\n${snippet}`,
    });

    const { data: similar } = await supabaseAdmin.rpc('match_vulnerabilities', {
      query_embedding: embedding,
      repo_id: repositoryId,
      match_threshold: 0.92,
      match_count: 1,
    });

    if (!similar?.length) novel.push({ ...f, embedding });
  }
  return novel;
}

async function persistFindings(input: AuditInput, findings: EmbeddedFinding[]) {
  if (!findings.length) return;
  await supabaseAdmin.from('vulnerabilities').insert(
    findings.map((f) => ({
      repository_id: input.repositoryId,
      commit_sha: input.commitSha,
      file_path: input.filePath,
      line_start: f.line_start,
      line_end: f.line_end,
      category: f.category,
      severity: f.severity,
      title: f.title,
      exploit_narrative: f.exploit_narrative,
      proof_of_concept: f.proof_of_concept,
      cwe: f.cwe,
      embedding: f.embedding,
    })),
  );
}
