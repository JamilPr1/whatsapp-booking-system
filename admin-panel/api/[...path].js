// Vercel Serverless Function (CommonJS) - proxy /api/* to external backend.
//
// IMPORTANT:
// - This project can be deployed in 2 ways:
//   1) Root Directory = repo root (recommended for full-stack on Vercel) -> uses `/api/[...path].js`
//   2) Root Directory = `admin-panel` (frontend-only) -> this file is used, and it REQUIRES `BACKEND_URL`
//
// If your Vercel Root Directory is `admin-panel`, you must set:
// - BACKEND_URL=https://<your-backend-host>
//
// Otherwise, change Root Directory to repo root to use the bundled backend serverless function.

function stripTrailingSlash(url) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

async function readBody(req) {
  // For GET/HEAD etc there is no body; returning undefined avoids fetch errors.
  if (req.method === 'GET' || req.method === 'HEAD') return undefined;

  const chunks = [];
  // Node IncomingMessage is an async iterable in Node 16+ (Vercel Node runtime)
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return undefined;
  return Buffer.concat(chunks);
}

module.exports = async (req, res) => {
  // Always respond to /api/health without crashing (helps debugging)
  if (req.method === 'GET' && (req.url === '/api/health' || req.url === '/api/health/')) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(
      JSON.stringify({
        ok: true,
        mode: 'admin-panel-proxy',
        hasBackendUrl: Boolean(process.env.BACKEND_URL)
      })
    );
    return;
  }

  const backend = process.env.BACKEND_URL;
  if (!backend) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(
      JSON.stringify({
        error:
          'BACKEND_URL missing. Aapke Vercel project ka Root Directory `admin-panel` lag raha hai. Ya to BACKEND_URL set karein (backend ko Railway/Render pe host karke), ya Root Directory ko repo root pe switch karein taa-ke backend same Vercel project me chale.'
      })
    );
    return;
  }

  const backendBase = stripTrailingSlash(backend);
  // Depending on Vercel routing, req.url might be "/auth/login" or "/api/auth/login".
  const path = req.url && req.url.startsWith('/api') ? req.url : `/api${req.url || ''}`;
  const targetUrl = `${backendBase}${path}`;

  const headers = { ...req.headers };
  // Remove hop-by-hop headers (Node lowercases header keys).
  delete headers.connection;
  delete headers.host;
  delete headers['content-length'];

  try {
    const body = await readBody(req);
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      body
    });

    res.statusCode = upstream.status;

    const contentType = upstream.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);

    const text = await upstream.text();
    res.end(text);
  } catch (err) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Proxy error', details: String(err?.message || err) }));
  }
};

