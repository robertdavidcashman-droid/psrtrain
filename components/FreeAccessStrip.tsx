import Link from 'next/link';
import { freeAccessEndsLabel, isFreeAccessPeriodActive } from '@/lib/free-access-promo';
import { Sparkles } from 'lucide-react';

/**
 * Prominent, site-wide announcement bar for the limited free-access period.
 * Rendered at the very top of every page (above all other promos) from the
 * root layout. Optional FREE_ACCESS_UNTIL adjusts the end-date label in copy.
 */
/**
 * Compact site-wide free-access bar. Kept short on mobile so it does not
 * stack with the Custody Note strip and bury the product hero.
 */
export function FreeAccessStrip() {
  if (!isFreeAccessPeriodActive()) return null;
  const until = freeAccessEndsLabel();
  return (
    <aside
      className="relative overflow-hidden border-b border-emerald-900/30 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 px-3 py-1.5 text-center text-[0.75rem] text-white sm:px-4 sm:py-2 sm:text-sm"
      aria-label="Free access promotion"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.08)_50%,transparent_60%)]"
        aria-hidden
      />
      <p className="relative font-semibold tracking-tight leading-snug">
        <Sparkles className="mr-1 inline h-3 w-3 text-emerald-200 sm:mr-1.5 sm:h-3.5 sm:w-3.5" aria-hidden />
        Free whilst testing
        {until ? ` until ${until}` : ''}.{' '}
        <Link
          href="/signup"
          className="font-bold underline decoration-2 underline-offset-2 hover:text-emerald-100"
        >
          Create free account
        </Link>
        <span className="text-emerald-100"> — no card.</span>
      </p>
    </aside>
  );
}
