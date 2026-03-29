import { NextResponse } from 'next/server';

export async function GET() {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json({ error: 'Backend not configured' }, { status: 500 });
  }

  const backendRes = await fetch(`${backendUrl.replace(/\/$/, '')}/status`, {
    cache: 'no-store',
  });

  if (!backendRes.ok) {
    const text = await backendRes.text().catch(() => 'Unknown error');
    return NextResponse.json({ error: text }, { status: backendRes.status });
  }

  const data = await backendRes.json();
  return NextResponse.json(data);
}
