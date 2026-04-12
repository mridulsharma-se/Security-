import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import type { AuditReport } from './attacker';

const FIXER_SYSTEM_PROMPT = `
You are VibeGuard-Blue, a defensive engineer. You receive a vulnerability
report and the original source. You output a corrected file plus a narrative.

NON-NEGOTIABLE RULES
1. Preserve the developer's stylistic choices: import order, quote style,
   semicolons, naming, comment density. You are patching, not refactoring.
2. For Next.js route handlers: validate ALL inputs with Zod. Use
   safeParse + early-return on failure. Extract auth via the request's
   Supabase server client; never trust client-supplied user IDs.
3. For Supabase RLS: never use "USING (true)". Compare the row's owner
   column against auth.uid(). Add policies for each operation.
4. Do not introduce new dependencies beyond zod and @supabase/ssr.
5. Output a full file, not a fragment.

OUTPUT CONTRACT (JSON only) — fields: fixed_source, fix_narrative, summary_bullets.
`.trim();

const FixSchema = z.object({
  fixed_source: z.string(),
  fix_narrative: z.string(),
  summary_bullets: z.array(z.string()).max(6),
});

export type FixResult = z.infer<typeof FixSchema>;

export async function runFixerAgent(args: {
  filePath: string;
  originalSource: string;
  report: AuditReport;
}): Promise<FixResult> {
  const { object } = await generateObject({
    model: openai('gpt-4.1'),
    system: FIXER_SYSTEM_PROMPT,
    schema: FixSchema,
    temperature: 0.0,
    prompt: [
      `File: ${args.filePath}`,
      `Findings:`,
      JSON.stringify(args.report.findings, null, 2),
      `--- ORIGINAL SOURCE ---`,
      args.originalSource,
      `--- END ---`,
    ].join('\n'),
  });
  return object;
}
