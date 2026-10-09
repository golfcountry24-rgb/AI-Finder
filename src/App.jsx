import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { I18nProvider } from './i18n';
import { Layout } from './components/Layout';
import { ExplorePage } from './pages/ExplorePage';
import { NewPage } from './pages/NewPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

/** Router base: '/' by default, or the sub-folder set with VITE_BASE at build time. */
const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

/**
 * Clean URLs (/new, /about) so search engines see every page. The build writes a
 * static HTML file per route (new.html, about.html, 404.html) and the server maps
 * /new → new.html (nginx: deploy/nginx.conf, Apache: public/.htaccess), so a
 * refresh or a deep link never ends in a 404.
 */
export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter basename={BASENAME}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<ExplorePage />} />
            <Route path="new" element={<NewPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
}
