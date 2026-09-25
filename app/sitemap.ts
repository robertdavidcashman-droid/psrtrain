import type { MetadataRoute } from 'next';
import { getAllBlogSlugs, getBlogPost } from '@/lib/blog/content';
import { getAllGuideSlugs, getGuide } from '@/lib/guides/content';
import { getAllLegalAdviceArticles, legalAdvicePath } from '@/lib/legal-advice/content';
import { allTrainingSeoSlugs } from '@/lib/training-seo-landings';
import {
  getAppRouteLastModified,
  getBuildLastModified,
  parseContentPublished,
} from '@/lib/sitemap-dates';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://psrtrain.com';

/** Static generation — avoids intermittent dynamic sitemap failures on serverless. */
export const dynamic = 'force-static';

const STATIC_ROUTE_FILES: Record<string, string> = {
  '': 'page.tsx',
  '/pricing': 'pricing/page.tsx',
  '/features': 'features/page.tsx',
  '/training': 'training/page.tsx',
  '/legal/about': 'legal/about/page.tsx',
  '/legal/faq': 'legal/faq/page.tsx',
  '/legal/contact': 'legal/contact/layout.tsx',
  '/legal/about-the-role': 'legal/about-the-role/page.tsx',
  '/legal/accreditation-process': 'legal/accreditation-process/page.tsx',
  '/legal/how-our-training-helps': 'legal/how-our-training-helps/page.tsx',
  '/legal/course-content': 'legal/course-content/page.tsx',
  '/legal/who-this-is-for': 'legal/who-this-is-for/page.tsx',
  '/legal/disclaimer': 'legal/disclaimer/page.tsx',
  '/legal/terms': 'legal/terms/page.tsx',
  '/legal/privacy': 'legal/privacy/page.tsx',
  '/legal/cookies': 'legal/cookies/page.tsx',
  '/legal/refund': 'legal/refund/page.tsx',
  '/legal/complaints': 'legal/complaints/page.tsx',
  '/legal-advice': 'legal-advice/page.tsx',
  '/guides': 'guides/page.tsx',
  '/blog': 'blog/page.tsx',
};

function staticRouteLastModified(path: string): Date {
  const file = STATIC_ROUTE_FILES[path];
  if (!file) return getBuildLastModified();
  return getAppRouteLastModified(file);
}

const trainingSeoLastModified = getAppRouteLastModified('training-seo/[slug]/page.tsx');

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: {
    path: string;
    priority: number;
    freq: MetadataRoute.Sitemap[number]['changeFrequency'];
    lastModified?: Date;
  }[] = [
    { path: '', priority: 1.0, freq: 'weekly', lastModified: staticRouteLastModified('') },
    { path: '/pricing', priority: 0.9, freq: 'monthly', lastModified: staticRouteLastModified('/pricing') },
    { path: '/features', priority: 0.8, freq: 'monthly', lastModified: staticRouteLastModified('/features') },
    { path: '/training', priority: 0.8, freq: 'monthly', lastModified: staticRouteLastModified('/training') },
    { path: '/legal/about', priority: 0.7, freq: 'monthly', lastModified: staticRouteLastModified('/legal/about') },
    { path: '/legal/faq', priority: 0.8, freq: 'monthly', lastModified: staticRouteLastModified('/legal/faq') },
    { path: '/legal/contact', priority: 0.6, freq: 'monthly', lastModified: staticRouteLastModified('/legal/contact') },
    { path: '/legal/about-the-role', priority: 0.7, freq: 'monthly', lastModified: staticRouteLastModified('/legal/about-the-role') },
    { path: '/legal/accreditation-process', priority: 0.7, freq: 'monthly', lastModified: staticRouteLastModified('/legal/accreditation-process') },
    { path: '/legal/how-our-training-helps', priority: 0.7, freq: 'monthly', lastModified: staticRouteLastModified('/legal/how-our-training-helps') },
    { path: '/legal/course-content', priority: 0.7, freq: 'monthly', lastModified: staticRouteLastModified('/legal/course-content') },
    { path: '/legal/who-this-is-for', priority: 0.7, freq: 'monthly', lastModified: staticRouteLastModified('/legal/who-this-is-for') },
    { path: '/legal/disclaimer', priority: 0.5, freq: 'yearly', lastModified: staticRouteLastModified('/legal/disclaimer') },
    { path: '/legal/terms', priority: 0.5, freq: 'yearly', lastModified: staticRouteLastModified('/legal/terms') },
    { path: '/legal/privacy', priority: 0.5, freq: 'yearly', lastModified: staticRouteLastModified('/legal/privacy') },
    { path: '/legal/cookies', priority: 0.4, freq: 'yearly', lastModified: staticRouteLastModified('/legal/cookies') },
    { path: '/legal/refund', priority: 0.4, freq: 'yearly', lastModified: staticRouteLastModified('/legal/refund') },
    { path: '/legal/complaints', priority: 0.4, freq: 'yearly', lastModified: staticRouteLastModified('/legal/complaints') },
    { path: '/legal-advice', priority: 0.8, freq: 'monthly', lastModified: staticRouteLastModified('/legal-advice') },
    { path: '/guides', priority: 0.85, freq: 'weekly', lastModified: staticRouteLastModified('/guides') },
    { path: '/blog', priority: 0.85, freq: 'weekly', lastModified: staticRouteLastModified('/blog') },
  ];

  const contentFallback = getBuildLastModified();

  const guideRoutes = getAllGuideSlugs().map((slug) => ({
    path: `/guides/${slug}`,
    priority: 0.75,
    freq: 'monthly' as const,
    lastModified: parseContentPublished(getGuide(slug)?.published, contentFallback),
  }));

  const blogRoutes = getAllBlogSlugs().map((slug) => ({
    path: `/blog/${slug}`,
    priority: 0.75,
    freq: 'monthly' as const,
    lastModified: parseContentPublished(getBlogPost(slug)?.published, contentFallback),
  }));

  const trainingSeoRoutes = allTrainingSeoSlugs().map((slug) => ({
    path: `/${slug}`,
    priority: 0.72,
    freq: 'monthly' as const,
    lastModified: trainingSeoLastModified,
  }));

  const legalAdviceRoutes = getAllLegalAdviceArticles().map((article) => ({
    path: legalAdvicePath(article),
    priority: 0.7,
    freq: 'monthly' as const,
    lastModified: parseContentPublished(article.published, contentFallback),
  }));

  const allRoutes = [...routes, ...guideRoutes, ...blogRoutes, ...legalAdviceRoutes, ...trainingSeoRoutes];

  return allRoutes.map(({ path, priority, freq, lastModified }) => ({
    url: `${baseUrl}${path}`,
    lastModified: lastModified ?? getBuildLastModified(),
    changeFrequency: freq,
    priority,
  }));
}
