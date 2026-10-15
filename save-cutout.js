const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/cutout.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync('cutout.html'));
  } else if (req.method === 'GET' && req.url === '/img/hero-statue.jpg') {
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.end(fs.readFileSync('img/hero-statue.jpg'));
  } else if (req.method === 'POST' && req.url === '/save') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const data = JSON.parse(body);
      const base64Data = data.image.replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync('img/hero-statue.png', base64Data, 'base64');
      console.log('Saved img/hero-statue.png successfully! Size:', fs.statSync('img/hero-statue.png').size);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
      setTimeout(() => process.exit(0), 500);
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3005, () => {
  console.log('Server listening on port 3005');
});
