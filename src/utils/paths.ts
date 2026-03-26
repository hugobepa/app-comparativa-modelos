const BASE_URL = import.meta.env.BASE_URL;

export function withBase(path = "/"): string {
  const normalizedBase = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;

  if (path === "/") {
    return normalizedBase;
  }

  const normalizedPath = path.replace(/^\/+/, "");
  return `${normalizedBase}${normalizedPath}`;
}

export function stripBasePath(pathname = "/"): string {
  if (!pathname) {
    return "/";
  }

  if (BASE_URL === "/") {
    return pathname;
  }

  if (pathname === BASE_URL || pathname === `${BASE_URL}/`) {
    return "/";
  }

  return pathname.startsWith(BASE_URL)
    ? pathname.slice(BASE_URL.length) || "/"
    : pathname;
}
