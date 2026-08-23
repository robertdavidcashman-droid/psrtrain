import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SITE_FAQS } from '@/lib/faq';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata({
  title: 'FAQ',
  description:
    'Frequently asked questions about PSR Train, PSRAS preparation, pricing while testing, and the platform.',
  path: '/legal/faq',
});

export default function FAQPage() {
  const faqs = SITE_FAQS;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <div className="max-w-4xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <Card key={faq.question}>
            <CardHeader>
              <CardTitle className="text-lg">{faq.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{faq.answer}</p>
              {faq.linkUrl ? (
                <a
                  href={faq.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-primary font-semibold hover:underline"
                >
                  {faq.linkLabel ?? faq.linkUrl}
                </a>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Still have questions?</CardTitle>
          <CardDescription>
            If you can&apos;t find the answer you&apos;re looking for, please{' '}
            <a href="/legal/contact" className="text-primary hover:underline">
              contact us
            </a>
            .
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
