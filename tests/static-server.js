// Minimal static file server for testing the built `public/` output.
// Hexo bakes the configured `root` (see _config.yml) into every absolute
// link/asset path, so this server mounts `public/` under that same prefix
// (currently "/", the domain root, since the site is served from
// alxndr.photos rather than a /photography/ subpath).
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = 4001;
const BASE_PATH = '';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
};

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://localhost:${PORT}`);
  let requestPath = requestUrl.pathname;

  if (!requestPath.startsWith(BASE_PATH)) {
    response.writeHead(404);
    response.end('Not found (outside base path)');
    return;
  }
  requestPath = requestPath.slice(BASE_PATH.length) || '/';
  if (requestPath.endsWith('/')) {
    requestPath += 'index.html';
  }

  const filePath = path.join(PUBLIC_DIR, requestPath);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    const extension = path.extname(filePath);
    response.writeHead(200, { 'Content-Type': MIME_TYPES[extension] ?? 'application/octet-stream' });
    response.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Static server serving ${PUBLIC_DIR} at http://localhost:${PORT}${BASE_PATH}/`);
});
