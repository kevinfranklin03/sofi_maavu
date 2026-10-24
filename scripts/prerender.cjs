/* Render the public page into the production HTML for crawlers and fast first paint.
 * Interactive behaviour still comes from the normal React client bundle. */
process.env.NODE_ENV = 'production';
const fs = require('node:fs');
const path = require('node:path');
const babel = require('@babel/core');
const React = require('react');
const { renderToString } = require('react-dom/server');
const root = path.resolve(__dirname, '..');
process.loadEnvFile(path.join(root, '.env.production'));
const source = path.join(root, 'src') + path.sep;
const output = path.join(root, 'build');
const manifest = JSON.parse(fs.readFileSync(path.join(output, 'asset-manifest.json'), 'utf8'));
const originalJS = require.extensions['.js'];
const compile = (module, filename) => {
  if (!filename.startsWith(source)) return originalJS(module, filename);
  const { code } = babel.transformFileSync(filename, {
    babelrc: false, configFile: false,
    presets: [[require.resolve('@babel/preset-env'), { targets: { node: 'current' } }], [require.resolve('@babel/preset-react'), { runtime: 'automatic' }]],
  });
  module._compile(code, filename);
};
require.extensions['.js'] = compile;
require.extensions['.jsx'] = compile;
require.extensions['.css'] = module => { module.exports = {}; };
for (const extension of ['.png', '.jpg', '.jpeg', '.svg']) {
  require.extensions[extension] = (module, filename) => {
    const filenameOnly = path.basename(filename);
    const key = `static/media/${filenameOnly}`;
    if (!manifest.files[key]) throw new Error(`Missing production asset: ${filenameOnly}`);
    module.exports = manifest.files[key];
  };
}
const LandingPage = require('../src/pages/LandingPage.jsx').default;
const markup = renderToString(React.createElement(LandingPage));
const index = path.join(output, 'index.html');
let html = fs.readFileSync(index, 'utf8');
// Set SITE_URL only after choosing the actual public host.
if (process.env.SITE_URL) {
  const site = new URL(process.env.SITE_URL);
  if (site.protocol !== 'https:' || site.pathname !== '/' || site.search || site.hash || site.username || site.password) {
    throw new Error('SITE_URL must be an HTTPS origin, for example https://your-site.pages.dev');
  }
  const origin = site.origin;
  const canonical = `${origin}/`;
  html = html.replace('</head>', `<link rel="canonical" href="${canonical}"/><meta property="og:url" content="${canonical}"/></head>`);
  html = html.replaceAll('content="/social-cover.png"', `content="${origin}/social-cover.png"`);
  html = html.replace(/<script type="application\/ld\+json">(.*?)<\/script>/s, (_, json) => {
    const organization = { ...JSON.parse(json), '@id': `${canonical}#organization`, url: canonical, logo: `${origin}/brand-logo.png` };
    const website = { '@type': 'WebSite', '@id': `${canonical}#website`, name: organization.name, url: canonical, inLanguage: 'en', publisher: { '@id': organization['@id'] } };
    const service = {
      '@type': 'Service', '@id': `${canonical}#batter-supply`,
      name: 'Idli and dosa batter supply in Chennai',
      serviceType: 'Customised batter supply for homes and professional kitchens',
      description: 'Idli and dosa batter prepared in Sholinganallur, Chennai, with customised rice-to-dal ratios and pack sizes for homes, hotels, restaurants, caterers, hospitals and PG kitchens. Enquire about quantities, quotations and delivery availability.',
      url: `${canonical}#bulk-supply`,
      provider: { '@id': organization['@id'] },
      areaServed: { '@type': 'City', name: 'Chennai' },
      mainEntityOfPage: { '@id': `${canonical}#webpage` },
    };
    const webpage = {
      '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical,
      name: 'Amma Nana Foods | Idli & Dosa Batter Supplier in Chennai',
      description: 'Fresh idli and dosa batter from Amma Nana Foods in Sholinganallur, Chennai. Explore our batters and enquire about customised bulk kitchen supply.',
      inLanguage: 'en', isPartOf: { '@id': website['@id'] },
      publisher: { '@id': organization['@id'] },
      about: { '@id': service['@id'] },
      mainEntity: { '@id': service['@id'] },
      primaryImageOfPage: { '@type': 'ImageObject', url: `${origin}/social-cover.png` },
    };
    delete organization['@context'];
    return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [organization, website, service, webpage] }).replaceAll('<', '\\u003c')}</script>`;
  });
  fs.writeFileSync(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${canonical}</loc></url></urlset>`);
  fs.appendFileSync(path.join(output, 'robots.txt'), `\nSitemap: ${origin}/sitemap.xml\n`);
}
if (!html.includes('<div id="root"></div>')) throw new Error('Expected an empty React root before prerendering.');
fs.writeFileSync(index, html.replace('<div id="root"></div>', `<div id="root"><div class="site-root"><a class="skip-link" href="#main-content">Skip to content</a>${markup}</div></div>`));
console.log('Prerendered all public page sections into build/index.html.');
