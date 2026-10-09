import { useEffect } from 'react';
import { OG_LOCALES, absoluteUrl, findRoute, jsonLd } from './config.js';

const SITE_URL = import.meta.env.VITE_SITE_URL;
const BASE = import.meta.env.BASE_URL;

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Keeps <head> in sync with the current route and UI language on client-side
 * navigation. The first load already has the right tags in the static HTML
 * written by the build, so this only matters after navigation or a language switch.
 * Filtered Explore URLs (?q=, ?cat=) keep the canonical of the plain page.
 */
export function useSeo(pathname, lang) {
  useEffect(() => {
    const route = findRoute(pathname);
    const meta = route[lang] ?? route.en;
    const url = route.path ? absoluteUrl(SITE_URL, BASE, route.path) : null;

    document.title = meta.title;
    setMeta('name', 'description', meta.description);
    setMeta('name', 'robots', route.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    setCanonical(url);
    setMeta('property', 'og:title', meta.title);
    setMeta('property', 'og:description', meta.description);
    if (url) setMeta('property', 'og:url', url);
    setMeta('property', 'og:locale', OG_LOCALES[lang]);
    setMeta('property', 'og:locale:alternate', OG_LOCALES[lang === 'en' ? 'uk' : 'en']);
    setMeta('name', 'twitter:title', meta.title);
    setMeta('name', 'twitter:description', meta.description);

    const ld = document.getElementById('ld-json');
    if (ld) ld.textContent = JSON.stringify(jsonLd({ siteUrl: SITE_URL, base: BASE, route, lang }));
  }, [pathname, lang]);
}
