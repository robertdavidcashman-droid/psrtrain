/**
 * Single source of truth for public FAQ copy (homepage, /legal/faq, /pricing).
 * Keep cost and accreditation answers aligned with free-while-testing messaging.
 */

export type SiteFaqItem = {
  question: string;
  answer: string;
  linkUrl?: string;
  linkLabel?: string;
};

/** Full FAQ list for /legal/faq and JSON-LD. */
export const SITE_FAQS: SiteFaqItem[] = [
  {
    question: 'Does completing this training qualify me as a police station representative?',
    answer:
      'No. This training prepares candidates for the Police Station Representative Accreditation Scheme (PSRAS). Completion does not itself confer accreditation or authorisation to provide police station advice. Formal accreditation depends on the recognised external scheme and applicable supervision and assessment requirements.',
  },
  {
    question: 'Is PSR Train an official PSRAS provider?',
    answer:
      'No. PSR Train is independent preparation and practice — it helps you get ready, but accreditation itself is awarded by your assessment body. We align our content with the PSRAS syllabus, PACE 1984, and Code C.',
  },
  {
    question: 'What does PSR Train cost?',
    answer:
      'It is completely free while we are in testing, with no card required. Paid monthly (£12) and annual (£115) plans are planned for later and are marked Coming soon on the pricing page — they are not available for checkout yet. Candidates who sign up now start training free straight away.',
  },
  {
    question: 'Will it actually help me pass?',
    answer:
      'It is built around the assessment: timed mock exams under real conditions, CIT-style scenarios, and questions mapped to the PSRAS syllabus units, each with a worked explanation so you learn the reasoning, not just the answer.',
  },
  {
    question: 'What is included?',
    answer:
      'Practice questions across every syllabus area, timed mock exams, critical-incident scenarios, learning modules, and progress tracking that shows your accuracy and weakest topics.',
  },
  {
    question: 'Who is this platform for?',
    answer:
      'Candidates preparing for Police Station Representative accreditation (PSRAS) in England and Wales — whether you are starting out or polishing up before assessment. Qualified solicitors may also use it as a supplementary refresh of PACE 1984, Code C, and police station procedure.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Create a free account and start exploring learning modules, practice questions, and scenarios. No card is required while we are testing. We recommend starting with the learning modules, then moving on to practice questions and mocks.',
  },
  {
    question: 'Are the questions updated regularly?',
    answer:
      'Yes, we regularly update our question bank to ensure accuracy and relevance. Our content is reviewed to reflect current laws, regulations, and best practices.',
  },
  {
    question: 'Can I track my progress?',
    answer:
      'Yes. The platform includes progress tracking. You can view your performance statistics, track your improvement over time, and identify areas where you need more practice.',
  },
  {
    question: 'Do you offer certificates?',
    answer:
      'We offer course-completion or participation certificates for certain modules or milestones. These are evidence of training completed on our platform only; they do not constitute professional accreditation or authorisation to provide police station advice. Check the certificates page in your dashboard for more information.',
  },
  {
    question: 'What is the PSRAS?',
    answer:
      'The Police Station Representative Accreditation Scheme (PSRAS) is the accreditation framework for individuals who provide legally aided police station advice. The SRA describes it as a compulsory qualification for solicitors and non-solicitors who provide legal advice at the police station on a legally aided basis. Assessment components are delivered by authorised providers.',
  },
  {
    question: 'Where can I find more PSR resources and community?',
    answer:
      'We recommend PoliceStationRepUK.com — a dedicated hub for police station representatives in the UK, with community, news, and profession-specific resources.',
    linkUrl: 'https://policestationrepuk.com',
    linkLabel: 'Visit PoliceStationRepUK.com',
  },
];

/** Short set for the homepage “Common questions” section (same answers as SITE_FAQS). */
export const HOMEPAGE_FAQ_QUESTIONS = [
  'Is PSR Train an official PSRAS provider?',
  'Will it actually help me pass?',
  'What does PSR Train cost?',
  'What is included?',
  'Who is this platform for?',
] as const;

export function faqsForQuestions(questions: readonly string[]): SiteFaqItem[] {
  return questions.map((q) => {
    const item = SITE_FAQS.find((f) => f.question === q);
    if (!item) {
      throw new Error(`FAQ question not found in SITE_FAQS: ${q}`);
    }
    return item;
  });
}

/** Pricing-page FAQ subset — cost/accreditation aligned with SITE_FAQS. */
export const PRICING_FAQS: SiteFaqItem[] = [
  SITE_FAQS.find((f) => f.question.startsWith('Does completing'))!,
  SITE_FAQS.find((f) => f.question === 'What does PSR Train cost?')!,
  SITE_FAQS.find((f) => f.question === 'What is the PSRAS?')!,
  {
    question: 'Are the listed prices inclusive of VAT?',
    answer:
      'Yes. When paid plans become available, the prices shown (£12/month and £115/year) will be the total amount you pay in GBP, including VAT where applicable. They are not available for checkout while free testing is active.',
  },
  {
    question: 'Can I cancel a subscription later?',
    answer:
      'When paid plans launch, you will be able to cancel from billing settings. Monthly plans will stop at the end of the current billing period; annual plans will stop renewing with access retained for the remainder of the paid year. Refunds for annual plans will only be given where required by consumer law (see our Refund Policy). While we are testing, access is free and no card is required.',
  },
];
