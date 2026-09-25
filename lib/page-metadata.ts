import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

/** Shared default social preview — matches `app/opengraph-image.tsx`. */
export const DEFAULT_OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'PSR Train - Police Station Representative Training',
} as const;

export const DEFAULT_OG_IMAGES = [DEFAULT_OG_IMAGE];

type TitleInput = string | { absolute: string };

type PageMetaInput = {
  title: TitleInput;
  description: string;
  path: string;
  keywords?: string[];
  openGraph?: Partial<NonNullable<Metadata['openGraph']>>;
  robots?: Metadata['robots'];
};

function normalisePath(path: string): string {
  if (!path || path === '/') return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

/** Per-page SEO metadata with correct canonical URL and Open Graph url. */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  openGraph,
  robots,
}: PageMetaInput): Metadata {
  const canonicalPath = normalisePath(path);
  const titleValue = typeof title === 'string' ? title : title;
  const titleText = typeof title === 'string' ? title : title.absolute;
  const ogImages = openGraph?.images ?? DEFAULT_OG_IMAGES;
  const twitterImages =
    openGraph?.images !== undefined
      ? (openGraph.images as NonNullable<Metadata['twitter']>['images'])
      : DEFAULT_OG_IMAGES.map((img) => img.url);

  return {
    title: titleValue,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: titleText,
      description,
      url: canonicalPath,
      siteName: SITE.name,
      locale: 'en_GB',
      type: 'website',
      ...openGraph,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: titleText,
      description,
      images: twitterImages,
    },
    ...(robots ? { robots } : {}),
  };
}
