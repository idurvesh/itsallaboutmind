export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { email, firstName, quizResult, formType } = body;
  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
  }

  const apiKey = env.CONVERTKIT_API_KEY;
  const formId = formType === 'quiz'
    ? env.CONVERTKIT_QUIZ_FORM_ID
    : env.CONVERTKIT_FORM_ID;

  if (!apiKey || !formId) {
    return new Response(JSON.stringify({ error: 'Server misconfiguration' }), { status: 500 });
  }

  const payload = {
    email_address: email,
    ...(firstName ? { first_name: firstName } : {}),
    ...(quizResult ? { fields: { mindset_type: quizResult } } : {}),
  };

  const res = await fetch(`https://api.kit.com/v4/forms/${formId}/subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Kit-Api-Key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  // Fallback to v3
  const v3Res = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      email,
      first_name: firstName || '',
      fields: quizResult ? { mindset_type: quizResult } : {},
    }),
  });

  const data = await v3Res.json();
  if (!v3Res.ok) {
    return new Response(JSON.stringify({ error: data.message || 'Subscription failed' }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
