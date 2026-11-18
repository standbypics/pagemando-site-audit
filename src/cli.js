#!/usr/bin/env node
import { writeFile } from 'node:fs/promises';
import { auditSite } from './audit.js';

function usage() {
  return `PageMando Site Audit 0.1.0
Usage: pagemando-audit <https://example.com> [--max-pages 10] [--timeout 10000] [--delay-ms 0] [--json report.json] [--no-link-check]

Crawls same-origin HTML pages and reports common SEO/accessibility oversights.
Only scan websites you own or have permission to audit; respect site policies.
`;
}

async function main(args) {
  if (!args.length || args.includes('--help') || args.includes('-h')) { console.log(usage()); return; }
  const url = args[0];
  const opts = { maxPages: 10, timeoutMs: 10000, delayMs: 0, checkLinks: true };
  let path;
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--no-link-check') { opts.checkLinks = false; continue; }
    if (['--max-pages', '--timeout', '--delay-ms', '--json'].includes(arg)) {
      const val = args[++i];
      if (!val || val.startsWith('--')) throw new Error(`Missing value for ${arg}`);
      if (arg === '--json') path = val;
      else {
        if (!/^\d+$/.test(val)) throw new Error(`Expected positive integer for ${arg}`);
        opts[arg === '--max-pages' ? 'maxPages' : arg === '--timeout' ? 'timeoutMs' : 'delayMs'] = Number(val);
      }
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  const report = await auditSite(url, opts);
  console.log(`\nPageMando Site Audit — ${report.root}`);
  console.log(`${report.summary.pagesAudited} pages | ${report.summary.issues} issues | ${report.summary.brokenInternalLinks} broken internal links\n`);
  for (const p of report.pages) {
    console.log(`${p.url} [${p.status ?? 'ERROR'}]`);
    for (const issue of p.issues) console.log(`  [${issue.severity}] ${issue.code}: ${issue.message}`);
  }
  for (const link of report.brokenLinks) console.log(`BROKEN: ${link.url} (${link.status ?? 'network error'})`);
  if (path) { await writeFile(path, JSON.stringify(report, null, 2) + '\n'); console.log(`\nJSON saved: ${path}`); }
  if (report.summary.issues || report.summary.brokenInternalLinks) process.exitCode = 1;
}
main(process.argv.slice(2)).catch(e => { console.error(`Error: ${e.message}`); console.error(usage()); process.exitCode = 2; });
