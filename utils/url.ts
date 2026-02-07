export function buildUrl(
  base: string,
  path: string,
  params: Record<string, string | number>
) {
  const url = new URL(`${base}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  return url.toString();
}
