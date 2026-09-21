import {
  CUSTODYNOTE_DOWNLOAD_CTA_LABEL,
  CUSTODYNOTE_STORE_CTA_LABEL,
  CUSTODYNOTE_STORE_HREF,
  CUSTODYNOTE_TRIAL_HREF,
} from '@/lib/custodynote-promo';

type Props = {
  variant?: 'light' | 'dark';
};

export function CustodyNotePartnerLine({ variant = 'light' }: Props) {
  const isDark = variant === 'dark';
  const linkClass = `font-semibold underline underline-offset-2 ${isDark ? 'text-[#D4AF37]' : 'text-[#0B3C5D]'}`;
  const secondaryLinkClass = `underline underline-offset-2 ${isDark ? 'text-slate-200' : 'text-slate-600'}`;
  return (
    <p className={`mt-2 text-sm ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>
      <strong className={isDark ? 'text-white' : 'text-[#0B3C5D]'}>Also try:</strong>{' '}
      <a href={CUSTODYNOTE_STORE_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>
        Custody Note
      </a>{' '}
      — structured PACE attendance notes. Windows:{' '}
      <a href={CUSTODYNOTE_STORE_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {CUSTODYNOTE_STORE_CTA_LABEL}
      </a>
      .{' '}
      <a
        href={CUSTODYNOTE_TRIAL_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className={secondaryLinkClass}
      >
        {CUSTODYNOTE_DOWNLOAD_CTA_LABEL}
      </a>
      .
    </p>
  );
}
