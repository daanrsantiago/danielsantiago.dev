import { getPosts } from '@/app/utils/utils'
import { baseURL, routes } from '@/app/resources'
import { routing } from '@/i18n/routing'

// Sitemap entries must be absolute URLs that answer 200 directly: the default locale
// has no prefix (localePrefix 'as-needed'), so `/en/...` would only redirect.
const localizedURL = (locale: string, path: string) => {
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
    return `https://${baseURL}${prefix}${path}`;
};

export default async function sitemap() {

    const locales = routing.locales;

    let blogs = locales.flatMap((locale) =>
        getPosts(['src', 'app', '[locale]', 'blog', 'posts', locale]).map((post) => ({
            url: localizedURL(locale, `/blog/${post.slug}`),
            lastModified: post.metadata.publishedAt,
        }))
    );

    let works = locales.flatMap((locale) =>
        getPosts(['src', 'app', '[locale]', 'work', 'projects', locale]).map((post) => ({
            url: localizedURL(locale, `/work/${post.slug}`),
            lastModified: post.metadata.publishedAt,
        }))
    );

    const activeRoutes = Object.keys(routes).filter((route) => routes[route as keyof typeof routes]);

    let pages = locales.flatMap((locale) =>
        activeRoutes.map((route) => ({
            url: localizedURL(locale, route === '/' ? '' : route),
            lastModified: new Date().toISOString().split('T')[0],
        }))
    );

    return [...pages, ...blogs, ...works]
}
