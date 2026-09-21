import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, BookOpen, Target, Heart } from 'lucide-react';
import { PSRUK_DIRECTORY_HREF } from '@/lib/policestationrepuk-promo';
import { CUSTODYNOTE_DOWNLOAD_CTA_LABEL, CUSTODYNOTE_STORE_CTA_LABEL, CUSTODYNOTE_STORE_HREF, CUSTODYNOTE_TRIAL_HREF } from '@/lib/custodynote-promo';
import { pageMetadata } from '@/lib/page-metadata';
import { AUTHOR_TRUST_LINE, AUTHOR } from '@/lib/author';
import { COMPANY, FOOTER_LEGAL_ENTITY_TEXT } from '@/lib/legalCopy';

export const metadata = pageMetadata({
  title: 'About',
  description:
    'PSR Train is the training platform built for the Police Station Representative Accreditation Scheme (PSRAS). Learn about our mission, author, and company details.',
  path: '/legal/about',
});

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">About PSR Train</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          We&apos;re the training platform built specifically for the Police Station Representative Accreditation Scheme (PSRAS).
        </p>
        <p className="mt-4 text-base text-slate-700 leading-relaxed">
          {AUTHOR_TRUST_LINE}
        </p>
      </div>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-semibold text-navy">Our mission</h2>
        <p className="text-muted-foreground leading-relaxed text-lg">
          PSR Train exists to help aspiring and practising police station representatives prepare for accreditation and do the job with confidence. We provide practice questions, learning modules, PACE 1984 Codes of Practice reference material, CIT-style scenarios, and a public legal advice hub for general reference.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-semibold text-navy">What we offer</h2>
        <ul className="space-y-4">
          {[
            { icon: BookOpen, text: 'Question banks and learning modules covering every area you need for PSRAS' },
            { icon: Target, text: 'Timed mock exams and scenario practice with instant feedback' },
            { icon: Shield, text: 'PACE Codes of Practice navigator, flashcards, and quick reference materials' },
            { icon: Heart, text: 'Legal advice hub with general public information on police station rights (England and Wales only; not legal advice)' },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-muted-foreground text-lg pt-1.5">{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 mb-12 p-6 rounded-2xl border border-border bg-white" id="company-details">
        <h2 className="text-2xl font-semibold text-navy">Company details</h2>
        <p className="text-muted-foreground leading-relaxed">
          {FOOTER_LEGAL_ENTITY_TEXT}
        </p>
        <dl className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-navy">Registered company</dt>
            <dd>{COMPANY.legalName}</dd>
          </div>
          <div>
            <dt className="font-semibold text-navy">Company number</dt>
            <dd>{COMPANY.companyNumber}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-semibold text-navy">Registered office</dt>
            <dd>{COMPANY.registeredOffice}</dd>
          </div>
          <div>
            <dt className="font-semibold text-navy">VAT</dt>
            <dd>{COMPANY.vatNumberDisplay}</dd>
          </div>
          <div>
            <dt className="font-semibold text-navy">Author</dt>
            <dd>{AUTHOR.name} · {AUTHOR.organisation}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-4 mb-12 p-6 rounded-2xl border border-border bg-white">
        <h2 className="text-2xl font-semibold text-navy">Further resources</h2>
        <p className="text-muted-foreground leading-relaxed text-lg">
          For PSR community, news, and profession-specific resources in the UK, we recommend{' '}
          <a
            href={PSRUK_DIRECTORY_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            PoliceStationRepUK.com
          </a>{' '}
          — a dedicated hub for police station representatives. For structured custody attendance notes,
          see{' '}
          <a
            href={CUSTODYNOTE_STORE_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            Custody Note
          </a>{' '}
          — Windows:{' '}
          <a
            href={CUSTODYNOTE_STORE_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            {CUSTODYNOTE_STORE_CTA_LABEL}
          </a>
          ;{' '}
          <a
            href={CUSTODYNOTE_TRIAL_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            {CUSTODYNOTE_DOWNLOAD_CTA_LABEL}
          </a>
          .
        </p>
      </section>

      <section className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-6 border-t border-border">
        <p className="text-muted-foreground">
          Questions or feedback? We&apos;d love to hear from you.
        </p>
        <Link href="/legal/contact">
          <Button variant="default" size="lg">
            Contact us
          </Button>
        </Link>
      </section>
    </div>
  );
}
