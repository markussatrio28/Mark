# Enchanted Lavender Garden

A lightweight, static birthday surprise website. It uses local CSS, JavaScript, a small SVG garden illustration, and a self-hosted Motion browser bundle; no build step, external images, remote fonts, audio, or app installation is required. The root URL (`/`) is the clean public URL.

The Motion bundle and its license are in `assets/js/vendor/`. The site does not load animation code from a CDN.

## Personalize the page

Edit `assets/js/garden-data.js` to replace the name, date, memory captions, letter, hidden message, and final note. Add optimized photos under `assets/images/memories/`, then set the matching `photo` fields to relative paths such as `./assets/images/memories/first-meet.webp`. Use WebP or AVIF where possible and keep each photo reasonably small for mobile connections. The page lazy-loads these photos.

## Deploy to Vercel

1. Push this folder to a Git provider.
2. Import the repository in Vercel and leave the framework preset as **Other**.
3. Leave the build command empty and use `.` as the output directory.
4. Deploy. The site is served at `/`; `vercel.json` enables clean URLs and sets basic response headers.

## Deploy to Netlify

1. Push this folder to a Git provider or upload the project folder to Netlify.
2. Set the publish directory to `.` and leave the build command empty.
3. Deploy. `netlify.toml` enables pretty URLs and sets cache and response headers.

## Custom domain

Connect a domain in the hosting provider's domain settings and apply the DNS records shown there. The project contains no hard-coded hostname, so no code change is needed when the domain changes.

The hosting provider supplies HTTPS and the public URL. The project itself does not deploy or register a domain.
