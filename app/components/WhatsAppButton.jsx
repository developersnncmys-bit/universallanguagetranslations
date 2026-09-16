import "./WhatsAppButton.css";

// TODO: replace with the real WhatsApp number in international format, no "+" or spaces.
const WHATSAPP_NUMBER = "919999999999";

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      className="wa-fab"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      <span className="wa-fab__pulse" aria-hidden="true" />
      <span className="wa-fab__pulse wa-fab__pulse--delay" aria-hidden="true" />
      <span className="wa-fab__icon" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor">
          <path d="M19.11 17.63c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.79-1.67-2.09-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.64-.93-2.24-.25-.6-.5-.52-.68-.53l-.58-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM16.02 3.2c-7.06 0-12.8 5.74-12.81 12.8 0 2.26.59 4.47 1.72 6.41L3.1 28.8l6.55-1.72a12.79 12.79 0 0 0 6.36 1.68h.01c7.05 0 12.8-5.74 12.8-12.8a12.72 12.72 0 0 0-3.75-9.05A12.72 12.72 0 0 0 16.02 3.2zm0 23.3h-.01a10.63 10.63 0 0 1-5.41-1.48l-.39-.23-4.06 1.06 1.08-3.96-.25-.4a10.6 10.6 0 0 1-1.63-5.66c0-5.86 4.77-10.63 10.63-10.63a10.56 10.56 0 0 1 7.52 3.12 10.56 10.56 0 0 1 3.11 7.52c0 5.86-4.77 10.63-10.62 10.63z" />
        </svg>
      </span>
    </a>
  );
}
