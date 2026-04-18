import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..');
const targetDir = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : repoRoot;

const scannablePattern = /\.(ts|sql)$/;

function walkDir(dir, callback) {
  try {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const dirPath = path.join(dir, f);
      const isDirectory = fs.statSync(dirPath).isDirectory();
      if (f === 'node_modules' || f === '.next' || f === '.git') continue;
      isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    }
  } catch(e) {
     // ignore unreadable
  }
}

function classify(p) {
  if (p.endsWith('.sql')) return 'sql_schema';
  if (p.includes('route.ts') || p.includes('app/api')) return 'route';
  return 'route'; // Defaulting to route just for local scans
}

async function run() {
  console.log(`Scanning directory: ${targetDir}`);
  const filesToScan = [];
  
  walkDir(targetDir, (filePath) => {
    if (scannablePattern.test(filePath)) {
      filesToScan.push(filePath);
    }
  });

  console.log(`Found ${filesToScan.length} files to scan. Proceeding sequentially...\n===========================================`);

  // Target NextJS dev server port
  const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';

  for (const filePath of filesToScan) {
    const relPath = path.relative(targetDir, filePath);
    const source = fs.readFileSync(filePath, 'utf8');
    const artifactKind = classify(relPath);

    console.log(`Analyzing ${relPath}...`);
    try {
      const res = await fetch(`${SERVER_URL}/api/scan/live`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, filePath: relPath, artifactKind })
      });
      const data = await res.json();
      
      if (!res.ok || !data.ok) {
        console.error(`--> Failed: ${data.error || res.statusText}`);
        continue;
      }

      if (data.findings && data.findings.length > 0) {
        console.error(`--> ❌ FOUND ${data.findings.length} VULNERABILITIES IN ${relPath}`);
        data.findings.forEach((f) => {
          console.error(`      [${f.severity.toUpperCase()}] ${f.title} (line ${f.line_start}-${f.line_end})`);
        });
      } else {
        console.log(`--> ✅ Secure`);
      }
    } catch (err) {
      console.error(`--> Could not scan ${relPath}: ${err.message}`);
    }
    console.log('-------------------------------------------');
  }
}

run();
