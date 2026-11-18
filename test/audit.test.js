import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectHtml, attribute, auditSite } from '../src/audit.js';

test('extracts attributes including unquoted values and empty alt', () => {
  assert.equal(attribute('<img src=photo.jpg alt="">', 'alt'), '');
  assert.equal(attribute('<a href="/about">', 'href'), '/about');
  assert.equal(attribute('<img src=photo.jpg>', 'alt'), null);
});

test('reports missing metadata and missing alt attributes', () => {
  const r = inspectHtml('<html><body><img src="a.png"><a href="/about#section">About</a></body></html>', 'https://example.com/');
  assert.ok(r.issues.some(i => i.code === 'missing-title'));
  assert.ok(r.issues.some(i => i.code === 'missing-meta-description'));
  assert.ok(r.issues.some(i => i.code === 'missing-image-alt'));
  assert.deepEqual(r.links, ['https://example.com/about']);
});

test('empty alt is accepted as decorative image', () => {
  const r = inspectHtml('<html lang="en"><head><title>Home</title><meta name="description" content="Hello"></head><body><h1>Hello</h1><img alt=""></body></html>', 'https://example.com/');
  assert.equal(r.issues.length, 0);
});

test('crawls same-origin links and checks broken links', async () => {
  const response = (url, status, html = '') => ({ url, status, ok: status >= 200 && status < 300, headers: { get: () => 'text/html' }, text: async () => html });
  const fakeFetch = async (url, options) => {
    if (url.endsWith('/missing')) return response(url, 404);
    if (url.endsWith('/about')) return response(url, 200, '<html lang="en"><head><title>About</title><meta name="description" content="About"></head><body><h1>About</h1></body></html>');
    return response(url, 200, '<html lang="en"><head><title>Home</title><meta name="description" content="Home"></head><body><h1>Home</h1><a href="/about">About</a><a href="/missing">Missing</a><a href="https://elsewhere.org/">External</a></body></html>');
  };
  const r = await auditSite('https://example.com/', { fetchImpl: fakeFetch, maxPages: 2 });
  assert.equal(r.summary.pagesAudited, 2);
  assert.equal(r.summary.brokenInternalLinks, 1);
  assert.equal(r.brokenLinks[0].status, 404);
});

test('rejects invalid crawl bounds', async () => {
  await assert.rejects(() => auditSite('file:///etc/passwd'), /http\/https/);
  await assert.rejects(() => auditSite('https://example.com', { maxPages: 101 }), /maxPages/);
});
