import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

const distPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');

// Health check endpoint for Cloud Run container monitoring
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Serve compiled static assets from dist
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Serve assets from public
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

// Single Page Application routing: serve index.html for all client-side routes
app.get('*', (req, res) => {
  const distIndex = path.join(distPath, 'index.html');
  if (fs.existsSync(distIndex)) {
    res.sendFile(distIndex);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
