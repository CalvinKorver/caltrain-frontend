export default function Privacy() {
  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--ink)', minHeight: '100vh' }}>
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          padding: '80px 24px',
        }}
      >
        <a
          href="/"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--ink-muted)',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: '48px',
          }}
        >
          ← Back
        </a>

        <h1
          style={{
            fontSize: '36px',
            fontWeight: 400,
            letterSpacing: '-0.03em',
            marginBottom: '8px',
          }}
        >
          Privacy Policy
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--ink-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '48px',
          }}
        >
          Last updated March 2026
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <section>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              What we collect
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--ink-light)', lineHeight: 1.7 }}>
              We collect only your mobile phone number when you sign up for SMS alerts. We do not collect your name, email address, or any other personal information.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              How we use it
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--ink-light)', lineHeight: 1.7 }}>
              Your phone number is used solely to send you SMS alerts about Caltrain disruptions, delays, and service changes. We will never sell, rent, or share your number with third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              SMS messaging
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--ink-light)', lineHeight: 1.7 }}>
              By signing up, you consent to receive automated SMS text messages from Caltrain Signal. Message frequency varies based on service disruptions. Message and data rates may apply. Reply <strong>STOP</strong> at any time to unsubscribe. Reply <strong>HELP</strong> for assistance.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              Data retention
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--ink-light)', lineHeight: 1.7 }}>
              Your phone number is stored securely and retained until you unsubscribe. Upon replying STOP, your number is deactivated and will no longer receive messages.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              Third-party services
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--ink-light)', lineHeight: 1.7 }}>
              SMS messages are delivered via Twilio, Inc. Your phone number is transmitted to Twilio solely for the purpose of message delivery. Twilio&apos;s privacy policy can be found at twilio.com/legal/privacy.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              Contact
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--ink-light)', lineHeight: 1.7 }}>
              Questions about this policy? This is an independent project — not affiliated with Caltrain or the Peninsula Corridor Joint Powers Board.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
