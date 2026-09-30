import { describe, test, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

/**
 * Guard against committing Supabase API keys. A legacy service_role JWT was
 * once hard-coded in scripts/; keys must only ever come from env vars.
 *
 * Patterns are assembled from pieces so this file never matches itself.
 */
const root = process.cwd();
const SKIP_DIRS = new Set(['node_modules', '.git', '.next', '.vercel', 'coverage', 'playwright-report', 'test-results']);
const TEXT_EXT = new Set([
  '.ts', '.tsx', '.js', '.mjs', '.cjs', '.jsx', '.json', '.md', '.mdx', '.sql', '.yml', '.yaml', '.env', '.txt', '.html', '.toml', '.sh',
]);

// Base64url of '{"alg":"HS256"' (Supabase legacy JWT header) followed by a payload/signature.
const LEGACY_JWT = new RegExp(['eyJhbGciOiJIUzI1Ni', '[A-Za-z0-9_-]*\\.eyJ[A-Za-z0-9_-]{20,}\\.[A-Za-z0-9_-]{20,}'].join(''));
// New-style keys: sb_secret_… / sb_publishable_… followed by a real-looking value.
const NEW_KEY = new RegExp(['sb_', '(secret|publishable)_', '[A-Za-z0-9_-]{20,}'].join(''));

function walk(dir: string, out: string[]) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (st.size < 2_000_000 && (TEXT_EXT.has(extname(name)) || name.startsWith('.env'))) out.push(full);
  }
}

describe('no hard-coded Supabase keys', () => {
  test('repository contains no Supabase JWT or sb_ key literals', () => {
    const files: string[] = [];
    walk(root, files);
    const offenders: string[] = [];
    for (const file of files) {
      const src = readFileSync(file, 'utf-8');
      if (LEGACY_JWT.test(src) || NEW_KEY.test(src)) offenders.push(relative(root, file));
    }
    expect(offenders).toEqual([]);
  });

  test('scripts read the Supabase secret key from env', () => {
    const src = readFileSync(join(root, 'scripts/admin/check-customer-access.mjs'), 'utf-8');
    expect(src).toMatch(/process\.env\.SUPABASE_SECRET_KEY \|\| process\.env\.SUPABASE_SERVICE_ROLE_KEY/);
  });
});
