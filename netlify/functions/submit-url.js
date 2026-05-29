const INDEXNOW_KEY = '8889fa943f7648d681abe09b8b11b5ab';
const SITE_URL = 'https://itsallaboutmind.com';

const INDEXNOW_HOSTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
];

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { url } = body;
  if (!url) {
    return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400 });
  }

  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;

  const payload = {
    host: 'itsallaboutmind.com',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: [fullUrl],
  };

  const results = await Promise.allSettled([
    // IndexNow (covers Bing, Yandex, Seznam, Naver, etc.)
    ...INDEXNOW_HOSTS.map(host =>
      fetch(host, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      }).then(r => ({ host, status: r.status, ok: r.ok }))
    ),
    // Google sitemap ping
    fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(`${SITE_URL}/sitemap-index.xml`)}`)
      .then(r => ({ host: 'google-sitemap-ping', status: r.status, ok: r.ok })),
  ]);

  const summary = results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value;
    return { host: INDEXNOW_HOSTS[i] || 'unknown', error: r.reason?.message };
  });

  const allOk = summary.every(s => s.ok || s.status === 200);

  return new Response(JSON.stringify({ success: allOk, url: fullUrl, results: summary }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const config = { path: '/api/submit-url' };
