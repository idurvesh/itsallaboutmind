const INDEXNOW_KEY = '8889fa943f7648d681abe09b8b11b5ab';
const SITE_URL = 'https://itsallaboutmind.com';

const INDEXNOW_HOSTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
];

export async function onRequestPost({ request }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { url, urls } = body;
  let urlList = urls || (url ? [url] : []);
  if (!urlList.length) {
    return new Response(JSON.stringify({ error: 'Missing url or urls' }), { status: 400 });
  }

  urlList = urlList.map(u => u.startsWith('http') ? u : `${SITE_URL}${u}`);

  const payload = {
    host: 'itsallaboutmind.com',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  const results = await Promise.allSettled([
    ...INDEXNOW_HOSTS.map(host =>
      fetch(host, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      }).then(r => ({ host, status: r.status, ok: r.ok }))
    ),
    fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(`${SITE_URL}/sitemap-index.xml`)}`)
      .then(r => ({ host: 'google-sitemap-ping', status: r.status, ok: r.ok })),
  ]);

  const summary = results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value;
    return { host: INDEXNOW_HOSTS[i] || 'unknown', error: r.reason?.message, ok: false };
  });

  return new Response(JSON.stringify({ success: true, urls: urlList, results: summary }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
