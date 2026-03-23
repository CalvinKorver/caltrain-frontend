'use client';

import { FormEvent, useState } from 'react';

interface TrainRowProps {
  train: string;
  service: string;
  status: string;
  arrival: string;
  isDelayed: boolean;
}

function TrainRow({ train, service, status, arrival, isDelayed }: TrainRowProps) {
  const isOnTime = !isDelayed;

  return (
    <tr>
      <td
        style={{
          padding: '16px',
          borderBottom: '1px solid var(--border)',
          verticalAlign: 'middle',
          fontWeight: 500,
          color: 'var(--ink)',
        }}
      >
        {train}
      </td>
      <td
        style={{
          padding: '16px',
          borderBottom: '1px solid var(--border)',
          verticalAlign: 'middle',
          color: 'var(--ink-light)',
        }}
      >
        {service}
      </td>
      <td
        style={{
          padding: '16px',
          borderBottom: '1px solid var(--border)',
          verticalAlign: 'middle',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 8px',
            backgroundColor: isOnTime ? 'rgba(0, 159, 107, 0.1)' : 'rgba(227, 38, 54, 0.1)',
            borderRadius: '4px',
            fontSize: '11px',
            gap: '6px',
            color: isOnTime ? 'var(--ok)' : 'var(--alert)',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isOnTime ? 'var(--ok)' : 'var(--alert)',
            }}
          />
          {status}
        </div>
      </td>
      <td
        style={{
          padding: '16px',
          borderBottom: '1px solid var(--border)',
          verticalAlign: 'middle',
          textAlign: 'right',
          fontWeight: 500,
          color: isDelayed ? 'var(--alert)' : 'var(--ink)',
        }}
      >
        {arrival}
      </td>
    </tr>
  );
}

function toE164(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return `+${digits}`;
}

