// Vercel Serverless Function (ESM) - proxy /api/* to external backend.
//
// Set BACKEND_URL in Vercel Environment Variables, e.g:
// BACKEND_URL=https://your-backend.up.railway.app
//
// This lets the frontend call same-origin /api/... without CORS issues.

function stripTrailingSlash(url) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

async function readBody(req) {
  // For GET/HEAD etc there is no body; returning undefined avoids fetch errors.
  if (req.method === 'GET' || req.method === 'HEAD') return undefined;

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return undefined;
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  const backend = process.env.BACKEND_URL;
  if (!backend) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(
      JSON.stringify({
        error:
          'BACKEND_URL is not configured on Vercel. Set BACKEND_URL to your backend base URL (e.g. https://your-backend.up.railway.app) and redeploy.'
      })
    );
    return;
  }

  const backendBase = stripTrailingSlash(backend);
  const targetUrl = `${backendBase}${req.url}`; // req.url already contains /api/...

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
}

