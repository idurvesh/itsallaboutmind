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

  const { email } = body;
  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
  }

  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;

  if (!apiKey || !formId) {
    return new Response(JSON.stringify({ error: 'Server misconfiguration' }), { status: 500 });
  }

  // Try v4 API first (new Kit API)
  const v4Res = await fetch(`https://api.kit.com/v4/forms/${formId}/subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Kit-Api-Key': apiKey,
    },
    body: JSON.stringify({ email_address: email }),
  });

  if (v4Res.ok) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  // Fall back to v3 API
  const v3Res = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey, email }),
  });

  const data = await v3Res.json();

  if (!v3Res.ok) {
    return new Response(JSON.stringify({ error: data.message || 'Subscription failed', debug: { formId, v4Status: v4Res.status } }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

export const config = { path: '/api/subscribe' };
