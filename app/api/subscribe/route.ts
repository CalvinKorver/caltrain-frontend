import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const phone_number: string | undefined = body?.phone_number;

  if (!phone_number) {
    return Response.json({ error: 'phone_number is required' }, { status: 400 });
  }

  const backendUrl = process.env.BACKEND_URL;
  const adminApiKey = process.env.ADMIN_API_KEY;

  if (!backendUrl) {
    return Response.json({ error: 'Backend not configured' }, { status: 500 });
  }

  const backendRes = await fetch(`${backendUrl}/admin/subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(adminApiKey ? { 'X-Admin-Token': adminApiKey } : {}),
    },
    body: JSON.stringify({ phone_number, route_preferences: {}, is_active: true }),
  });

  if (!backendRes.ok) {
    const text = await backendRes.text().catch(() => 'Unknown error');
    return Response.json({ error: text }, { status: 500 });
  }

  return Response.json({ ok: true });
}
