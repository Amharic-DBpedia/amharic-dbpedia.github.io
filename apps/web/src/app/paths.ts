function normalizeBasePath(value: string): string {
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export const appBasePath = normalizeBasePath(import.meta.env.BASE_URL);

export function appHref(href: string, basePath = appBasePath): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;

  const normalizedBasePath = normalizeBasePath(basePath);
  if (normalizedBasePath === "/") return href;
  if (href === normalizedBasePath.slice(0, -1) || href.startsWith(normalizedBasePath)) return href;
  return `${normalizedBasePath}${href.slice(1)}`;
}

export function appRoutePath(pathname: string, basePath = appBasePath): string | null {
  const normalizedBasePath = normalizeBasePath(basePath);
  if (normalizedBasePath === "/") return pathname;
  if (pathname === normalizedBasePath.slice(0, -1) || pathname === normalizedBasePath) return "/";
  if (!pathname.startsWith(normalizedBasePath)) return null;
  return `/${pathname.slice(normalizedBasePath.length)}`;
}
