import { COMPANY, FOOTER_LEGAL_ENTITY_TEXT, FOOTER_LEGAL_SHORT } from '@/lib/legalCopy';

/**
 * Central site metadata used in legal pages, footer, and marketing.
 * Update this file (not the pages) to change contact details or legal wording
 * in one place.
 */
export const SITE = {
  name: 'PSR Train',
  domain: 'psrtrain.com',
  url: 'https://psrtrain.com',
  contactEmail: COMPANY.contactEmail,
  controllerName: COMPANY.controllerName,
  icoRegistrationNumber: COMPANY.icoRegistrationNumber,

  // Commercial/legal facts. Edit COMPANY in lib/legalCopy.ts when details change.
  legalOperator: COMPANY.legalName,
  legalOperatorNote: FOOTER_LEGAL_ENTITY_TEXT,
  footerLegalShort: FOOTER_LEGAL_SHORT,
  registeredOffice: COMPANY.registeredOffice,
  vatNumber: COMPANY.vatNumberDisplay,
  vatStatus: `Prices shown are in GBP. Where VAT applies, it is included in the price shown. VAT registration number: ${COMPANY.vatNumberDisplay}.`,
  governingLaw: 'the laws of England and Wales',
  jurisdiction: 'the courts of England and Wales',

  // Last update for legal pages. Keep ISO-like format for consistency.
  legalUpdated: '30 September 2026',

  // Useful external references.
  ico: 'https://ico.org.uk/make-a-complaint',

  // Third-party sub-processors referenced in the privacy policy.
  subprocessors: [
    { name: 'Supabase', purpose: 'authentication and database hosting' },
    { name: 'Vercel', purpose: 'application hosting and edge delivery' },
    { name: 'Resend', purpose: 'transactional email (contact form, account emails)' },
  ],

  // Optional analytics loaded only after the visitor accepts analytics in the
  // cookie banner / preferences panel (see components/OptionalAnalytics.tsx).
  // Google Analytics support exists in code but is inactive unless
  // NEXT_PUBLIC_GA_MEASUREMENT_ID is set; it is not set in production.
  optionalAnalytics: [
    {
      name: 'Vercel Web Analytics',
      purpose: 'aggregated, cookieless page-view statistics (pages visited, referrer, country, device and browser type)',
    },
    {
      name: 'Vercel Speed Insights',
      purpose: 'cookieless page performance measurements (load times and Core Web Vitals)',
    },
  ],
} as const;
