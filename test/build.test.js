import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const docsDir = join(rootDir, 'docs');

const pages = [
  'index.html',
  'services-cfo.html',
  'about.html',
  'cfo-of-the-year.html',
  'contact.html',
  'fractional-cfo.html',
  '404.html',
  'markhazleton/card/index.html',
  'lesleyhazleton/card/index.html',
];

test('build.js runs cleanly and produces docs/', () => {
  execFileSync('node', ['build.js'], { cwd: rootDir, stdio: 'pipe' });
  assert.ok(existsSync(docsDir), 'docs/ should exist after build');
});

for (const page of pages) {
  test(`docs/${page} exists and looks like real HTML`, () => {
    const filePath = join(docsDir, page);
    assert.ok(existsSync(filePath), `${page} should be generated`);
    const html = readFileSync(filePath, 'utf-8');
    assert.match(html, /^<!DOCTYPE html>/, `${page} should start with a doctype`);
    assert.ok(html.length > 500, `${page} should have real content, not a stub`);
  });
}

test('required Azure Static Web Apps and SEO files are copied into docs/', () => {
  for (const file of ['staticwebapp.config.json', 'robots.txt', 'sitemap.xml', 'favicon.png', 'favicon.svg']) {
    assert.ok(existsSync(join(docsDir, file)), `${file} should be copied into docs/`);
  }
});

test('CSS is shared via one external styles.css, not inlined per page', () => {
  assert.ok(existsSync(join(docsDir, 'styles.css')), 'styles.css should be generated in docs/');
  for (const page of pages) {
    const html = readFileSync(join(docsDir, page), 'utf-8');
    assert.ok(!/<style>/.test(html), `${page} should not inline a <style> block`);
    assert.match(html, /<link rel="stylesheet" href="\/?styles\.css">/, `${page} should link to styles.css`);
  }
});

function resolveLink(href, pageFilePath) {
  const cleanHref = href.split('#')[0].split('?')[0];
  if (!cleanHref) return null;
  const target = cleanHref.startsWith('/')
    ? join(docsDir, cleanHref.slice(1))
    : join(dirname(pageFilePath), cleanHref);
  return target.endsWith('/') ? join(target, 'index.html') : target;
}

test('internal links point to files that exist in docs/', () => {
  const externalPrefixes = ['http://', 'https://', 'mailto:', 'tel:'];
  for (const page of pages) {
    const pageFilePath = join(docsDir, page);
    const html = readFileSync(pageFilePath, 'utf-8');
    const links = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);

    for (const href of links) {
      if (externalPrefixes.some((prefix) => href.startsWith(prefix))) continue;
      const target = resolveLink(href, pageFilePath);
      if (!target) continue;
      const found = existsSync(target) || existsSync(`${target}.html`);
      assert.ok(found, `broken internal link "${href}" on ${page}`);
    }
  }
});
