/**
 * Resolves the Lemon Squeezy `test_mode` flag from the environment.
 *
 * Behaviour:
 *   - LEMON_SQUEEZY_TEST_MODE="true"   → test mode  (no real money)
 *   - LEMON_SQUEEZY_TEST_MODE="false"  → live mode  (real money)
 *   - unset                            → live in production, test in dev
 *   - any other value                  → throws (fail loud)
 */
export function resolveLemonTestMode(env: NodeJS.ProcessEnv = process.env): boolean {
  const raw = env.LEMON_SQUEEZY_TEST_MODE;

  if (raw === undefined || raw === '') {
    return env.NODE_ENV !== 'production';
  }

  const v = raw.trim().toLowerCase();
  if (v === 'true' || v === '1' || v === 'yes') return true;
  if (v === 'false' || v === '0' || v === 'no') return false;

  throw new Error(
    `LEMON_SQUEEZY_TEST_MODE must be "true" or "false" (got: ${JSON.stringify(raw)})`,
  );
}
