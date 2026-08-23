import Link from 'next/link';
import { SITE } from '@/lib/site';
import { CookiePreferencesPanel } from '@/components/CookiePreferencesPanel';

import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata({
  title: 'Cookie Policy',
  description:
    'How PSR Train uses essential and optional analytics cookies, and how to manage your preferences.',
  path: '/legal/cookies',
});

export default function CookiesPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-4xl font-bold text-navy">Cookie Policy</h1>
      <p className="text-muted-foreground">Last updated: {SITE.legalUpdated}</p>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-navy">1. What cookies are</h2>
        <p className="text-muted-foreground leading-relaxed">
          Cookies are small text files stored on your device when you visit a website. They are widely used to make sites work, remember preferences, and understand how the site is used.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-navy">2. Cookies we use</h2>
        <p className="text-muted-foreground leading-relaxed">
          We use <strong>strictly necessary</strong> cookies that do not require consent under PECR. In particular:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>authentication and session cookies (so you stay signed in);</li>
          <li>security cookies (to prevent cross-site request forgery and abuse);</li>
          <li>a preference cookie to remember choices such as the access-gate state.</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          We also offer <strong>optional analytics</strong> (Vercel Analytics, Vercel Speed Insights, and Google Analytics when a measurement ID is configured). These only load after you Accept analytics in the cookie banner or in the preferences panel below. We do not use advertising or cross-site tracking cookies.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-navy">3. Managing cookies</h2>
        <p className="text-muted-foreground leading-relaxed">
          Use the controls below to accept or reject optional analytics. You can also control or delete cookies through your browser settings. If you block strictly necessary cookies, parts of the Service (such as signing in) may not work.
        </p>
        <CookiePreferencesPanel />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-navy">4. Contact</h2>
        <p className="text-muted-foreground leading-relaxed">
          Questions? Use our <Link href="/legal/contact" className="text-primary hover:underline">contact page</Link>.
        </p>
      </section>
    </div>
  );
}
