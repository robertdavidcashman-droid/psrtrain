import {
  CUSTODYNOTE_DOWNLOAD_CTA_LABEL,
  CUSTODYNOTE_STORE_CTA_LABEL,
  CUSTODYNOTE_STORE_HREF,
  CUSTODYNOTE_TRIAL_HREF,
} from '@/lib/custodynote-promo';

type Props = {
  variant?: 'light' | 'dark';
};

/** Partner-line CN promo: Store (Windows) primary + Mac notarised download secondary button. */
export function CustodyNotePartnerLine({ variant = 'light' }: Props) {
  const isDark = variant === 'dark';

  return (
    <div className={`mt-3 ${isDark ? 'text-slate-100' : 'text-slate-700'}`} data-testid="custodynote-partner-line">
      <p className="text-sm">
        <strong className={isDark ? 'text-white' : 'text-[#0B3C5D]'}>Also try:</strong>{' '}
        <a
          href={CUSTODYNOTE_STORE_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-semibold underline underline-offset-2 ${isDark ? 'text-[#D4AF37]' : 'text-[#0B3C5D]'}`}
        >
          Custody Note
        </a>{' '}
        — structured PACE attendance notes for Windows and Mac.
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-2">
        <a
          href={CUSTODYNOTE_STORE_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex min-h-[36px] items-center justify-center rounded-md px-3.5 text-xs font-bold no-underline shadow-sm ${
            isDark
              ? 'bg-[#D4AF37] text-[#0B3C5D] hover:bg-[#e0c04a]'
              : 'bg-[#0B3C5D] text-white hover:bg-[#0a3352]'
          }`}
          data-testid="custodynote-partner-store-cta"
        >
          {CUSTODYNOTE_STORE_CTA_LABEL}
        </a>
        <a
          href={CUSTODYNOTE_TRIAL_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex min-h-[36px] items-center justify-center rounded-md border-2 px-3.5 text-xs font-bold no-underline shadow-sm ${
            isDark
              ? 'border-white/60 bg-white/10 text-white hover:border-white hover:bg-white/20'
              : 'border-[#0B3C5D]/40 bg-white text-[#0B3C5D] hover:border-[#0B3C5D] hover:bg-slate-50'
          }`}
          data-testid="custodynote-partner-mac-cta"
        >
          {CUSTODYNOTE_DOWNLOAD_CTA_LABEL}
        </a>
      </div>
    </div>
  );
}
