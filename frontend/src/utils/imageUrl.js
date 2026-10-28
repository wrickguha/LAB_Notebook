/**
 * Resolves project banner and uploaded image URLs to the correct backend host/port.
 */
export function resolveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Fix http://localhost/storage/ missing port 8000
  if (url.startsWith('http://localhost/storage/')) {
    return url.replace('http://localhost/storage/', `${apiBase}/storage/`);
  }
  if (url.startsWith('http://127.0.0.1/storage/')) {
    return url.replace('http://127.0.0.1/storage/', `${apiBase}/storage/`);
  }

  // If URL is a relative path like /storage/...
  if (url.startsWith('/storage/')) {
    return `${apiBase}${url}`;
  }

  return url;
}
