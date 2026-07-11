import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Returns a configured Supabase server client, or `null` if the environment
 * variables are not present. Callers render a "not configured" state instead
 * of crashing, so the app degrades gracefully when env is missing (e.g. local
 * dev before `vercel env pull`).
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components can't set cookies; middleware handles refresh.
        }
      },
    },
  });
}

export function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
