import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { DEFAULT_SITE_URL, NOT_FOUND, ROUTES, absoluteUrl } from './src/seo/config.js';
import { headTags } from './src/seo/head.js';

/**
 * In production the browser calls the same-origin PHP proxies in public/api/
 * (freeserp.php for data, favicon.php for site icons). Node has no PHP, so during
 * `npm run dev` and `npm run preview` the same paths are served here.
 */
const freeserpProxy = {
  '/api/freeserp.php': {
    target: 'https://freeserp.ai',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/api\/freeserp\.php/, '/api.php'),
  },
};

/** Dev/preview twin of public/api/favicon.php: icon when it exists, 204 when it doesn't. */
const HOSTNAME = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

function faviconMiddleware() {
  const cache = new Map();
  return async (req, res, next) => {
    if (!req.url?.startsWith('/api/favicon.php')) return next();
    const noIcon = () => {
      res.statusCode = 204;
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.end();
    };
    const domain = (new URL(req.url, 'http://local').searchParams.get('d') || '').toLowerCase();
    if (!HOSTNAME.test(domain)) return noIcon();
    try {
      let icon = cache.get(domain);
      if (icon === undefined) {
        const upstream = await fetch(`https://icons.duckduckgo.com/ip3/${domain}.ico`, {
          signal: AbortSignal.timeout(8000),
        });
        const type = upstream.headers.get('content-type') || '';
        const body = Buffer.from(await upstream.arrayBuffer());
        icon = upstream.ok && type.includes('image') && body.length >= 32 ? { type, body } : null;
        cache.set(domain, icon);
      }
      if (!icon) return noIcon();
      res.setHeader('Content-Type', icon.type);
      res.setHeader('Cache-Control', 'public, max-age=604800');
      res.end(icon.body);
    } catch {
      noIcon();
    }
  };
}

const faviconPlugin = {
  name: 'ai-finder-favicon-proxy',
  configureServer(server) {
    server.middlewares.use(faviconMiddleware());
  },
  configurePreviewServer(server) {
    server.middlewares.use(faviconMiddleware());
  },
};

/**
 * SEO at build time:
 *  - one static HTML file per route (index.html, new.html, about.html, 404.html),
 *    each with its own <title>, description, canonical, Open Graph and JSON-LD,
 *    so crawlers and link previews get the right tags without running JS;
 *  - sitemap.xml and robots.txt for VITE_SITE_URL.
 * In dev the home page tags are injected so the head looks the same.
 */
function seoPlugin({ siteUrl, base }) {
  const MARK = '<!--seo-head-->';
  let isBuild = false;
  return {
    name: 'ai-finder-seo',
    enforce: 'post', // after Vite has produced index.html
    configResolved(config) {
      isBuild = config.command === 'build';
    },
    transformIndexHtml(html) {
      // dev: fill in the home page; build: keep the marker for generateBundle
      return isBuild ? html : html.replace(MARK, headTags({ siteUrl, base, route: ROUTES[0] }));
    },
    generateBundle(_, bundle) {
      const index = bundle['index.html'];
      if (!index) return;
      const template = String(index.source);
      for (const route of [...ROUTES, NOT_FOUND]) {
        const html = template.replace(MARK, headTags({ siteUrl, base, route }));
        if (route.file === 'index.html') index.source = html;
        else this.emitFile({ type: 'asset', fileName: route.file, source: html });
      }
      const today = new Date().toISOString().slice(0, 10);
      const urls = ROUTES.map(
        (r) =>
          `  <url>\n    <loc>${absoluteUrl(siteUrl, base, r.path)}</loc>\n    <lastmod>${today}</lastmod>\n` +
          `    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`,
      ).join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nDisallow: ${base}api/\n\nSitemap: ${absoluteUrl(siteUrl, base, '/')}sitemap.xml\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // public origin for canonical / Open Graph / sitemap (no trailing slash)
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');
  // '/' for a domain root; e.g. VITE_BASE=/ai-finder/ for a sub-folder
  const base = env.VITE_BASE || '/';

  return {
    base,
    define: { 'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl) },
    plugins: [react(), faviconPlugin, seoPlugin({ siteUrl, base })],
    server: { proxy: freeserpProxy },
    preview: { proxy: freeserpProxy },
    test: {
      include: ['src/**/*.test.{js,jsx}'],
      environment: 'node', // hook/component tests switch to jsdom per file
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false,
    },
  };
});
