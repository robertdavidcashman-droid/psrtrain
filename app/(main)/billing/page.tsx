import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { getAccessSnapshot } from '@/lib/auth/access';
import { freeAccessEndsLabel } from '@/lib/free-access-promo';

export default async function BillingPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/auth?${new URLSearchParams({ next: '/billing' }).toString()}`);
  }

  const access = await getAccessSnapshot();
  const untilLabel = freeAccessEndsLabel();

  const statusLabel = access.isAdmin ? 'Admin access' : 'Free while testing';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground mt-1">Your access to PSR Train</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current access</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            Status:{' '}
            <span className="font-semibold text-foreground">{statusLabel}</span>
          </p>
          {!access.isAdmin && (
            <p className="text-sm text-muted-foreground">
              Full training is free while we test — no card required.
              {untilLabel ? ` Promo messaging may reference ${untilLabel}; access is not paywalled.` : ''}
            </p>
          )}
          <Link
            href="/dashboard"
            className="inline-flex text-sm font-medium text-primary hover:underline"
          >
            Go to dashboard
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Planned pricing</CardTitle>
          <CardDescription>Monthly and annual plans are Coming soon</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Paid subscriptions are not available yet. See the{' '}
            <Link href="/pricing" className="text-primary font-medium hover:underline">
              pricing page
            </Link>{' '}
            for planned rates after testing.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Need help?</CardTitle>
          <CardDescription>Questions about access or the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/legal/contact"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Contact support
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
