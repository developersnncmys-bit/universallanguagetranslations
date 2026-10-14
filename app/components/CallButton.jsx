import "./CallButton.css";

// Business phone — Indian mobile in international format (country code
// 91 + 10-digit mobile), used in the floating fab's `tel:` href. On
// mobile this launches the native dialer; on desktop it falls back to
// whatever handler is registered for `tel:` (FaceTime / Teams / etc).
const PHONE_NUMBER = "+919538577775";

export default function CallButton() {
  return (
    <a
      href={`tel:${PHONE_NUMBER}`}
      className="call-fab"
      aria-label="Call us at +91 95385 77775"
    >
      <span className="call-fab__pulse" aria-hidden="true" />
      <span className="call-fab__pulse call-fab__pulse--delay" aria-hidden="true" />
      <span className="call-fab__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
          <path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72a2 2 0 0 1 1.72 2.01z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
}
