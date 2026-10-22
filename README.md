# Amma Nana Foods

A single-page fresh-batter website with a product catalogue, brand promise, preparation process, founder story, bulk-supply information, and enquiry form. React frontend, Express API, and server-side SMTP email delivery.

## Run locally

Use Node.js 22 or 24 and npm.

```sh
npm ci
npm start
```

The frontend runs at http://localhost:3000 and proxies `/api` to http://127.0.0.1:3002. If port 3000 is busy, use PowerShell:

```powershell
$env:PORT='3001'
npm start
```

Both processes start together. No third-party email account is created automatically.

## Configure enquiry delivery

Copy `.env.server.example` to `.env.server.local`. Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM`, `ENQUIRY_TO`, and the SMTP service's `SMTP_USER`/`SMTP_PASS`. Keep credentials in that ignored server file; never put them in a `REACT_APP_` variable or commit them.

Use a sender approved by your email service. Port 465 uses implicit TLS; other ports require STARTTLS by default. Leave `SMTP_ALLOW_PLAINTEXT=false` for real delivery. Restart `npm start` after changing server settings. The destination is configured only on the server; visitors cannot change it.

`POST /api/enquiries` accepts `{ name, contact, message, website: '' }`. It validates fields, limits request size and submission rate, and reports success only after the SMTP server accepts the email. SMTP acceptance does not guarantee delivery to the recipient's inbox. Missing settings return 503; SMTP failures return 502. The form preserves the message for retry and never opens an email app.

`GET /api/health` reports whether the API is running and SMTP settings are present. It does not expose credentials or verify an SMTP connection.

## Check and build

```sh
npm test -- --watchAll=false
npm run test:server
npm run build
```

The backend suite performs an actual SMTP transaction against an isolated local test server. It also checks validation, request limits, rate limiting, and delivery failures. No test emails are sent externally.

For production, build first, configure `.env.server.local` (or runtime environment variables), and run:

```powershell
$env:NODE_ENV='production'
npm run serve
```

The API serves `build/` and client-side routes on port 3002. Deploy behind HTTPS; set `API_HOST` to the interface required by your host. If a trusted reverse proxy sits in front, set `TRUST_PROXY_HOPS` to its exact hop count. The rate limit is per process; multiple instances need a shared rate-limit store.

## Responsive interface

The single page uses fluid grids, shared button and typography styles, a sticky section menu, and subtle one-time scroll reveals. Old URLs such as `/products` and `/contact` redirect to the matching anchor on the home page. Product links scroll to the enquiry form without losing entered details. Section clicks use one scroll handler and move keyboard focus to the destination; deep links and browser history restore instantly. Inputs use 16px text, support autofill, and expose pending, success, and error states to assistive technology. The menu supports Escape and outside-click dismissal, scrolls in short landscape viewports, and closes when resized to desktop. Reduced-motion preferences disable smooth scrolling and reveal animations. Content stays visible when IntersectionObserver is unavailable, and keyboard focus immediately reveals interactive content.

The responsive review covers widths from 280px to 2560px, including both sides of the navigation and grid breakpoints. Links and buttons have a minimum 44px touch height; product actions align within each row, and the smallest screens use a single-column product layout. Full mobile and desktop scroll passes verify that all images and content reveals load.

Business details and product/delivery claims originate from the existing content. Confirm them with the owner before launch.

## Independent static hosting

Cloudflare Pages project: `amma-nana-foods`. Public address: `https://amma-nana-foods.pages.dev`. The project uses Direct Upload; changes pushed to GitHub do not automatically deploy. To update it, run `npm run build` and `npm run test:seo`, zip the contents of `build/` (with `index.html` at the archive root), and upload a new production deployment in the Cloudflare Pages dashboard. The public origin is saved in `.env.production`; this file contains no credentials.

Keep `public/googlef4778944e001d925.html` in future deployments: it is the public Google Search Console ownership verification file for the business account. The Search Console property is the URL prefix `https://amma-nana-foods.pages.dev/`, and its sitemap is `/sitemap.xml`.

The frontend can be hosted on Cloudflare Pages or Netlify. Use `npm run build` as the build command and `build` as the output directory. Use Node 22 or later. No ChatGPT hosting configuration is required.

After the host assigns the public address, set the build environment variable `SITE_URL` to its HTTPS origin (for example, `https://your-site.pages.dev`). The build then generates the canonical URL, absolute social image URLs, sitemap, and robots sitemap entry. Without this setting, it leaves domain-specific SEO metadata unset. Run `npm run test:seo` after building to verify the generated HTML.

Production HTML includes the page content before JavaScript runs. `.env.production` currently enables a static contact panel linking to `ammananafoodschennai@gmail.com`, while email delivery setup is deferred. A static host cannot run the Express SMTP backend. To enable the enquiry form publicly, first deploy a compatible API or integrate the chosen host's form service, then replace this temporary contact panel. Local development continues to use the enquiry API.
