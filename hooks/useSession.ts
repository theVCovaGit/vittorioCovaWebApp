"use client";

import { useEffect, useState } from "react";

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
        if (!cancelled) setUser(typeof data?.user === "string" ? data.user : null);
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
