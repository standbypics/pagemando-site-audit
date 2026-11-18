# Claude for Open Source — PageMando application preparation

Prepared 18 November 2026. **This file documents preparation, not eligibility or an application submission.**

Official application: https://claude.com/open-source-max
Official terms: https://www.anthropic.com/claude-for-oss-terms
Public program page: https://claude.com/contact-sales/claude-for-oss

## What is actually known

- Applicant: individual owner of GitHub account `standbypics`; NOT PageMando as a company.
- Existing `lensleadr-studio-suite` is private and should remain private.
- PageMando Site Audit v0.1.0 exists locally and its five automated unit tests pass.
- This package does NOT establish a published repository, downloads, downstream dependencies, accepted external contributions, or meaningful ecosystem adoption.
- GitHub account creation date is **not verified**. Verify it: open `https://api.github.com/users/standbypics` in your browser, locate `created_at`; it must be on or before 2024-11-18 for an application on 2026-11-18.
- No public pull requests authored by this account were found in the connected search at the time of preparation. This is not proof of no contributions elsewhere.

## Eligibility gate — do not submit until this is demonstrable

General requirements in the current terms: individual age/residence conditions, GitHub account at least two years old, public OSS contributions in last 90 days, an OSI-approved license, and a qualifying maintainer-track threshold or substantial open-source ecosystem impact. A new repository and fresh commits satisfy none of the quantitative impact thresholds on their own.

Maintainer thresholds: 500 dependent repos; 100 dependent packages; 200,000 combined monthly downloads; listed maintainer on recognized foundation/language project; 100 merged PRs into repos you do not own in 12 months; 20 unique external merged-PR contributors in a repo in 12 months; or OpenSSF criticality >= 0.4. Discretionary impact requires meaningful actual dependency/use by the ecosystem.

## How to publish the repository

1. Sign in to GitHub as `standbypics` and go to https://github.com/new.
2. Set owner `standbypics`, repository name `pagemando-site-audit`, description `Dependency-free, open-source website audit CLI for small business websites`, visibility **Public**.
3. Leave README, .gitignore, and license initializers **unchecked** (the files are provided).
4. Create repository. On your Mac install/use Git; unzip the package so you can `cd` into the directory that directly contains `package.json`.
5. In Terminal from that directory run:

```sh
npm test
npm run check
git init
git branch -M main
git add .
git commit -m "Initial open-source release: PageMando Site Audit v0.1.0"
git remote add origin https://github.com/standbypics/pagemando-site-audit.git
git push -u origin main
```

GitHub may request authentication with a credential manager or a personal access token; do not paste any secret into issues or chat. If `git` says an identity is missing, set your own `git config user.name` and `git config user.email` and retry the commit. Do not upload the enclosing ZIP as a single file: upload the actual source files through Git.

6. Verify public README, MIT license, tests at `https://github.com/standbypics/pagemando-site-audit/actions`, and the actual code under `src/`. Resolve failures before announcing a release.
7. Create a GitHub Release, tag `v0.1.0`, only after verifying that publication and CI work. Don't claim that it has users or downloads without evidence.

## Meaningful next contributions

- Implement `robots.txt` policy checks and polite crawl delays, with tests (important before routine real-world crawling).
- Replace regex-only HTML parsing with standards-compliant parsing; write regression tests for malformed HTML.
- Improve redirect handling and check for binary/non-HTML link targets, with tests.
- Add crawl size and concurrency limits and better reporting for remote failures.
- Find genuine relevant bugs in established open-source projects, discuss them in issues, submit well-tested PRs, and track merged links. Do not submit superficial mass PRs.
- Build actual adoption: maintain documentation, respond to user issues, ask real users for feedback, and publish a useful release before trying to claim ecosystem significance.

## Evidence log (fill with verifiable evidence only)

| Evidence | Verified URL | Measurable fact | Checked on |
|---|---|---|---|
| GitHub account creation | https://api.github.com/users/standbypics | NOT VERIFIED | — |
| Public repository | https://github.com/standbypics/pagemando-site-audit | NOT YET VERIFIED | — |
| CI result | https://github.com/standbypics/pagemando-site-audit/actions | NOT YET VERIFIED | — |
| Release | https://github.com/standbypics/pagemando-site-audit/releases | NOT YET VERIFIED | — |
| Merged external PRs | — | NONE VERIFIED | — |
| External contributors / dependents / downloads | — | NONE VERIFIED | — |
| Real user adoption | — | NONE VERIFIED | — |

## Draft: 'How would you use Claude Ultra?' (copy when applying)

I maintain and develop PageMando Site Audit, an open-source command-line tool for basic website quality checks. I would use Claude and Claude Code to improve the tool's tests, documentation, HTML parsing, crawl safety, accessible reporting and support for community contributions. I would review and test changes before publishing them.

## Draft: 'Why do you qualify?' — NOT READY FOR SUBMISSION

I maintain PageMando Site Audit (https://github.com/standbypics/pagemando-site-audit), an MIT-licensed developer tool that helps people inspect common website quality issues without requiring paid APIs. My work includes implementation, unit testing, documentation and ongoing maintenance. [ADD VERIFIED ACCOUNT AGE AND RECENT PUBLIC OSS ACTIVITY.] [ADD REAL ADOPTION EVIDENCE, MAINTAINER-TRACK THRESHOLD OR MEANINGFUL ECOSYSTEM DEPENDENCY WITH SOURCES.] [LINK TO MEANINGFUL EXTERNAL MERGED PULL REQUESTS IF APPLICABLE.] I intend to continue maintaining the tool openly and responding to substantive contributions.

**Do not submit this draft with bracketed claims or falsely assert qualifying impact.** If no real impact evidence emerges, the proper conclusion is that the application is premature, not that the wording needs to be more persuasive.

## Exact application steps — after eligibility has been demonstrated

1. Open https://claude.com/open-source-max (or use the Apply link on the official program page).
2. Sign in with your own `standbypics` GitHub account; review OAuth permissions before authorizing.
3. Supply the email address you monitor and that is associated with your GitHub account.
4. Paste the truthful 'How would you use Claude Ultra?' paragraph.
5. Write up to 500 words for why you qualify, referencing only verified, public evidence URLs and your actual role; select the truthful qualifying track if the form asks.
6. Review the current terms, submit **once**, and retain a copy of your answers. Anthropic states it contacts applicants only if approved, with no guaranteed timeline.
7. If approved, activate through the email link within 90 days, check potential overage charges and note that a paid plan resumes after six months unless cancelled.

## Commercial boundary

The free open-source Site Audit CLI may be used to support PageMando workflows, but do not open-source clients' private data, proprietary PageMando code, credentials, or copyrighted assets without rights.
