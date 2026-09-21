import { PSRUK_REGISTER_HREF } from '@/lib/policestationrepuk-promo';
import {
  CUSTODYNOTE_DOWNLOAD_CTA_LABEL,
  CUSTODYNOTE_STORE_CTA_LABEL,
  CUSTODYNOTE_STORE_HREF,
  CUSTODYNOTE_TRIAL_HREF,
} from '@/lib/custodynote-promo';

type Props = {
  /** Use on dark hero backgrounds */
  variant?: 'light' | 'dark';
};

/** Homepage hero callout for sister products — Store CTA is a loud button. */
export function PartnerHeroMention({ variant = 'light' }: Props) {
  const isDark = variant === 'dark';
  const linkClass = `font-semibold underline decoration-[#D4AF37]/60 underline-offset-2 ${
    isDark ? 'text-white hover:decoration-white' : 'text-[#0B3C5D] hover:decoration-[#0B3C5D]'
  }`;
  const secondaryLinkClass = `text-xs underline decoration-[#D4AF37]/40 underline-offset-2 ${
    isDark ? 'text-slate-300 hover:decoration-slate-200' : 'text-slate-600 hover:decoration-slate-500'
  }`;

  return (
    <div
      className={`mx-auto mt-8 max-w-2xl rounded-xl px-4 py-4 text-sm shadow-sm ${
        isDark
          ? 'border border-white/10 bg-white/5 text-slate-300 backdrop-blur-sm'
          : 'border border-[#0B3C5D]/10 bg-white/80 text-slate-600'
      }`}
      data-testid="partner-hero-mention"
    >
      <p className={`font-semibold ${isDark ? 'text-[#D4AF37]' : 'text-[#0B3C5D]'}`}>
        More tools from our network
      </p>
      <p className="mt-1.5 leading-relaxed">
        List your practice on{' '}
        <a
          href={PSRUK_REGISTER_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          PoliceStationRepUK
        </a>
        . Record attendances with{' '}
        <a href={CUSTODYNOTE_STORE_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>
          Custody Note
        </a>
        .
      </p>
      <div className="mt-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
        <a
          href={CUSTODYNOTE_STORE_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-[#0B3C5D] px-4 text-sm font-bold text-white no-underline shadow-sm hover:bg-[#0a3352]"
          data-testid="partner-hero-store-cta"
        >
          {CUSTODYNOTE_STORE_CTA_LABEL}
        </a>
        <a
          href={CUSTODYNOTE_TRIAL_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className={secondaryLinkClass}
        >
          {CUSTODYNOTE_DOWNLOAD_CTA_LABEL}
        </a>
      </div>
    </div>
  );
}
