"use client";

import Link from "next/link";
import LegalAnimations from "../components/LegalAnimations";
import "../components/LegalPage.css";

const sections = [
  {
    id: "information-we-collect",
    num: "01",
    title: "Information we collect",
    body: (
      <>
        <p>
          We collect only the information we need to deliver the services you
          request, run our business responsibly, and comply with our legal
          obligations. The categories we handle include:
        </p>
        <ul>
          <li><strong>Contact details</strong> — name, business email, phone number and company name when you reach out to us, request a quote, or sign a project.</li>
          <li><strong>Project content</strong> — the source files, text, audio, video or data you share with us so that we can translate, transcribe, localise or otherwise process it on your behalf.</li>
          <li><strong>Account & billing information</strong> — purchase order details, invoicing information and payment confirmations needed to deliver and bill engagements.</li>
          <li><strong>Website usage data</strong> — pages visited, approximate location, device and browser details collected via standard web analytics and cookies.</li>
          <li><strong>Correspondence</strong> — emails, chat transcripts and support tickets exchanged with our team.</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    num: "02",
    title: "How we use your information",
    body: (
      <>
        <p>We use the information above to:</p>
        <ul>
          <li>Deliver, improve and support the language services you have engaged us for.</li>
          <li>Scope quotes, confirm project terms, raise invoices and process payments.</li>
          <li>Respond to enquiries, provide customer support and keep you informed about active projects.</li>
          <li>Maintain glossaries, translation memories and other reference assets that improve the consistency of future work for you.</li>
          <li>Monitor and secure our site, prevent fraud, and comply with legal and regulatory obligations.</li>
          <li>Share occasional service updates — only when you have asked us to or where we have a legitimate business reason to do so.</li>
        </ul>
        <p>
          We do not sell your personal information, and we do not use project
          content to train general-purpose machine-learning models.
        </p>
      </>
    ),
  },
  {
    id: "sharing-disclosure",
    num: "03",
    title: "Sharing & disclosure",
    body: (
      <>
        <p>
          We share information only with parties who help us deliver our
          services and who are bound by confidentiality obligations. These
          typically include:
        </p>
        <ul>
          <li><strong>Linguists and reviewers</strong> engaged under non-disclosure agreements to carry out translation, transcription, review and quality-assurance work on your project.</li>
          <li><strong>Processing and hosting providers</strong> we rely on to run our website, store files, send email and process payments.</li>
          <li><strong>Professional advisors</strong> — accountants, auditors, legal counsel — on a strict need-to-know basis.</li>
          <li><strong>Regulatory bodies and law-enforcement agencies</strong> when we are legally required to disclose information.</li>
        </ul>
        <p>
          We may also disclose information in connection with a merger,
          acquisition or reorganisation — in which case we will notify you and
          ensure your rights continue to be protected.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    num: "04",
    title: "Data retention",
    body: (
      <>
        <p>
          We retain information only for as long as needed to fulfil the
          purpose it was collected for, meet legal and accounting
          requirements, or support ongoing client relationships. In practice
          that means:
        </p>
        <ul>
          <li>Project files are kept for the duration of the engagement plus a reasonable archive window agreed with you, after which they are securely deleted on request.</li>
          <li>Invoicing and tax records are kept for the period required by applicable tax law.</li>
          <li>Marketing and enquiry data is kept until you unsubscribe or ask us to delete it.</li>
        </ul>
      </>
    ),
  },
  {
    id: "your-rights",
    num: "05",
    title: "Your rights",
    body: (
      <>
        <p>
          Depending on where you are based, you may have the right to access,
          correct, port, restrict or delete the personal information we hold
          about you, and to object to certain uses of it. You can exercise any
          of these rights by writing to us at the contact address below. We
          will respond within the timeframe required by applicable law.
        </p>
        <p>
          If you believe we have handled your information improperly, you may
          also complain to your local data-protection authority.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    num: "06",
    title: "Cookies & tracking",
    body: (
      <>
        <p>
          Our website uses a small number of cookies and similar technologies
          to keep the site working, remember your preferences, and understand
          how visitors use it. We use analytics providers to collect
          aggregated usage information in a privacy-respecting way.
        </p>
        <p>
          You can block or delete cookies through your browser settings; some
          parts of the site may not function fully if you do.
        </p>
      </>
    ),
  },
  {
    id: "security",
    num: "07",
    title: "Security",
    body: (
      <>
        <p>
          We apply technical and organisational safeguards appropriate to the
          sensitivity of the information we handle — including encrypted
          transfers, access controls, confidentiality agreements with every
          linguist and vendor, and regular review of our security practices.
        </p>
        <p>
          No system is completely secure. If a breach ever affects your
          information, we will notify you as required by law and take steps to
          contain and remediate the issue.
        </p>
      </>
    ),
  },
  {
    id: "international-transfers",
    num: "08",
    title: "International transfers",
    body: (
      <>
        <p>
          We work with linguists and vendors around the world. Where this
          involves moving information across borders, we rely on appropriate
          safeguards — such as standard contractual clauses or equivalent
          mechanisms — to ensure your information remains protected.
        </p>
      </>
    ),
  },
  {
    id: "childrens-privacy",
    num: "09",
    title: "Children's privacy",
    body: (
      <>
        <p>
          Our services are intended for business and professional use. We do
          not knowingly collect personal information from children. If you
          believe a child has provided us with personal information, please
          contact us so we can remove it.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    num: "10",
    title: "Changes to this policy",
    body: (
      <>
        <p>
          We may update this policy from time to time to reflect changes in
          our services, our practices, or applicable law. The "Last updated"
          date at the top of the page shows when the current version took
          effect. Material changes will be flagged on this page.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    num: "11",
    title: "Contact us",
    body: (
      <>
        <p>
          Questions about this policy, or about the information we hold about
          you, can be sent to our team via the <Link href="/contact">contact page</Link>.
          We will respond as quickly as we can.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <LegalAnimations />

      <div className="legal-progress" aria-hidden="true">
        <div className="legal-progress-bar" />
      </div>

      <section className="legal-hero">
        <div className="legal-hero-inner">
          <span className="legal-eyebrow">Legal</span>
          <h1 className="legal-hero-title">
            Privacy <span className="accent">Policy.</span>
          </h1>
          <p className="legal-hero-meta">Last updated: 10 October 2026</p>
        </div>
      </section>

      <section className="legal-body">
        <div className="legal-body-inner">

          <aside className="legal-toc" aria-label="On this page">
            <span className="legal-toc-label">On this page</span>
            <ul className="legal-toc-list">
              {sections.map((s) => (
                <li className="legal-toc-item" key={s.id}>
                  <a className="legal-toc-link" href={`#${s.id}`}>
                    <span className="legal-toc-num">{s.num}</span>
                    <span>{s.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="legal-content">
            <div className="legal-notice">
              <strong>Template notice.</strong> This document is a working
              template drafted for Universal Language Translations and must be
              reviewed and approved by qualified legal counsel in the relevant
              jurisdiction(s) before it is published or relied upon. Replace
              placeholders (contact address, dates, regulatory references)
              before go-live.
            </div>

            <p className="legal-intro">
              This Privacy Policy explains how Universal Language Translations
              ("we", "us", "our") collects, uses, shares and protects
              information when you visit our website, request a quote, or
              engage us to deliver translation, transcription, voiceover,
              subtitling or related language services.
            </p>

            {sections.map((s) => (
              <section className="legal-section" id={s.id} key={s.id}>
                <div className="legal-section-head">
                  <span className="legal-section-num">{s.num}</span>
                  <h2 className="legal-section-heading">{s.title}</h2>
                </div>
                <div className="legal-section-body">
                  {s.body}
                </div>
              </section>
            ))}
          </div>

        </div>
      </section>

      <section className="legal-cta">
        <div className="legal-cta-inner">
          <span className="legal-cta-eyebrow">Get in touch</span>
          <h2>
            Questions about <span className="accent">your data?</span>
          </h2>
          <p>
            Reach out to our team and we'll come back to you within one
            business day.
          </p>
          <Link href="/contact" className="legal-cta-btn">
            Contact us <span aria-hidden>↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
