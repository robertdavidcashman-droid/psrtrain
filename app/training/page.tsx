import Link from 'next/link';
import MarketingHeader from '@/components/layout/MarketingHeader';
import Footer from '@/components/layout/Footer';
import { SITE } from '@/lib/site';
import {
  BookOpen,
  FileCheck,
  ClipboardCheck,
  Gavel,
  ShieldCheck,
  Users,
  Brain,
  Scale,
} from 'lucide-react';
import { FreeAccessBanner } from '@/components/FreeAccessBanner';
import { PartnerToolsLines } from '@/components/PartnerToolsLines';
import { MarketingPageHero, MarketingCtaButton } from '@/components/marketing/MarketingPageHero';

import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata({
  title: { absolute: 'Police Station Representative Training | PSRAS Modules & Mock Exams' },
  description:
    'Structured police station representative training: PACE and Code C modules, timed PSRAS mock exams, and CIT-style scenarios for accreditation candidates in England and Wales.',
  path: '/training',
  keywords: ['police station representative training', 'PSRAS mock exams', 'PACE Code C', 'Critical Incidents Test'],
  openGraph: {
    title: 'Police Station Representative Training | PSR Train',
    description:
      'PSRAS-focused modules, mock exams, and CIT-style scenario practice for police station representative candidates.',
  },
});

const modules = [
  {
    title: 'PACE and the Codes of Practice',
    description:
      'Core grounding in the Police and Criminal Evidence Act 1984 and Codes A–H, with emphasis on the provisions most tested at interview.',
    icon: Gavel,
  },
  {
    title: 'Custody and detention workflow',
    description:
      'Rights on arrival, reviews of detention, time limits under s.41–44, welfare checks, appropriate adults, and when to escalate.',
    icon: BookOpen,
  },
  {
    title: 'Disclosure and interview strategy',
    description:
      'How to request and evaluate pre-interview disclosure, decide between full comment, prepared statement, and no comment, and adapt as the interview unfolds.',
    icon: FileCheck,
  },
  {
    title: 'Vulnerable suspects and appropriate adults',
    description:
      'Identifying vulnerability, Code C safeguards, juveniles, mental health, interpreters, and the role of the appropriate adult.',
    icon: Users,
  },
  {
    title: 'Identification, samples and special procedures',
    description:
      'VIPER, group and confrontation ID, fingerprints and DNA, intimate and non-intimate samples, and refusal consequences.',
    icon: ShieldCheck,
  },
  {
    title: 'Adverse inferences and silence',
    description:
      'Sections 34, 36 and 37 CJPOA 1994, when inferences may be drawn, and how that feeds into your interview advice.',
    icon: Scale,
  },
  {
    title: 'Critical Incidents Test (CIT) preparation',
    description:
      'Scenario-led practice: spot the issue, prioritise actions, and justify your decisions under time pressure as in the live assessment.',
    icon: Brain,
  },
  {
    title: 'Mock assessments and progress tracking',
    description:
      'Timed MCQs pulled from a bank covering every core topic, with accuracy-by-topic stats so you know what to revise next.',
    icon: ClipboardCheck,
  },
];

const howItWorks = [
  {
    step: '1',
    title: 'Learn',
    body: 'Read compact, exam-focused modules that cover the law, codes, and the practical moves that matter in custody.',
  },
  {
    step: '2',
    title: 'Practise',
    body: 'Answer timed MCQs and open-response questions. Get instant feedback with reasoning and source references.',
  },
  {
    step: '3',
    title: 'Simulate',
    body: 'Work through CIT-style scenarios — the format used in assessment — and review a model decision trail.',
  },
  {
    step: '4',
    title: 'Track',
    body: 'See accuracy and time-per-question by topic so you target your weakest areas first, not the ones you already know.',
  },
];

export default function TrainingPage() {
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'PSR Train — Police Station Representative Training',
    description:
      'Online PSRAS preparation: PACE, custody procedure, interview strategy, and CIT-style scenarios.',
    provider: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
    url: `${SITE.url}/training`,
    inLanguage: 'en-GB',
    educationalLevel: 'Professional accreditation preparation',
    teaches: modules.map((m) => m.title),
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <MarketingHeader />
      <main id="main-content" className="flex-1">
        <MarketingPageHero
          label="Training"
          title="Built for PSRAS candidates — and practising PSRs"
          description="Structured modules, timed MCQs, and CIT-style scenarios that reflect the style and pressure of accreditation preparation."
          variant="light"
        >
          <FreeAccessBanner />
          <p className="mt-3 text-sm text-slate-600">
            Training and study only — completion does not confer PSRAS accreditation.
          </p>
          <PartnerToolsLines variant="light" custodyNoteStorePlacement="training" />
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
            Reinforce modules with{' '}
            <Link href="/blog/free-psras-practice-questions" className="font-semibold text-[#0B3C5D] hover:underline">
              free PSRAS practice questions
            </Link>
            ,{' '}
            <Link href="/blog/pace-code-c-practice-questions" className="font-semibold text-[#0B3C5D] hover:underline">
              PACE Code C MCQs
            </Link>
            , and{' '}
            <Link href="/blog/how-to-pass-critical-incidents-test" className="font-semibold text-[#0B3C5D] hover:underline">
              CIT scenario guidance
            </Link>
            . See also{' '}
            <Link
              href="/guides/how-to-become-a-police-station-representative"
              className="font-semibold text-[#0B3C5D] hover:underline"
            >
              becoming a police station representative
            </Link>
            .
          </p>
        </MarketingPageHero>

        <section className="py-16 sm:py-20 bg-dot-grid">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="font-display display-section text-[#0B3C5D] tracking-tight mb-10 text-center">
              What you study
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {modules.map(({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="feature-card p-6 h-full"
                >
                  <div className="icon-box-blue mb-4 h-12 w-12">
                    <Icon className="w-6 h-6" aria-hidden />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm text-slate-700 leading-relaxed">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-muted/40 border-y border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="font-display display-section text-[#0B3C5D] tracking-tight mb-10 text-center">
              How the course works
            </h2>
            <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map(({ step, title, body }) => (
                <li key={step} className="feature-card p-6">
                  <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                    {step}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground tracking-tight">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-display display-section text-[#0B3C5D] tracking-tight">
              Start training today
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Create a free account and try the practice bank. Upgrade when you&apos;re ready — cancel any time.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <MarketingCtaButton href="/signup">Start training</MarketingCtaButton>
              <MarketingCtaButton href="/pricing" variant="outline">
                See pricing
              </MarketingCtaButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
