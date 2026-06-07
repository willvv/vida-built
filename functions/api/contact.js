// Cloudflare Pages Function — contact form handler
// Sends quote-request notification to willvv@gmail.com via Gmail API
// Required Cloudflare secrets: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN

const NOTIFY_TO = 'willvv@gmail.com';

async function getGmailToken(env) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     env.GMAIL_CLIENT_ID,
      client_secret: env.GMAIL_CLIENT_SECRET,
      refresh_token: env.GMAIL_REFRESH_TOKEN,
      grant_type:    'refresh_token',
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('Gmail token failed: ' + JSON.stringify(data));
  return data.access_token;
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function encodeSubject(s) {
  return `=?UTF-8?B?${btoa(unescape(encodeURIComponent(s)))}?=`;
}

function makeRaw({ to, subject, html }) {
  const boundary = 'vidabuilt_b';
  const raw = [
    `From: Vida Built <willvv@gmail.com>`,
    `To: ${to}`,
    `Subject: ${encodeSubject(subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
    '',
    `--${boundary}--`,
  ].join('\r\n');
  return btoa(unescape(encodeURIComponent(raw)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function buildHtml({ name, phone, email, description }) {
  const emailRow = email
    ? `<tr><td style="padding:8px 0;color:#555;width:120px">Email</td><td style="padding:8px 0"><a href="mailto:${esc(email)}" style="color:#1D9E75">${esc(email)}</a></td></tr>`
    : '';
  const descRow = description
    ? `<tr><td style="padding:8px 0;color:#555;vertical-align:top">Description</td><td style="padding:8px 0;white-space:pre-wrap">${esc(description)}</td></tr>`
    : '';
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"></head>
<body style="font-family:sans-serif;background:#f5f4f0;margin:0;padding:32px 16px">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
    <div style="background:#1D9E75;padding:24px 32px">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700">New Quote Request</h1>
      <p style="margin:4px 0 0;color:rgba(255,255,255,.8);font-size:14px">Vida Built — vida-built.pages.dev</p>
    </div>
    <div style="padding:28px 32px">
      <table style="width:100%;border-collapse:collapse;font-size:15px">
        <tr><td style="padding:8px 0;color:#555;width:120px">Name</td><td style="padding:8px 0;font-weight:600">${esc(name)}</td></tr>
        <tr><td style="padding:8px 0;color:#555">Phone</td><td style="padding:8px 0"><a href="tel:${esc(phone)}" style="color:#1D9E75;font-weight:600">${esc(phone)}</a></td></tr>
        ${emailRow}
        ${descRow}
      </table>
      <div style="margin-top:24px;padding-top:20px;border-top:1px solid #eee">
        <a href="tel:${esc(phone)}" style="display:inline-block;background:#FAC775;color:#2C2C2A;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:700;font-size:15px">Call ${esc(name.split(' ')[0])}</a>
      </div>
    </div>
    <div style="padding:16px 32px;background:#f9f8f5;font-size:12px;color:#999;border-top:1px solid #eee">
      Submitted via vida-built.pages.dev contact form
    </div>
  </div>
</body></html>`;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

export async function onRequestPost({ request, env }) {
  try {
    const { name, phone, email = '', description = '' } = await request.json();

    if (!name?.trim() || !phone?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Name and phone number are required.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Log the submission before attempting to send, so we never lose a lead's
    // contact details even if the Gmail send fails. Visible in Cloudflare logs.
    console.log('[contact] Submission:', JSON.stringify({
      name: name.trim(),
      phone: phone.trim(),
      email: String(email).trim(),
      description: String(description).trim().slice(0, 500),
      ip: request.headers.get('CF-Connecting-IP') || '',
      time: new Date().toISOString(),
    }));

    if (!env.GMAIL_CLIENT_ID || !env.GMAIL_REFRESH_TOKEN) {
      console.error('[contact] Gmail secrets not configured — skipping email');
      return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
    }

    const token = await getGmailToken(env);
    const gmailRes = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw: makeRaw({
            to: NOTIFY_TO,
            subject: `Quote request: ${name.trim()} · ${phone.trim()}`,
            html: buildHtml({ name: name.trim(), phone: phone.trim(), email, description }),
          }),
        }),
      }
    );

    if (!gmailRes.ok) {
      const err = await gmailRes.text();
      console.error('[contact] Gmail send error:', err.slice(0, 500));
      return new Response(
        JSON.stringify({ error: 'Failed to send. Please call us directly.' }),
        { status: 502, headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
  } catch (err) {
    console.error('[contact] Error:', err);
    return new Response(
      JSON.stringify({ error: 'Server error. Please try again or call us.' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
