export default function HomePage() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: '4rem', maxWidth: 720 }}>
      <h1>VibeGuard</h1>
      <p>
        Self-healing security layer for AI-generated Next.js + Supabase code. A Red agent
        hunts for IDOR, broken access control, and RLS misconfigurations; a Blue agent
        rewrites the file with Zod validation and tightened policies; an autonomous
        engine opens the PR.
      </p>
      <ul>
        <li>POST /api/webhooks/github — push events trigger scans</li>
        <li>src/agents/attacker.ts — Red team</li>
        <li>src/agents/fixer.ts — Blue team</li>
        <li>src/github/pr-engine.ts — autonomous PR opener</li>
      </ul>
    </main>
  );
}
