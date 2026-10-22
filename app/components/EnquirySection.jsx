"use client";

import { useState, useRef, useEffect } from "react";
import "./EnquirySection.css";

const SERVICES = [
  "Translation",
  "Transcription",
  "Subtitles",
  "Voiceover",
  "Data Annotation",
  "Data Evaluation",
  "Multilingual Data Creation",
];

/**
 * Custom select dropdown — replaces the native <select> so the option
 * panel can share the form's glassmorphism treatment. Keyboard support
 * (Enter / Space toggle, Escape close, Arrow / Home / End to walk the
 * list) + click-outside to close + roving `aria-activedescendant` so
 * screen readers announce the currently highlighted option.
 */
function CustomSelect({ name, value, options, placeholder, onChange }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    Math.max(0, options.indexOf(value))
  );
  const rootRef = useRef(null);
  const listRef = useRef(null);

  // Click-outside to close.
  useEffect(() => {
    if (!open) return;
    const onDocDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [open]);

  // Keep the active option scrolled into view as the user walks the list.
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.children[activeIndex];
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [open, activeIndex]);

  const selectAt = (i) => {
    const v = options[i];
    if (v === undefined) return;
    onChange({ target: { name, value: v } });
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectAt(activeIndex);
    }
  };

  const listboxId = `${name}-listbox`;
  const activeId = open ? `${name}-opt-${activeIndex}` : undefined;

  return (
    <div
      className={`enq-select ${open ? "is-open" : ""}`}
      ref={rootRef}
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        className={`enq-select__trigger ${value ? "has-value" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={activeId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="enq-select__value">
          {value || placeholder}
        </span>
        <svg
          className="enq-select__caret"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m3 4.5 3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <ul
        className="enq-select__list"
        id={listboxId}
        role="listbox"
        ref={listRef}
        aria-label={placeholder}
        hidden={!open}
      >
        {options.map((opt, i) => (
          <li
            key={opt}
            id={`${name}-opt-${i}`}
            role="option"
            aria-selected={opt === value}
            className={`enq-select__opt ${
              i === activeIndex ? "is-active" : ""
            } ${opt === value ? "is-selected" : ""}`}
            onMouseEnter={() => setActiveIndex(i)}
            onClick={() => selectAt(i)}
          >
            {opt}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function EnquirySection() {
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    // TODO: Wire this to your backend / email service.
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
    setForm({ name: "", email: "", phone: "", service: "", message: "" });
  };

  return (
    <section className="enq section" id="enquiry">
      <div className="container enq__inner">
        <div className="enq__intro reveal">
          <h2 className="enq__title">
            <span className="enq__title-accent">Tell us about your project.</span>{" "}
            <span className="enq__title-bold">
              We&apos;ll reply within one business day.
            </span>
          </h2>
          <p className="enq__lede">
            Whether it's a single document or a global launch, we'll scope it
            fast and honestly. Prefer chat? Message us on WhatsApp.
          </p>
        </div>

        <form className="enq-form reveal" onSubmit={onSubmit} noValidate>
          <h3 className="enq-form__title">Send an enquiry</h3>

          <div className="enq-form__row">
            <label className="enq-field">
              <span>Full name*</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                autoComplete="name"
                required
                placeholder="Your name"
              />
            </label>
            <label className="enq-field">
              <span>Email*</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                autoComplete="email"
                required
                placeholder="you@company.com"
              />
            </label>
          </div>

          <div className="enq-form__row">
            <label className="enq-field">
              <span>Phone / WhatsApp</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={onChange}
                autoComplete="tel"
                placeholder="+00 00000 00000"
              />
            </label>
            <label className="enq-field">
              <span>Service</span>
              <CustomSelect
                name="service"
                value={form.service}
                options={SERVICES}
                placeholder="Select a service"
                onChange={onChange}
              />
            </label>
          </div>

          <label className="enq-field">
            <span>Tell us about your project*</span>
            <textarea
              name="message"
              rows={4}
              value={form.message}
              onChange={onChange}
              required
              placeholder="Language pairs, volume, deadline, format…"
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary enq-form__submit"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Sending…" : "Send enquiry"}
          </button>

          {status === "success" && (
            <p className="enq-form__msg enq-form__msg--ok">
              Thanks — we've received your enquiry and will be in touch shortly.
            </p>
          )}
          {status === "error" && (
            <p className="enq-form__msg enq-form__msg--err">
              Please fill in your name, email, and a short project description.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

