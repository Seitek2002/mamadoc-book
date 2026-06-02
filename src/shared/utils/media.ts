const internalHostRe = /^https?:\/\/backend:\d+/;
const publicBase = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/api\/v1\/?$/, '');

export function fixMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  return internalHostRe.test(url) ? url.replace(internalHostRe, publicBase) : url;
}