export default function Home() {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (phone) {
      setError(null);
      setAgreed(false);
      setShowModal(true);
    }
  };

  const handleModalSubmit = async () => {
    if (!agreed) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: toE164(phone) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong');
      }
      setShowModal(false);
      setPhone('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setAgreed(false);
    setError(null);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--ink)' }}>

      {/* Opt-in Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) handleModalClose(); }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--border)',
              maxWidth: '440px',
              width: '100%',
              padding: '40px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--ink-muted)',
                marginBottom: '20px',
              }}
            >
              SMS OPT-IN
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                marginBottom: '12px',
                color: 'var(--ink)',
              }}
            >
              Enable SMS Alerts
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--ink-light)',
                lineHeight: 1.6,
                marginBottom: '8px',
              }}
            >
              You&apos;ll receive text messages when Caltrain disruptions affect your commute. Message &amp; data rates may apply. Reply STOP to unsubscribe at any time.
            </p>
            <a
              href="/privacy"
              style={{
                fontSize: '13px',
                color: 'var(--ink-light)',
                textDecoration: 'underline',
                display: 'inline-block',
                marginBottom: '28px',
              }}
            >
              Privacy Policy
            </a>

            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                cursor: 'pointer',
                marginBottom: '32px',
              }}
            >
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ marginTop: '2px', accentColor: 'var(--ink)', width: '16px', height: '16px', flexShrink: 0 }}
              />
              <span style={{ fontSize: '13px', color: 'var(--ink-light)', lineHeight: 1.5 }}>
                I agree to receive SMS alerts from Caltrain Signal at {phone}.
              </span>
            </label>

            {error && (
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--alert)',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {error}
              </p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={handleModalClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--ink-muted)',
                  padding: 0,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                disabled={!agreed || loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: agreed && !loading ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: agreed && !loading ? 'var(--ink)' : 'var(--ink-muted)',
                  padding: 0,
                  transition: 'color 0.2s ease',
                }}
              >
                {loading ? 'Submitting...' : 'Submit'}
                {!loading && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Navigation */}
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
        <a
          href="#"
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
          className="logo"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <circle cx="12" cy="12" r="9" stroke="#111111" strokeWidth="2"></circle>
            <path d="M12 3V7" stroke="#111111" strokeWidth="2" strokeLinecap="round"></path>
            <path d="M12 17V21" stroke="#111111" strokeWidth="2" strokeLinecap="round"></path>
            <path d="M3 12H7" stroke="#111111" strokeWidth="2" strokeLinecap="round"></path>
            <path d="M17 12H21" stroke="#111111" strokeWidth="2" strokeLinecap="round"></path>
            <circle cx="12" cy="12" r="3" fill="#111111"></circle>
          </svg>
          Caltrain Signal
        </a>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a
            href="/privacy"
            style={{
              fontSize: '14px',
              color: 'var(--ink-light)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-light)')}
          >
            Privacy
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        style={{
          maxWidth: 'var(--grid-max)',
          margin: '120px auto 160px',
          padding: '0 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(48px, 6vw, 88px)',
            fontWeight: 400,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            color: 'var(--ink)',
            maxWidth: '900px',
          }}
        >
          Never wait on the{' '}
          <span
            style={{
              position: 'relative',
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            platform again.
            <span
              style={{
                content: '""',
                position: 'absolute',
                bottom: '6%',
                left: '-1%',
                right: '-2%',
                height: '45%',
                backgroundColor: 'var(--highlight)',
                zIndex: -1,
                transform: 'skew(-1deg)',
              }}
              aria-hidden="true"
            />
          </span>
        </h1>
        <p
          style={{
            marginTop: '32px',
            fontSize: '20px',
            color: 'var(--ink-light)',
            maxWidth: '480px',
            letterSpacing: '-0.01em',
          }}
        >
          Get real-time disruption alerts and schedule changes for your specific Caltrain commute, straight to your phone.
        </p>

        {/* Signup Form */}
        <div
          style={{
            marginTop: '56px',
            width: '100%',
            maxWidth: '440px',
            position: 'relative',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%', position: 'relative' }}>
            <input
              type="tel"
              placeholder="Enter your phone number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="phone-input"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                color: 'var(--ink-light)',
                transition: 'color 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--ink)';
                e.currentTarget.style.transform = 'translate(4px, -50%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--ink-light)';
                e.currentTarget.style.transform = 'translateY(-50%)';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"></path>
              </svg>
            </button>
          </form>
          <div
            style={{
              marginTop: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--ink-muted)',
              textAlign: 'left',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {submitted ? 'You\'re signed up — we\'ll text you when Caltrain acts up.' : 'Enter your number and confirm opt-in to receive SMS alerts.'}
          </div>
        </div>
      </header>

      {/* Data Section */}
      <section
        style={{
          borderTop: '1px solid var(--border)',
          padding: '80px 24px',
          backgroundColor: '#FAFAFA',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--grid-max)',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '40px',
          }}
        >
          <div style={{ minWidth: '280px' }}>
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--alert)' }}>
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: 'var(--alert)',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite',
                }}
              />
              LIVE TELEMETRY
            </div>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '16px',
              }}
            >
              Why i built this
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--ink-light)', maxWidth: '240px' }}>
              Caltrain`s official communications leave something to be desired. I got tired of checking Reddit or Twitter just to see why my train was delayed.
            </p>
            <p style={{ fontSize: '14px', color: 'var(--ink-light)', maxWidth: '240px', marginTop: '12px' }}>
              So i thought - why not create an app to text me if there`s a disruption?
            </p>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontVariantNumeric: 'tabular-nums',
                borderCollapse: 'collapse',
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      color: 'var(--ink-muted)',
                      fontWeight: 400,
                      borderBottom: '1px solid var(--border)',
                      textTransform: 'uppercase',
                      fontSize: '11px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Train
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      color: 'var(--ink-muted)',
                      fontWeight: 400,
                      borderBottom: '1px solid var(--border)',
                      textTransform: 'uppercase',
                      fontSize: '11px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Service
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      color: 'var(--ink-muted)',
                      fontWeight: 400,
                      borderBottom: '1px solid var(--border)',
                      textTransform: 'uppercase',
                      fontSize: '11px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      textAlign: 'right',
                      padding: '12px 16px',
                      color: 'var(--ink-muted)',
                      fontWeight: 400,
                      borderBottom: '1px solid var(--border)',
                      textTransform: 'uppercase',
                      fontSize: '11px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Est. Arrival
                  </th>
                </tr>
              </thead>
              <tbody>
                <TrainRow train="#314" service="NB Local" status="On Time" arrival="08:42 AM" isDelayed={false} />
                <TrainRow train="#506" service="SB Limited" status="+14m Delay" arrival="09:12 AM" isDelayed={true} />
                <TrainRow train="#711" service="NB Express" status="Track Hold" arrival="09:45 AM" isDelayed={true} />
                <TrainRow train="#102" service="SB Local" status="On Time" arrival="10:04 AM" isDelayed={false} />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          maxWidth: 'var(--grid-max)',
          margin: '0 auto',
          padding: '80px 24px 40px',
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
