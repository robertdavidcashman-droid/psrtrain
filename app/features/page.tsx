import MarketingHeader from '@/components/layout/MarketingHeader';
import Footer from '@/components/layout/Footer';
import { BookOpen, FolderOpen, BarChart3, Award, FileCheck } from 'lucide-react';
import { PartnerToolsLines } from '@/components/PartnerToolsLines';
import { MarketingPageHero, MarketingCtaBand, MarketingCtaButton } from '@/components/marketing/MarketingPageHero';
import { FreeAccessBanner } from '@/components/FreeAccessBanner';

import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata({
  title: 'Features',
  description: 'Practice questions, modules, progress tracking, and structured tools to support PSRAS preparation.',
  path: '/features',
});

export default function FeaturesPage() {
  const features = [
    { icon: BookOpen, title: 'Practice questions', desc: 'A full bank of MCQs aligned to PSRAS and PACE Code C, with unlimited attempts. Timed mode and by-topic practice.' },
    { icon: FolderOpen, title: 'Learning modules', desc: 'Structured modules on custody, disclosure, rights, and interview practice.' },
    { icon: FileCheck, title: 'Critical incidents', desc: 'Scenario-based practice for the CIT. Identify issues and make decisions.' },
    { icon: BarChart3, title: 'Progress tracking', desc: 'Track your scores, weak areas, and improvement over time.' },
    { icon: Award, title: 'Certificates', desc: 'Completion certificates for modules and milestones (training evidence only — not PSRAS accreditation).' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader />
      <main id="main-content" className="flex-1">
        <MarketingPageHero
          label="Features"
          title="Structured tools for PSRAS preparation"
          description="Practice questions, modules, scenarios, and progress tracking in one focused platform — not a CPD marketplace."
          variant="light"
        >
          <div className="flex flex-col items-center gap-4">
            <FreeAccessBanner />
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <MarketingCtaButton href="/signup">Start training free</MarketingCtaButton>
              <MarketingCtaButton href="/training" variant="outline">
                View modules
              </MarketingCtaButton>
            </div>
            <PartnerToolsLines className="mt-2 max-w-xl mx-auto text-left sm:text-center" />
          </div>
        </MarketingPageHero>

        <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, desc }) => (
                <article key={title} className="feature-card p-6 sm:p-7 h-full">
                  <div className="icon-tile-gradient mb-5 h-12 w-12">
                    <Icon className="w-6 h-6" aria-hidden />
                  </div>
                  <h2 className="font-semibold text-slate-900 text-lg tracking-tight">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <MarketingCtaBand
          title="Start preparing today"
          description="Create a free account while we're testing — no card required. Paid plans come later."
          href="/signup"
          buttonLabel="Start training free"
        />
      </main>
      <Footer />
    </div>
  );
}
