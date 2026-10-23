"use client";

import { useEffect, useState } from "react";
import { hasTabSession } from "@/lib/tabSession";

export const SESSION_CHANGED_EVENT = "site-session-changed";

/**
 * Who is signed in (vittorio / jaime). Signed-in users keep seeing sections that
 * are deactivated or paused, marked as such instead of hidden.
 */
export function useSession() {
  const [user, setUser] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const data = await res.json();
        const signedIn = typeof data?.user === "string" ? data.user : null;

        // A reopened tab has no marker, so the sign-in does not carry over
        if (signedIn && !hasTabSession()) {
          await fetch("/api/auth/session", { method: "DELETE" });
          if (!cancelled) setUser(null);
          return;
        }

        if (!cancelled) setUser(signedIn);
      } catch (error) {
        console.error("❌ Error fetching session:", error);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };

    fetchSession();

    const handleChange = () => fetchSession();
    window.addEventListener(SESSION_CHANGED_EVENT, handleChange);

    return () => {
      cancelled = true;
      window.removeEventListener(SESSION_CHANGED_EVENT, handleChange);
    };
  }, []);

  return { user, loaded, isStaff: user !== null };
}
