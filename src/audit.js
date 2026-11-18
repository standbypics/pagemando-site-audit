/** A deliberately lightweight HTML auditor. It is not a browser or a WCAG certification tool. */
const UA = 'PageMandoSiteAudit/0.1 (+https://github.com/standbypics/pagemando-site-audit)';

export function extractTags(html, tag) {
  // Appropriate for basic checks, not a standards-compliant HTML parser.
  const re = new RegExp(`<${tag}(?=[\\s/>])[^>]*>`, 'gi');
  return [...html.matchAll(re)].map(m => m[0]);
}

export function attribute(tag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?:\\s)${escaped}(?:\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+)))?(?=\\s|/?>)`, 'i');
  const m = tag.match(re);
  return m ? (m[1] ?? m[2] ?? m[3] ?? '') : null;
}

export function inspectHtml(html, pageUrl) {
  const issues = [];
  const add = (code, severity, message) => issues.push({ code, severity, message });
  const title = html.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title\s*>/i)?.[1]?.replace(/\s+/g, ' ').trim();
  if (!title) add('missing-title', 'high', 'Page is missing a non-empty <title>.');
  const metas = extractTags(html, 'meta');
  const description = metas.find(t => (attribute(t, 'name') ?? '').toLowerCase() === 'description');
  if (!description || !attribute(description, 'content')?.trim()) add('missing-meta-description', 'medium', 'Page is missing a non-empty meta description.');
  const images = extractTags(html, 'img');
  const missingAlt = images.filter(t => attribute(t, 'alt') === null).length;
  if (missingAlt) add('missing-image-alt', 'medium', `${missingAlt} image(s) are missing an alt attribute (decorative images may use alt="").`);
  const htmlTag = extractTags(html, 'html')[0];
  if (!htmlTag || !attribute(htmlTag, 'lang')?.trim()) add('missing-html-lang', 'medium', 'HTML document is missing a language attribute.');
  const headings = extractTags(html, 'h1');
  if (!headings.length) add('missing-h1', 'low', 'Page has no <h1> heading.');
  if (headings.length > 1) add('multiple-h1', 'low', `Page has ${headings.length} <h1> headings; verify the hierarchy manually.`);
  const links = [];
  for (const t of extractTags(html, 'a')) {
    const href = attribute(t, 'href');
    if (!href || /^(?:#|mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    try {
      const url = new URL(href, pageUrl);
      if (['http:', 'https:'].includes(url.protocol)) { url.hash = ''; links.push(url.toString()); }
    } catch { /* Ignore invalid links; this tool does not validate every URL syntax. */ }
  }
  return { issues, links: [...new Set(links)], imageCount: images.length, title: title ?? null };
}

async function get(url, { fetchImpl, timeoutMs, method = 'GET' }) {
  return fetchImpl(url, {
    method,
    headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.1' },
    signal: AbortSignal.timeout(timeoutMs),
    redirect: 'follow'
  });
}

export async function auditSite(rawUrl, { maxPages = 10, timeoutMs = 10000, fetchImpl = fetch, checkLinks = true } = {}) {
  const root = new URL(rawUrl);
  if (!['http:', 'https:'].includes(root.protocol)) throw new Error('Only http/https URLs are supported.');
  if (!Number.isInteger(maxPages) || maxPages < 1 || maxPages > 100) throw new Error('maxPages must be between 1 and 100.');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 120000) throw new Error('timeoutMs must be between 100 and 120000.');
  root.hash = '';
  const origin = root.origin;
  const queue = [root.toString()];
  const visited = new Set();
  const pages = [];
  const internalLinks = new Set();
  while (queue.length && pages.length < maxPages) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);
    let res;
    try { res = await get(url, { fetchImpl, timeoutMs }); }
    catch (e) { pages.push({ url, status: null, issues: [{ code: 'fetch-error', severity: 'high', message: String(e.message ?? e) }] }); continue; }
    if (!res.ok) { pages.push({ url, status: res.status, issues: [{ code: 'http-error', severity: 'high', message: `Page returned HTTP ${res.status}.` }] }); continue; }
    if (!(res.headers.get('content-type') ?? '').toLowerCase().includes('html')) {
      pages.push({ url, status: res.status, issues: [{ code: 'non-html', severity: 'low', message: 'Response is not HTML; page analysis skipped.' }] });
      continue;
    }
    const finalUrl = res.url || url;
    if (new URL(finalUrl).origin !== origin) {
      pages.push({ url, status: res.status, issues: [{ code: 'offsite-redirect', severity: 'low', message: 'Redirects off-site; content analysis skipped.' }] });
      continue;
    }
    const html = await res.text();
    const detail = inspectHtml(html, finalUrl);
    pages.push({ url, status: res.status, title: detail.title, imageCount: detail.imageCount, issues: detail.issues });
    for (const link of detail.links) {
      if (new URL(link).origin !== origin) continue;
      internalLinks.add(link);
      if (!visited.has(link) && !queue.includes(link)) queue.push(link);
    }
  }
  const brokenLinks = [];
  if (checkLinks) {
    for (const url of internalLinks) {
      if (visited.has(url)) {
        const page = pages.find(p => p.url === url);
        if (page && (page.status === null || page.status >= 400)) brokenLinks.push({ url, status: page.status });
        continue;
      }
      try {
        let res = await get(url, { fetchImpl, timeoutMs, method: 'HEAD' });
        if (res.status === 405 || res.status === 501) res = await get(url, { fetchImpl, timeoutMs });
        if (!res.ok) brokenLinks.push({ url, status: res.status });
      } catch (e) { brokenLinks.push({ url, status: null, error: String(e.message ?? e) }); }
    }
  }
  return {
    tool: 'PageMando Site Audit', version: '0.1.0', auditedAt: new Date().toISOString(),
    root: root.toString(), pages, brokenLinks,
    summary: { pagesAudited: pages.length, issues: pages.reduce((n, p) => n + p.issues.length, 0), brokenInternalLinks: brokenLinks.length },
    limitations: ['Basic regex-based HTML inspection, not a complete HTML parser.', 'Not a WCAG compliance audit.', 'JavaScript-rendered DOM is not evaluated.', 'Internal links only; no external link verification.', 'HEAD requests may differ from browser GET behavior.']
  };
}
