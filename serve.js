import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir = join(__dirname, 'docs');
const port = parseInt(process.env.PORT || '5000', 10);

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.vcf': 'text/vcard',
  '.mp4': 'video/mp4',
};

const server = createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url.endsWith('/')) {
    url += 'index.html';
  } else if (!extname(url)) {
    if (existsSync(join(docsDir, url, 'index.html'))) {
      res.writeHead(302, { Location: `${url}/` });
      res.end();
      return;
    }
    url += '.html';
  }

  const filePath = join(docsDir, url);

  if (existsSync(filePath)) {
    const ext = extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const content = readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } else {
    const notFoundPath = join(docsDir, '404.html');
    if (existsSync(notFoundPath)) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(readFileSync(notFoundPath));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Static site serving on http://localhost:${port}`);
});
