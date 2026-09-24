import { PoliceStationRepUkPartnerLine } from '@/components/PoliceStationRepUkPartnerLine';
import { CustodyNotePartnerLine } from '@/components/CustodyNotePartnerLine';

type Props = {
  className?: string;
  variant?: 'light' | 'dark';
  custodyNoteStorePlacement?: string;
};

/** Inline partner mentions for marketing page heroes — spaced so they don't crowd product CTAs. */
export function PartnerToolsLines({
  className = 'mt-6 max-w-xl mx-auto space-y-3 text-left sm:text-center',
  variant = 'light',
  custodyNoteStorePlacement,
}: Props) {
  return (
    <div className={className}>
      <PoliceStationRepUkPartnerLine variant={variant} />
      <CustodyNotePartnerLine variant={variant} storePlacement={custodyNoteStorePlacement} />
    </div>
  );
}
