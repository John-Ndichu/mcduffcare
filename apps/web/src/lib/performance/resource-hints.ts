/**
 * Resource hints and performance utilities.
 * Call these from client components after mount.
 */

/**
 * Prefetch a URL using <link rel="prefetch">.
 * Safe to call multiple times – deduplicates by href.
 */
export function prefetchUrl(href: string): void {
  if (typeof document === 'undefined') return;
  if (document.querySelector(`link[rel="prefetch"][href="${href}"]`) !== null) return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  link.as = 'document';
  document.head.appendChild(link);
}

/**
 * Preconnect to an origin (DNS + TLS).
 */
export function preconnect(origin: string, crossOrigin = false): void {
  if (typeof document === 'undefined') return;
  if (document.querySelector(`link[rel="preconnect"][href="${origin}"]`) !== null) return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = origin;
  if (crossOrigin) link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

/**
 * Generates a low-quality image placeholder (lqip) URL for a given
 * image URL by appending width/quality params (adjust to your CDN).
 */
export function getLqipUrl(imageUrl: string): string {
  try {
    const url = new URL(imageUrl);
    url.searchParams.set('w', '20');
    url.searchParams.set('q', '10');
    url.searchParams.set('blur', '10');
    return url.toString();
  } catch {
    return imageUrl;
  }
}

/**
 * Returns Next.js Image sizes prop string based on breakpoints.
 */
export const IMAGE_SIZES = {
  fullWidth: '100vw',
  halfWidth: '(min-width: 1024px) 50vw, 100vw',
  thirdWidth: '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  productCard: '(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw',
  thumbnail: '96px',
} as const;
