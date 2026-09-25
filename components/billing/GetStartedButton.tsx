import Link from 'next/link';

type Plan = 'monthly' | 'annual';

/**
 * Pricing page CTA — account creation when logged out, dashboard when signed in.
 */
export function GetStartedButton({
  plan,
  isAuthenticated,
  className,
  children = 'Get started',
}: Readonly<{
  plan: Plan;
  isAuthenticated: boolean;
  hasPaidAccess?: boolean;
  className: string;
  children?: React.ReactNode;
}>) {
  if (!isAuthenticated) {
    return (
      <Link href={`/signup?plan=${plan}`} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <Link href="/dashboard" className={className}>
      Go to dashboard
    </Link>
  );
}
