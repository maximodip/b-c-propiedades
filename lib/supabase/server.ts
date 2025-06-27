import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createBrowserClient } from "./client";

export async function createClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  // Check if we're in a server context where cookies() is available
  try {
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: "", ...options });
            } catch {
              // The `delete` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
  } catch {
    // If we're in a client context or cookies() is not available,
    // use the browser client instead
    return createBrowserClient();
  }
}
