/** Log PostgREST write failures without swallowing permission/RLS errors. */
export function logSupabaseWriteError(
  label: string,
  error: { message: string; code?: string; details?: string } | null,
): void {
  if (!error) return;
  console.error(label, {
    code: error.code,
    message: error.message,
    ...(error.details ? { details: error.details } : {}),
  });
}
