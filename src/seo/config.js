/**
 * SEO metadata shared by the app (runtime <head> updates) and by the build
 * (vite.config.js writes a static HTML file per route, plus sitemap.xml and
 * robots.txt). Plain JS with no JSX/imports, so Node can load it at build time.
 *
 * The public origin comes from VITE_SITE_URL at build time (see .env.example).
 */

export const SITE_NAME = 'AI Finder';
export const DEFAULT_SITE_URL = 'https://ws-58.ws.semalt.dev';
export const OG_IMAGE = 'og-image.png'; // public/og-image.png, 1200×630
export const OG_IMAGE_ALT = 'AI Finder — a catalogue of AI websites built on the FreeSerp API';

/** Open Graph locale per UI language. */
export const OG_LOCALES = { en: 'en_GB', uk: 'uk_UA' };

/**
 * Indexable routes. `file` is the static HTML written by the build for that URL
 * (nginx / .htaccess map `/new` → `new.html`). `type` is the schema.org page type.
 */
export const ROUTES = [
  {
    path: '/',
    file: 'index.html',
    type: 'CollectionPage',
    changefreq: 'daily',
    priority: '1.0',
    en: {
      title: 'AI Finder — a catalogue of AI tools and websites',
      description:
        'Search and filter AI websites by what they actually do: chatbots, image and video generation, voice, code, agents and more. Live data from the FreeSerp index.',
    },
    uk: {
      title: 'AI Finder — каталог ШІ-інструментів і сайтів',
      description:
        'Шукайте й фільтруйте ШІ-сайти за тим, що вони справді вміють: чат-боти, генерація зображень і відео, голос, код, агенти. Живі дані з індексу FreeSerp.',
    },
  },
  {
    path: '/new',
    file: 'new.html',
    type: 'CollectionPage',
    changefreq: 'daily',
    priority: '0.8',
    en: {
      title: 'New AI tools — the latest AI launches · AI Finder',
      description:
        'The most recently launched AI websites, grouped by launch date, with Domain Rating, category and builder signals. Updated from the FreeSerp index.',
    },
    uk: {
      title: 'Нові ШІ-інструменти — останні запуски · AI Finder',
      description:
        'Найсвіжіші ШІ-сайти, згруповані за датою запуску, з рейтингом домену, категоріями та технологіями. Дані з індексу FreeSerp.',
    },
  },
  {
    path: '/about',
    file: 'about.html',
    type: 'AboutPage',
    changefreq: 'monthly',
    priority: '0.5',
    en: {
      title: 'About AI Finder — data from the FreeSerp API',
      description:
        'What AI Finder is, who it is for and where the data comes from: the free, keyless FreeSerp API and its index of website homepages.',
    },
    uk: {
      title: 'Про AI Finder — дані з FreeSerp API',
      description:
        'Що таке AI Finder, для кого він і звідки дані: безкоштовний FreeSerp API без ключа та його індекс головних сторінок сайтів.',
    },
  },
];

/** Not indexed (robots noindex); served by the server with a real 404 status. */
export const NOT_FOUND = {
  path: null,
  file: '404.html',
  type: 'WebPage',
  noindex: true,
  en: {
    title: 'Page not found · AI Finder',
    description: 'This page is not in the AI Finder index.',
  },
  uk: {
    title: 'Сторінку не знайдено · AI Finder',
    description: 'Такої сторінки немає в індексі AI Finder.',
  },
};

export function findRoute(pathname) {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return ROUTES.find((r) => r.path === clean) ?? NOT_FOUND;
}

/** Absolute URL for a route path, e.g. ('https://x.dev', '/', '/new') → 'https://x.dev/new'. */
export function absoluteUrl(siteUrl, base, path) {
  const root = siteUrl.replace(/\/+$/, '') + (base || '/').replace(/\/+$/, '');
  return path === '/' ? `${root}/` : `${root}${path}`;
}

/** schema.org JSON-LD for a page (WebSite with search + the page itself). */
export function jsonLd({ siteUrl, base, route, lang }) {
  const home = absoluteUrl(siteUrl, base, '/');
  const meta = route[lang] ?? route.en;
  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${home}#website`,
      url: home,
      name: SITE_NAME,
      inLanguage: ['en', 'uk'],
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${home}?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ];
  if (route.path) {
    graph.push({
      '@type': route.type,
      '@id': `${absoluteUrl(siteUrl, base, route.path)}#webpage`,
      url: absoluteUrl(siteUrl, base, route.path),
      name: meta.title,
      description: meta.description,
      isPartOf: { '@id': `${home}#website` },
      inLanguage: lang,
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
