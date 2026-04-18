import { generateObject, embed } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { DAST_SYSTEM_PROMPT } from './prompts/dast';
import { supabaseAdmin } from '@/lib/supabase/admin';

const DastFindingSchema = z.object({
  category: z.enum([
    'idor',
    'broken_access_control',
    'rls_misconfiguration',
    'missing_input_validation',
    'sql_injection',
    'ssrf',
    'xss',
    'secret_exposure',
    'misconfiguration' // added specifically for DAST
  ]),
  severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
  title: z.string().max(80),
  line_start: z.number().int().nonnegative().optional(),
  line_end: z.number().int().nonnegative().optional(),
  cwe: z.string().nullable(),
  exploit_narrative: z.string(),
  proof_of_concept: z.string(),
});

export const DastReportSchema = z.object({
  findings: z.array(DastFindingSchema),
});

export type DastFinding = z.infer<typeof DastFindingSchema>;
export type DastReport = z.infer<typeof DastReportSchema>;

export interface DastAuditInput {
  repositoryId?: string;
  url: string;
  html: string;
  headers: string;
  skipPersist?: boolean;
}

export async function runDastAgent(input: DastAuditInput): Promise<DastReport> {
  const { object } = await generateObject({
    model: google('gemini-1.5-pro-latest'),
    system: DAST_SYSTEM_PROMPT,
    schema: DastReportSchema,
    temperature: 0.1,
    prompt: [
      `Target URL: ${input.url}`,
      `--- BEGIN HTTP HEADERS ---`,
      input.headers,
      `--- END HTTP HEADERS ---`,
      `--- BEGIN HTML SOURCE ---`,
      input.html.slice(0, 50000), // Protect against massive token context payload mapping
      `--- END HTML SOURCE ---`,
    ].join('\n'),
  });

  if (input.skipPersist || !input.repositoryId) {
    return { findings: object.findings };
  }

  await persistFindings(input.repositoryId, input.url, object.findings);
  return { findings: object.findings };
}

async function persistFindings(repositoryId: string, url: string, findings: DastFinding[]) {
  if (!findings.length) return;
  await supabaseAdmin.from('vulnerabilities').insert(
    findings.map((f) => ({
      repository_id: repositoryId,
      commit_sha: 'live-scan',
      file_path: new URL(url).pathname || '/',
      line_start: f.line_start || 0,
      line_end: f.line_end || 0,
      category: f.category === 'misconfiguration' ? 'secret_exposure' : f.category, // fallback mapping for DB enum
      severity: f.severity,
      title: f.title,
      exploit_narrative: f.exploit_narrative,
      proof_of_concept: f.proof_of_concept,
      cwe: f.cwe,
    })),
  );
}
