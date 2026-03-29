'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface StatusDelayItem {
  id: number;
  severity: string;
  title: string;
  message: string;
  last_seen_at: string;
  station_hints: string[];
  route_hints: string[];
}

interface StatusPayload {
  updated_at: string;
  delays: StatusDelayItem[];
}

function severityTone(sev: string): 'high' | 'info' {
  const u = sev.toUpperCase();
  if (u === 'CRITICAL' || u === 'WARNING') return 'high';
  return 'info';
}

function formatSeenAt(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function SeverityBadge({ severity }: { severity: string }) {
  const tone = severityTone(severity);
  const label = severity.replace(/_/g, ' ');
  const high = tone === 'high';
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 8px',
        backgroundColor: high ? 'rgba(227, 38, 54, 0.1)' : 'rgba(17, 17, 17, 0.06)',
        borderRadius: '4px',
        fontSize: '11px',
        gap: '6px',
        color: high ? 'var(--alert)' : 'var(--ink-light)',
        fontFamily: 'var(--font-mono)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: high ? 'var(--alert)' : 'var(--ink-muted)',
        }}
      />
      {label}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<StatusPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/status');
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(typeof body.error === 'string' ? body.error : 'Failed to load status');
        }
        if (!cancelled) {
          setData(body as StatusPayload);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Something went wrong');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--ink)', minHeight: '100vh' }}>
      <nav
        style={{
          maxWidth: 'var(--grid-max)',
          margin: '0 auto',
          padding: '40px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '18px',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
            textDecoration: 'none',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <circle cx="12" cy="12" r="9" stroke="#111111" strokeWidth="2" />
            <path d="M12 3V7" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 17V21" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 12H7" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
            <path d="M17 12H21" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3" fill="#111111" />
          </svg>
          Caltrain Signal
        </Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link
            href="/"
            style={{
              fontSize: '14px',
              color: 'var(--ink-light)',
              textDecoration: 'none',
            }}
          >
            Home
          </Link>
          <Link
            href="/privacy"
            style={{
              fontSize: '14px',
              color: 'var(--ink-light)',
              textDecoration: 'none',
            }}
          >
            Privacy
          </Link>
        </div>
      </nav>

      <main
        style={{
          maxWidth: 'var(--grid-max)',
          margin: '0 auto',
          padding: '0 24px 80px',
        }}
      >
        <div
          style={{
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--alert)',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              backgroundColor: 'var(--alert)',
              borderRadius: '50%',
              animation: 'pulse 2s infinite',
            }}
          />
          LIVE NETWORK STATUS
        </div>
        <h1
          style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 400,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            marginBottom: '12px',
          }}
        >
          Current delays
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--ink-light)',
            maxWidth: '520px',
            marginBottom: '48px',
          }}
        >
          Active disruptions from the last seven days, excluding cleared (no-alert) items.
        </p>

        {loading && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-muted)' }}>
            Loading…
          </p>
        )}

        {error && (
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--alert)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {error}
          </p>
        )}

        {!loading && !error && data && data.delays.length === 0 && (
          <p style={{ fontSize: '15px', color: 'var(--ink-light)' }}>
            No active delays in the system right now.
          </p>
        )}

        {!loading && !error && data && data.delays.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
              }}
            >
              <thead>
                <tr>
                  {(['Severity', 'Title', 'Details', 'Last seen'] as const).map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: h === 'Last seen' ? 'right' : 'left',
                        padding: '12px 16px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 400,
                        color: 'var(--ink-muted)',
                        borderBottom: '1px solid var(--border)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.delays.map((row) => (
                  <tr key={row.id}>
                    <td
                      style={{
                        padding: '16px',
                        borderBottom: '1px solid var(--border)',
                        verticalAlign: 'top',
                      }}
                    >
                      <SeverityBadge severity={row.severity} />
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        borderBottom: '1px solid var(--border)',
                        verticalAlign: 'top',
                        fontWeight: 500,
                        maxWidth: '220px',
                      }}
                    >
                      {row.title}
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        borderBottom: '1px solid var(--border)',
                        verticalAlign: 'top',
                        color: 'var(--ink-light)',
                        lineHeight: 1.5,
                      }}
                    >
                      {row.message}
                      {(row.station_hints.length > 0 || row.route_hints.length > 0) && (
                        <div
                          style={{
                            marginTop: '10px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            color: 'var(--ink-muted)',
                          }}
                        >
                          {row.station_hints.length > 0 && (
                            <div>Stations: {row.station_hints.join(', ')}</div>
                          )}
                          {row.route_hints.length > 0 && (
                            <div>Routes: {row.route_hints.join(', ')}</div>
                          )}
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        borderBottom: '1px solid var(--border)',
                        verticalAlign: 'top',
                        textAlign: 'right',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        color: 'var(--ink-muted)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatSeenAt(row.last_seen_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer
        style={{
          maxWidth: 'var(--grid-max)',
          margin: '0 auto',
          padding: '40px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--ink-muted)',
        }}
      >
        <div style={{ display: 'flex', gap: '24px' }}>
          <span>SYS.VER 4.2.0</span>
          <span>NODE: SF-01</span>
        </div>
        <div>© SIGNAL TRANSIT DATA, LLC</div>
      </footer>
    </div>
  );
}
