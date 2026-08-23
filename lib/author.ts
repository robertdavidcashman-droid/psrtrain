/**
 * Visible author / trust signals (E-E-A-T). Keep in sync with blog JSON-LD Person author.
 */

export const AUTHOR = {
  name: 'Robert Cashman',
  role: 'criminal defence solicitor',
  experience: '30+ years',
  organisation: 'Defence Legal Services (DLS)',
} as const;

/** Short visible byline for About, homepage quiz, and similar surfaces. */
export const AUTHOR_TRUST_LINE = `${AUTHOR.name}, ${AUTHOR.role} with ${AUTHOR.experience}’ experience — ${AUTHOR.organisation}.`;

export const AUTHOR_TRUST_LINE_SHORT = `By ${AUTHOR.name} · ${AUTHOR.experience} · ${AUTHOR.organisation}`;
