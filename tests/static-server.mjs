import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const HOST = "127.0.0.1";
const PORT = 4173;
const BASE_PATH = "/app-comparativa-modelos";
const DIST_DIR = normalize(join(process.cwd(), "dist"));

const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

if (!existsSync(DIST_DIR)) {
  console.error(
    "Missing dist directory. Run `astro build` before starting the test server.",
  );
  process.exit(1);
}

function resolveFilePath(urlPath) {
  if (urlPath === "/" || urlPath === "") {
    return join(DIST_DIR, "index.html");
  }

  const normalizedPath = urlPath.replace(/^\/+/, "");
  const candidate = join(DIST_DIR, normalizedPath);

  if (existsSync(candidate) && statSync(candidate).isFile()) {
    return candidate;
  }

  if (!extname(candidate)) {
    return join(candidate, "index.html");
  }

  return candidate;
}

createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${HOST}:${PORT}`);

  if (requestUrl.pathname === "/") {
    res.writeHead(302, { Location: `${BASE_PATH}/` });
    res.end();
    return;
  }

  if (!requestUrl.pathname.startsWith(BASE_PATH)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const relativePath = requestUrl.pathname.slice(BASE_PATH.length);
  const filePath = resolveFilePath(relativePath);

  if (!existsSync(filePath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const extension = extname(filePath);
  const contentType = CONTENT_TYPES[extension] ?? "application/octet-stream";
  const content = readFileSync(filePath);

  res.writeHead(200, { "Content-Type": contentType });
  res.end(content);
}).listen(PORT, HOST, () => {
  console.log(
    `Static test server running at http://${HOST}:${PORT}${BASE_PATH}/`,
  );
});
