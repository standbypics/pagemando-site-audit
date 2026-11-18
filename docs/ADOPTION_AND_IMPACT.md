# Adoption and impact — evidence, not vanity metrics

PageMando Site Audit is a prototype, not an established community project. **Do not claim users, downloads, forks, stars, external contributors, or Anthropic eligibility without independent evidence.**

## Try the tool responsibly

1. Audit a site you own or have written permission to test.
2. Review its robots.txt and policies first; this version does not enforce them.
3. From the project folder, run `node src/cli.js https://your-site.example --max-pages 3 --delay-ms 750 --json report.json`.
4. Manually verify findings. Do not upload client URLs, site HTML, or private reports to public issues.
5. If you discover a reproducible defect, open an issue with synthetic HTML and expected/actual behavior.

## Evidence log

| Measure | Evidence to retain | Status as of initial release |
| --- | --- | --- |
| Public source and license | GitHub repository and LICENSE | Published |
| CI checks | GitHub Actions run URL | Needs confirmed successful run |
| External users | Opt-in issue, discussion, or independent use report | Not established |
| External merged contributions | PR URL from an independent contributor | Not established |
| Downloads | Registry statistics, if published to a registry | Not published to registry |
| Dependencies | Public package dependency graph, if published | Not established |

Do not count self-created issues, self-merged PRs, or self-generated downloads as independent adoption. Neither GitHub stars nor a handful of PRs alone proves ecosystem impact.

## Ways to earn meaningful adoption

- Validate the tool on authorized small-business websites and document anonymized reproducible bugs.
- Invite maintainers of relevant open-source tools to review discrete improvements, without unsolicited bulk outreach.
- Publish a practical usage guide with real but permission-cleared test cases.
- Contribute focused fixes to established upstream projects after confirming their contribution policy.

## Technical next priorities

1. Implement and thoroughly test robots.txt parsing, including conservative error handling.
2. Ensure per-request delay is maintained even when links require GET fallback.
3. Adopt standards-compliant HTML parsing and add fixture tests.
