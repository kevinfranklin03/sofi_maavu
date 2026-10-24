const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
process.loadEnvFile(path.resolve(__dirname, '../.env.production'));
const build = path.resolve(__dirname, '../build');
const origin = process.env.SITE_URL ? new URL(process.env.SITE_URL).origin : null;

test('the production HTML includes readable page content without running JavaScript', () => {
  const html = fs.readFileSync(path.join(build, 'index.html'), 'utf8');
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
  for (const section of ['Dosa Batter', 'Idly Batter', 'Sofica Bharath', 'Hotels &amp; restaurants', 'Send enquiry']) assert.ok(html.includes(section), section);
  assert.ok(!html.includes('reveal-ready'), 'content should be visible without JavaScript');
});

test('canonical, social metadata and structured data use the published domain', () => {
  const html = fs.readFileSync(path.join(build, 'index.html'), 'utf8');
  assert.match(html, /name="robots" content="index,follow/);
  assert.match(html, /<title>Amma Nana Foods \| Idli &amp; Dosa Batter Supplier in Chennai<\/title>/);
  assert.match(html, /name="description" content="Amma Nana Foods supplies fresh idli and dosa batter in Chennai\./);
  assert.ok(html.includes('Fresh batter from Sholinganallur, Chennai.'));
  if (origin) {
    assert.ok(html.includes(`rel="canonical" href="${origin}/"`));
    assert.ok(html.includes(`property="og:image" content="${origin}/social-cover.png"`));
  } else {
    assert.ok(!html.includes('rel="canonical"'), 'wait for the actual public domain');
  }
  const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
  const data = JSON.parse(json);
  const organization = origin ? data['@graph'].find(node => node['@type'] === 'Organization') : data;
  assert.equal(organization.name, 'Amma Nana Foods');
  assert.equal(organization.email, 'ammananafoodschennai@gmail.com');
  assert.equal(organization.address.addressLocality, 'Chennai');
  assert.equal(organization.areaServed.name, 'Chennai');
  if (origin) {
    assert.equal(organization.url, `${origin}/`);
    const website = data['@graph'].find(node => node['@type'] === 'WebSite');
    assert.equal(website.url, `${origin}/`);
  }
});

test('the supplier section is readable and its structured service describes the visible offering', () => {
  const html = fs.readFileSync(path.join(build, 'index.html'), 'utf8');
  assert.match(html, /<section[^>]+id="bulk-supply"/);
  assert.ok(html.includes('id="who-we-serve"'), 'existing audience links still resolve');
  assert.ok(html.includes('Sholinganallur, Chennai'));
  if (!origin) return;
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
  const service = graph.find(node => node['@type'] === 'Service');
  const webpage = graph.find(node => node['@type'] === 'WebPage');
  const organization = graph.find(node => node['@type'] === 'Organization');
  const website = graph.find(node => node['@type'] === 'WebSite');
  assert.equal(service.url, `${origin}/#bulk-supply`);
  assert.equal(service.provider['@id'], organization['@id']);
  assert.equal(service.areaServed.name, 'Chennai');
  assert.equal(webpage.url, `${origin}/`, 'the section belongs to the single canonical page');
  assert.equal(webpage.about['@id'], service['@id']);
  assert.equal(webpage.mainEntity['@id'], service['@id']);
  assert.equal(service.mainEntityOfPage['@id'], webpage['@id']);
  assert.equal(webpage.isPartOf['@id'], website['@id']);
  assert.equal(webpage.primaryImageOfPage.url, `${origin}/social-cover.png`);
  assert.ok(!JSON.stringify(service).includes('offers'), 'unconfirmed prices are not marked up as offers');
});

test('sitemap and robots expose the canonical page, and branded assets exist', () => {
  if (origin) {
    const sitemap = fs.readFileSync(path.join(build, 'sitemap.xml'), 'utf8');
    assert.ok(sitemap.includes(`<loc>${origin}/</loc>`));
    assert.ok(!sitemap.includes('#'), 'fragments are not separate indexable pages');
    assert.ok(fs.readFileSync(path.join(build, 'robots.txt'), 'utf8').includes(`${origin}/sitemap.xml`));
  } else {
    assert.ok(!fs.existsSync(path.join(build, 'sitemap.xml')));
  }
  assert.ok(fs.statSync(path.join(build, 'brand-logo.png')).size > 0);
  assert.ok(fs.statSync(path.join(build, 'social-cover.png')).size > 0);
});
