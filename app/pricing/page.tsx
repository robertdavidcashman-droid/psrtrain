import Link from 'next/link';
import MarketingHeader from '@/components/layout/MarketingHeader';
import Footer from '@/components/layout/Footer';
import { Check, ChevronRight } from 'lucide-react';
import { FreeAccessBanner } from '@/components/FreeAccessBanner';
import { PartnerToolsLines } from '@/components/PartnerToolsLines';
import { MarketingPageHero, MarketingCtaBand } from '@/components/marketing/MarketingPageHero';
import { PricingUpgradeBanner } from '@/components/pricing/PricingUpgradeBanner';
import { GetStartedButton } from '@/components/billing/GetStartedButton';
import { getAccessSnapshot } from '@/lib/auth/access';
import { SITE } from '@/lib/site';
import { PRICING_FAQS } from '@/lib/faq';

import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata({
  title: 'Pricing',
  description:
    'PSR Train is free while testing (no card required). Planned monthly £12 and annual £115 plans are Coming soon — not available for checkout yet.',
  path: '/pricing',
});

const FEATURES_COMMON = [
  'Full practice question bank, unlimited attempts',
  'All learning modules',
  'CIT-style scenario exercises',
  'Progress tracking and accuracy stats',
  'PACE 1984 and Code C reference materials',
  'Keyboard shortcuts for efficient practice',
];

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const upgrade = sp.upgrade === '1' || sp.upgrade === 'true';
  const from =
    typeof sp.from === 'string' ? sp.from.replace(/^\//, '') || undefined : undefined;
  const access = await getAccessSnapshot();
  const freeWhileTesting = true;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader />
      <main id="main-content" className="flex-1">

        <MarketingPageHero
          label="Pricing"
          title={freeWhileTesting ? 'Free while we test' : 'Simple, transparent pricing'}
          description={
            freeWhileTesting
              ? 'Full access now with no card required. Planned paid plans are listed below as Coming soon — not available for checkout yet.'
              : 'Full access to all training content. No hidden fees. Cancel any time.'
          }
          variant="light"
        >
          <PricingUpgradeBanner upgrade={upgrade} fromPath={from} />
          <FreeAccessBanner />
          <PartnerToolsLines variant="light" custodyNoteStorePlacement="pricing" />
        </MarketingPageHero>

        {/* Plans */}
        <section className="py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-50 to-white">
          {freeWhileTesting && (
            <p className="max-w-2xl mx-auto mb-10 text-center text-sm text-slate-600 leading-relaxed">
              Access is completely free while we are testing. Create an account to start training —
              no card required. The prices below are planned for after testing and are not live checkout
              options yet.
            </p>
          )}
          <div className="max-w-4xl mx-auto grid gap-8 sm:grid-cols-2">

            {/* Monthly */}
            <div className="rounded-2xl border-2 border-border bg-white p-8 shadow-card card-lift hover:border-primary/20 relative">
              {freeWhileTesting && (
                <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-slate-800 text-white text-[11px] font-bold tracking-wide">
                  Coming soon
                </span>
              )}
              <div className="mb-6">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Monthly</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-bold text-foreground">£12</span>
                  <span className="text-muted-foreground text-lg mb-1">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {freeWhileTesting
                    ? 'Planned price after testing. Not available for checkout yet.'
                    : 'Billed monthly in GBP. Cancel any time.'}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {FEATURES_COMMON.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              {freeWhileTesting ? (
                <Link
                  href="/signup"
                  className="block w-full text-center py-3 px-6 rounded-xl border-2 border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-200"
                >
                  Create free account
                </Link>
              ) : (
                <GetStartedButton
                  plan="monthly"
                  isAuthenticated={access.isAuthenticated}
                  hasPaidAccess={access.hasPaidAccess}
                  className="block w-full text-center py-3 px-6 rounded-xl border-2 border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-200"
                />
              )}
            </div>

            {/* Annual */}
            <div className="rounded-2xl border-2 border-primary bg-white p-8 shadow-elevated card-lift relative ring-2 ring-primary/10">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-primary text-white text-[11px] font-bold tracking-wide whitespace-nowrap">
                {freeWhileTesting ? 'Coming soon — planned best value' : 'Best value — save 20%'}
              </span>

              <div className="mb-6">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Annual</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-bold text-foreground">£115</span>
                  <span className="text-muted-foreground text-lg mb-1">/year</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {freeWhileTesting
                    ? 'Planned price after testing (equivalent to £9.58/month). Not available for checkout yet.'
                    : 'Equivalent to £9.58/month — two months free. Billed annually in GBP.'}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-semibold text-primary">Everything in Monthly</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">Two months free vs monthly billing</span>
                </li>
                {!freeWhileTesting && (
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">Billed annually. Cancel any time.</span>
                  </li>
                )}
              </ul>

              {freeWhileTesting ? (
                <Link
                  href="/signup"
                  className="block w-full text-center py-3 px-6 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
                >
                  Create free account
                </Link>
              ) : (
                <GetStartedButton
                  plan="annual"
                  isAuthenticated={access.isAuthenticated}
                  hasPaidAccess={access.hasPaidAccess}
                  className="block w-full text-center py-3 px-6 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
                />
              )}
            </div>
          </div>

          <p className="text-center mt-8 text-sm text-muted-foreground">
            Questions?{' '}
            <Link href="/legal/contact" className="text-primary font-semibold hover:underline">
              Get in touch
            </Link>
          </p>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-20 bg-white border-t border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <p className="section-label-primary justify-center mb-3">FAQ</p>
              <div className="section-bar-primary mx-auto mb-5" />
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Frequently asked questions
              </h2>
            </div>

            <div className="space-y-4">
              {PRICING_FAQS.map(({ question, answer }) => (
                <div key={question} className="rounded-2xl border border-border bg-white p-6">
                  <h3 className="font-semibold text-foreground mb-2 text-[0.9375rem]">{question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed m-0">{answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/legal/faq"
                className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline"
              >
                See all FAQs
                <ChevronRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        <MarketingCtaBand
          title={freeWhileTesting ? 'Start free while we test' : 'Ready to start training?'}
          description={
            freeWhileTesting
              ? 'Create your account and access all training content — no card required. Paid plans are Coming soon.'
              : 'Sign up and access all training content immediately. Cancel any time.'
          }
          href="/signup"
          buttonLabel={freeWhileTesting ? 'Create free account' : 'Start training'}
        />
        <p className="pb-12 text-center text-xs text-slate-600">
          Prices in GBP. {SITE.vatStatus} See our{' '}
          <Link href="/legal/refund" className="underline hover:text-[#0B3C5D]">
            Refund Policy
          </Link>
          .
        </p>
      </main>
      <Footer />
    </div>
  );
}
