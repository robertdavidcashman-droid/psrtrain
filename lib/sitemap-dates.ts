import { statSync } from 'node:fs';
import { join } from 'node:path';

/** Build-time stamp from next.config env (YYYY-MM-DD). */
export function getBuildLastModified(): Date {
  const raw = process.env.NEXT_PUBLIC_BUILD_DATE?.trim();
  if (raw) {
    const d = new Date(`${raw}T12:00:00.000Z`);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

/** Last modified time for a file under `app/` (falls back to build date). */
export function getAppRouteLastModified(relativePathFromApp: string): Date {
  try {
    const filePath = join(process.cwd(), 'app', relativePathFromApp);
    return statSync(filePath).mtime;
  } catch {
    return getBuildLastModified();
  }
}

export function parseContentPublished(value: string | undefined, fallback: Date): Date {
  if (!value) return fallback;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? fallback : d;
}
