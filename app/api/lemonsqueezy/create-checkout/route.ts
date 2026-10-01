import { NextRequest, NextResponse } from 'next/server';
import { createLemonCheckout } from '@/lib/billing/create-lemon-checkout';
import { getLemonCheckoutApiEnv } from '@/lib/billing/lemon-config';
import {
  isPaymentsEnabled,
  PAYMENTS_DISABLED_STATUS,
} from '@/lib/billing/payments-enabled';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!isPaymentsEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: PAYMENTS_DISABLED_STATUS });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const envCheck = getLemonCheckoutApiEnv();
    if (!envCheck.ok) {
      return NextResponse.json(
        {
          error: 'Lemon Squeezy is not configured',
          missing: envCheck.missing,
        },
        { status: 503 },
      );
    }

    const body = await request.json();
    const plan = body?.plan === 'annual' ? 'annual' : 'monthly';

    const result = await createLemonCheckout({
      apiKey: envCheck.apiKey,
      storeId: envCheck.storeId,
      plan,
      userEmail: user.email,
      userId: user.id,
      origin: request.nextUrl.origin,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error('Lemon Squeezy checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}
