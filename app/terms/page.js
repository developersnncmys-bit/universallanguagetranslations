"use client";

import Link from "next/link";
import LegalAnimations from "../components/LegalAnimations";
import "../components/LegalPage.css";

const sections = [
  {
    id: "about-these-terms",
    num: "01",
    title: "About these terms",
    body: (
      <>
        <p>
          These Terms & Conditions ("Terms") govern your use of this website
          and any services you engage us to deliver. By browsing the site,
          submitting an enquiry, or signing a project with us, you agree to be
          bound by these Terms together with any project-specific statement of
          work ("SOW") we agree with you in writing.
        </p>
        <p>
          If any term in an SOW conflicts with these Terms, the SOW will
          prevail for that engagement.
        </p>
      </>
    ),
  },
  {
    id: "our-services",
    num: "02",
    title: "Our services",
    body: (
      <>
        <p>
          Universal Language Translations provides professional language
          services including translation, transcription, subtitling,
          voiceover, data annotation and related multilingual work. The
          precise deliverables, scope, format, language pairs, turnaround and
          fees for each engagement will be set out in the SOW or written
          quote we agree with you before work begins.
        </p>
      </>
    ),
  },
  {
    id: "your-responsibilities",
    num: "03",
    title: "Your responsibilities",
    body: (
      <>
        <p>When you engage us, you agree to:</p>
        <ul>
          <li>Provide source files, reference materials and any required context in a timely manner so we can meet the agreed timeline.</li>
          <li>Confirm that you have the right to share the source content with us and have us process it as described in the SOW.</li>
          <li>Review and sign off on deliverables within the review window stated in the SOW; otherwise deliverables will be deemed accepted.</li>
          <li>Use our deliverables lawfully and in accordance with any usage restrictions set out in the SOW.</li>
        </ul>
      </>
    ),
  },
  {
    id: "scope-changes",
    num: "04",
    title: "Project scope & changes",
    body: (
      <>
        <p>
          Each engagement is scoped against the source content, scope and
          turnaround you share at quoting. If the scope changes once work has
          started — additional source content, additional languages, revised
          deadline, format change — we will agree the revised scope, fee and
          timeline with you in writing before continuing.
        </p>
        <p>
          Minor revisions to the final deliverable within a reasonable window
          (as noted in the SOW) are included; substantial rewriting beyond
          that window is treated as new work.
        </p>
      </>
    ),
  },
  {
    id: "fees-payment",
    num: "05",
    title: "Fees, invoicing & payment",
    body: (
      <>
        <p>
          Fees are quoted per project unless an alternate commercial model
          (retainer, framework rate card) is agreed in writing. Unless the
          SOW states otherwise:
        </p>
        <ul>
          <li>Invoices are raised on delivery of the project (or against an agreed milestone schedule for longer engagements).</li>
          <li>Payment is due within thirty (30) days of invoice date.</li>
          <li>Late payments may accrue interest at the maximum rate permitted by applicable law.</li>
          <li>Quoted fees exclude taxes; applicable VAT, GST or sales tax will be added where required.</li>
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    num: "06",
    title: "Intellectual property",
    body: (
      <>
        <p>
          You retain all rights in the source content you share with us.
          Subject to full payment of the applicable fees, we assign to you
          all rights, title and interest in the translated or produced
          deliverables we create for you under the SOW.
        </p>
        <p>
          We retain the right to use project-derived linguistic assets —
          glossaries, translation memories and style guides — in
          anonymised form to improve consistency on future projects we
          handle for you. We will not reuse your confidential content for
          any other client.
        </p>
        <p>
          Our website, brand, visual identity and any underlying tooling
          remain our property; nothing in these Terms grants you a licence
          to any of it except as expressly stated.
        </p>
      </>
    ),
  },
  {
    id: "confidentiality",
    num: "07",
    title: "Confidentiality",
    body: (
      <>
        <p>
          We treat all source content and project information you share with
          us as confidential. Our linguists, reviewers and vendors are bound
          by written non-disclosure agreements. We will not disclose your
          confidential information to any third party except as needed to
          deliver the services you have engaged us for, or as required by
          law.
        </p>
        <p>
          Where you require a bespoke NDA, we are happy to sign one before
          source content is shared.
        </p>
      </>
    ),
  },
  {
    id: "warranties",
    num: "08",
    title: "Warranties & disclaimers",
    body: (
      <>
        <p>
          We warrant that services will be performed with reasonable care and
          skill, by qualified linguists, and in accordance with industry
          practice.
        </p>
        <p>
          Beyond this express warranty, our services and this website are
          provided "as is". To the maximum extent permitted by applicable
          law, we disclaim all other warranties, express or implied,
          including implied warranties of merchantability, fitness for a
          particular purpose and non-infringement.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    num: "09",
    title: "Limitation of liability",
    body: (
      <>
        <p>
          To the maximum extent permitted by applicable law, our total
          aggregate liability arising out of or in connection with any
          engagement is limited to the fees you paid us for the specific
          project that gave rise to the claim.
        </p>
        <p>
          We will not be liable for any indirect, consequential, incidental
          or special damages, including loss of profits, revenue, goodwill
          or anticipated savings, even if we have been advised of the
          possibility of such damages.
        </p>
        <p>
          Nothing in these Terms limits any liability that cannot lawfully
          be limited — including liability for fraud, death or personal
          injury caused by our negligence, or any other liability that
          cannot be excluded under applicable law.
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    num: "10",
    title: "Indemnity",
    body: (
      <>
        <p>
          You agree to indemnify and hold us harmless from any third-party
          claim arising out of (a) your breach of these Terms or any SOW,
          (b) content you provided to us that infringes a third-party right,
          or (c) your use of our deliverables in a manner not contemplated
          by the SOW.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    num: "11",
    title: "Termination",
    body: (
      <>
        <p>
          Either party may terminate an engagement in writing if the other
          party materially breaches these Terms or the SOW and fails to
          remedy the breach within fourteen (14) days of written notice.
        </p>
        <p>
          On termination, you will pay for all work completed up to the
          termination date, including work in progress on any current
          milestone. Clauses that by their nature should survive termination
          (including confidentiality, intellectual property, warranties,
          liability and governing law) will continue to apply.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    num: "12",
    title: "Governing law & disputes",
    body: (
      <>
        <p>
          These Terms are governed by the laws of the jurisdiction in which
          Universal Language Translations is incorporated, without regard to
          its conflict-of-laws principles. Any dispute arising out of or in
          connection with these Terms will be subject to the exclusive
          jurisdiction of the competent courts of that jurisdiction, unless
          we agree otherwise in writing.
        </p>
        <p>
          Before starting formal proceedings, both parties will attempt to
          resolve any dispute in good faith through senior-level discussion.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    num: "13",
    title: "Changes to these terms",
    body: (
      <>
        <p>
          We may update these Terms from time to time to reflect changes in
          our services, our practices or applicable law. The "Last updated"
          date at the top of the page shows when the current version took
          effect. Material changes will be flagged on this page, and — for
          active engagements — notified to you directly.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    num: "14",
    title: "Contact us",
    body: (
      <>
        <p>
          Questions about these Terms, or about a current or prospective
          engagement, can be sent to our team via the <Link href="/contact">contact page</Link>.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
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
            Terms & <span className="accent">Conditions.</span>
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
              placeholders (jurisdiction, payment terms, notice periods) with
              values that reflect your actual contracting position before
              go-live.
            </div>

            <p className="legal-intro">
              These Terms & Conditions set out the agreement between Universal
              Language Translations ("we", "us", "our") and the clients,
              visitors and users ("you") of this website and our professional
              language services. Please read them carefully — they define
              everyone's rights and obligations.
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
          <span className="legal-cta-eyebrow">Ready to start</span>
          <h2>
            Need to scope a <span className="accent">project?</span>
          </h2>
          <p>
            Share your brief and we'll come back with a quote, timeline and
            the right linguists for the work.
          </p>
          <Link href="/contact" className="legal-cta-btn">
            Contact us <span aria-hidden>↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
