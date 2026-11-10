import React from 'react';
import { Link } from 'react-router';

// POPIA section 18 notice. Every claim here describes what the site actually
// does today: the four forms post to the submit-lead Supabase function, which
// stores the lead in pjd_leads and calls the "PJD New Lead Notification" n8n
// workflow (email to Paul with family CC'd, plus a confirmation email to the
// customer). If that flow changes, update this page in the same change.
const UPDATED = '10 November 2026';

const Section = ({ title, children }) => (
  <section className="mb-12">
    <h2 className="text-2xl md:text-3xl font-black text-pjd-dark leading-tight mb-5">{title}</h2>
    <div className="space-y-4 text-pjd-stone leading-relaxed">{children}</div>
  </section>
);

const A = ({ href, children }) => (
  <a href={href} className="text-pjd-teal-ink underline hover:text-pjd-dark transition-colors">
    {children}
  </a>
);

const Privacy = () => (
  <div className="min-h-screen bg-pjd-cream">
    {/* Dark band behind the Navbar: its text is white, so a cream top would hide it. */}
    <div className="bg-pjd-dark pt-40 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-pjd-teal text-xs font-bold tracking-[0.25em] uppercase mb-3">Privacy</p>
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
          What happens to your details.
        </h1>
      </div>
    </div>
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-pjd-stone leading-relaxed mb-4">
        When you ask Paul about a board, you give us some personal information. This page explains what we
        collect, why, who sees it and what you can ask us to do with it, as South Africa's Protection of
        Personal Information Act (POPIA) requires.
      </p>
      <p className="text-pjd-stone/80 text-sm mb-16">Last updated: {UPDATED}</p>

      <Section title="Who we are">
        <p>
          Paul Jeggels Designs is run by Paul Jeggels from 15 Dageraad Street, Jeffreys Bay, 6330, South Africa.
          Paul is responsible for your information. For any privacy question or request, email{' '}
          <A href="mailto:info@pauljeggelsdesigns.co.za">info@pauljeggelsdesigns.co.za</A> or call{' '}
          <A href="tel:+27829609353">+27 82 960 9353</A>.
        </p>
      </Section>

      <Section title="What we collect">
        <p>When you send an enquiry, a quote request, a board spec from the builder or your quiz answers, we collect:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>your name and email address;</li>
          <li>your phone number and delivery address, if you give them;</li>
          <li>what you're interested in and your message;</li>
          <li>
            board details you choose to share, such as your height, weight, the waves you surf, board size, fin
            setup and glassing preferences;
          </li>
          <li>which form you used.</li>
        </ul>
        <p>
          We collect this from you directly. To block spam, the form briefly checks your IP address and limits
          how many messages it accepts from one address in 15 minutes. The companies that host the site also keep
          standard technical logs, such as IP address and browser type, to run it securely.
        </p>
      </Section>

      <Section title="Why we collect it">
        <p>
          To reply to you, quote you, shape and deliver your board, and follow up with you about that board. When
          you send a form, you also get an automatic email confirming we received it.
        </p>
        <p>We don't send newsletters or marketing emails, and we don't sell or rent your information to anyone.</p>
      </Section>

      <Section title="What you have to give us">
        <p>
          Your name and email address are required, because without them we can't reply. Everything else is
          optional. If you leave out board details, Paul will ask for them when he gets back to you. If you'd rather
          not use a form at all, call Paul instead.
        </p>
        <p>No law requires you to give us this information.</p>
      </Section>

      <Section title="Who sees it">
        <ul className="list-disc pl-6 space-y-2">
          <li>Paul, and family members who help him run the business and this website. Each new enquiry is emailed to them.</li>
          <li>
            Companies that run parts of the site for us: Netlify hosts the website, Supabase receives and stores
            form submissions, n8n (hosted on Render) sends the enquiry emails, and Google provides Gmail, the
            address suggestions in the delivery address field and the fonts on this site.
          </li>
          <li>A courier, if we send your board to you. They get your name, phone number and delivery address.</li>
        </ul>
        <p>
          These companies only use your information to provide their service to us. Some of them store it on
          servers outside South Africa, such as in the United States or Europe, under their own security and data
          protection terms.
        </p>
        <p>
          The Google reviews on our homepage are loaded from Google by our server. Nothing about you is sent to
          Google to show them.
        </p>
      </Section>

      <Section title="How long we keep it">
        <p>
          We keep your details for as long as we need them to answer your enquiry and look after your board. If
          you buy from us, we keep the records that tax law requires businesses to keep. You can ask us to delete
          your details at any time, and we will, unless the law requires us to keep them.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          This site doesn't use analytics or advertising cookies. Google's services on the site, such as address
          suggestions and fonts, may set their own cookies under{' '}
          <A href="https://policies.google.com/privacy">Google's privacy policy</A>.
        </p>
      </Section>

      <Section title="Keeping it safe">
        <p>
          Everything you send through the site travels over an encrypted connection (HTTPS). Your details are
          stored with the providers above, which protect their systems, and only the people listed above see your
          enquiry.
        </p>
      </Section>

      <Section title="Your rights">
        <p>Under POPIA you can ask us:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>what information we hold about you;</li>
          <li>to correct it or update it;</li>
          <li>to delete it;</li>
          <li>to stop using it, if you object to how we use it.</li>
        </ul>
        <p>
          Email <A href="mailto:info@pauljeggelsdesigns.co.za">info@pauljeggelsdesigns.co.za</A> and we'll sort it
          out.
        </p>
        <p>
          If you're not happy with how we handle your information, you can complain to the Information Regulator:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Website: <A href="https://inforegulator.org.za/">inforegulator.org.za</A></li>
          <li>Complaints: <A href="https://eservices.inforegulator.org.za/complaints/default.aspx">online complaints portal</A> or <A href="mailto:POPIAComplaints@inforegulator.org.za">POPIAComplaints@inforegulator.org.za</A></li>
          <li>Phone: 010 023 5200 (toll free 0800 017 160)</li>
          <li>Address: Woodmead North Office Park, 54 Maxwell Drive, Woodmead, Johannesburg, 2191</li>
        </ul>
      </Section>

      <Section title="Changes">
        <p>
          If we change how we handle your information, we'll update this page and the date at the top.
        </p>
      </Section>

      <p className="text-pjd-stone text-sm">
        <Link to="/contact/" className="text-pjd-teal-ink underline hover:text-pjd-dark transition-colors">
          Back to getting a quote
        </Link>
      </p>
    </div>
  </div>
);

export default Privacy;
