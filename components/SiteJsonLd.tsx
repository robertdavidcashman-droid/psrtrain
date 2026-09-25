import { SITE } from '@/lib/site';
import { AUTHOR } from '@/lib/author';
import { COMPANY } from '@/lib/legalCopy';
import { PSRUK_SITE } from '@/lib/policestationrepuk-promo';
import { CUSTODYNOTE_SITE } from '@/lib/custodynote-promo';
import { PSA_SITE } from '@/lib/policestationagent-promo';

const authorPerson = {
  '@type': 'Person',
  '@id': `${SITE.url}/#author`,
  name: AUTHOR.name,
  jobTitle: AUTHOR.role,
  description: `Criminal defence solicitor and police station representative trainer (${AUTHOR.experience} experience).`,
  url: `${SITE.url}/legal/about`,
  worksFor: { '@id': `${SITE.url}/#organization` },
};

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'EducationalOrganization'],
      '@id': `${SITE.url}/#organization`,
      name: SITE.name,
      legalName: COMPANY.legalName,
      url: SITE.url,
      logo: `${SITE.url}/icon.svg`,
      email: SITE.contactEmail,
      areaServed: 'GB',
      description:
        'Online training platform for Police Station Representatives preparing for the PSRAS accreditation exam.',
      founder: { '@id': `${SITE.url}/#author` },
      sameAs: [PSRUK_SITE, CUSTODYNOTE_SITE, PSA_SITE],
    },
    authorPerson,
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description:
        'Online training for Police Station Representatives preparing for the PSRAS — mock exams, MCQs, and PACE-aligned study.',
      inLanguage: 'en-GB',
      publisher: { '@id': `${SITE.url}/#organization` },
      author: { '@id': `${SITE.url}/#author` },
    },
    {
      '@type': 'Course',
      '@id': `${SITE.url}/#course`,
      name: 'Police Station Representative Accreditation Training',
      description:
        'Comprehensive online training for the Police Station Representative Accreditation Scheme (PSRAS), covering PACE codes, MCQ practice, and mock exams.',
      url: SITE.url,
      provider: { '@id': `${SITE.url}/#organization` },
      inLanguage: 'en-GB',
      educationalLevel: 'Professional',
      teaches: 'Police Station Representative duties under PACE, PSRAS accreditation requirements',
    },
  ],
};

export function SiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
