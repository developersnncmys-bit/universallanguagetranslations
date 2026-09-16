"use client";

import { useState } from "react";
import "./EnquirySection.css";

const SERVICES = [
  "Translation",
  "Transcription",
  "Subtitles",
  "Voiceover",
  "Data Annotation",
  "Data Evolution",
  "Multilingual Data Creation",
];

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
            Tell us about your project — we'll reply within one business day.
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
              <select name="service" value={form.service} onChange={onChange}>
                <option value="">Select a service</option>
                {SERVICES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
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

