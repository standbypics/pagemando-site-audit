# PageMando Site Audit

[![Node.js CI](https://github.com/standbypics/pagemando-site-audit/actions/workflows/test.yml/badge.svg)](https://github.com/standbypics/pagemando-site-audit/actions/workflows/test.yml)

A small, **free and open-source** Node.js command-line tool for checking common SEO, accessibility and internal-link issues on small-business websites. No dependencies or API keys required.

> **Project status:** v0.1.0 prototype. This is a focused first-release audit, **not** a full accessibility, SEO, or security certification.

## Requirements

Node.js 20+.

## Install and run

```bash
# From the project directory
npm test
node src/cli.js https://example.com --max-pages 10 --delay-ms 500 --json report.json

# Optional: install local CLI command
npm link
pagemando-audit https://example.com --max-pages 5
```

Only audit websites you own or have permission to test. Respect robots.txt and site policies; this prototype does **not** automatically parse robots.txt or throttle requests. Set a low `--max-pages` value and a considerate `--delay-ms` for initial runs. The delay is per HTTP request, not per crawled page; robots.txt restrictions must still be checked manually.

## Checks

- Missing or empty HTML `<title>`
- Missing or empty meta description
- Images without an `alt` attribute (empty `alt=""` is valid)
- Missing document `lang`
- Missing or multiple `<h1>` headings (review multiple `<h1>` findings manually)
- Broken same-origin HTTP links (HEAD checks, with GET fallback on 405 or 501)
- HTTP errors and network failures while crawling

## Options

| Option | Default | Description |
|---|---:|---|
| `--max-pages N` | `10` | Crawl up to 100 same-origin pages |
| `--timeout MS` | `10000` | Request timeout in milliseconds |
| `--delay-ms N` | `0` | Pause N milliseconds between every HTTP request, including link checks (0–60000) |
| `--json PATH` | none | Write machine-readable JSON report |
| `--no-link-check` | off | Skip link checking |
| `--help` | — | Print usage |

The process exits with code 1 if findings are present, code 2 on invalid input/error, and 0 on a clean audit.

## Limitations

This is a basic static HTML scanner, not a headless browser or standards-compliant HTML parser. It does not execute JavaScript, follow links to other domains, examine all ARIA semantics, reliably handle malformed HTML, or certify compliance with WCAG. Internal link checks do not verify browser navigation behavior. Off-site redirects are not analyzed. Robots.txt support, throttling, and more robust HTML parsing are good future contributions.

## Roadmap

1. Robots.txt awareness (polite crawl delay is implemented)
2. Standards-compliant HTML parsing
3. Configurable check severity and JSON schema
4. Optional sitemap.xml discovery
5. CI fixtures for unusual markup and redirects

## Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Focus on real, testable improvements rather than cosmetic changes.

## License

MIT, see [LICENSE](LICENSE).
