"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SESSION_CHANGED_EVENT, useSession } from "@/hooks/useSession";
import { useIntroFinished } from "@/hooks/useIntroFinished";
import { clearTabSession } from "@/lib/tabSession";

/**
 * Sign out, shown on every page while vittorio or jaime are signed in.
 * Fixed to the top right so it sits in the header band on every layout.
 */
export default function SignOutButton() {
  const { isStaff } = useSession();
  const introFinished = useIntroFinished();
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  // Stays out of the way until the signature intro has played
  if (!isStaff || !introFinished) return null;

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);

    try {
      await fetch("/api/auth/session", { method: "DELETE" });
      clearTabSession();
      window.dispatchEvent(new CustomEvent(SESSION_CHANGED_EVENT));
      router.refresh();
    } catch (err) {
      console.error("❌ Error signing out:", err);
      setSigningOut(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={signingOut}
      aria-label="Sign out"
      className="fixed top-3 right-6 z-[2147483002] font-blurlight uppercase tracking-wide
                 rounded-md border-2 border-[#fec776] bg-transparent px-5 py-2 text-base
                 text-[#fec776] transition-colors hover:bg-[#fec776] hover:text-[#554943]"
    >
      {signingOut ? "Signing out…" : "Sign out"}
    </button>
  );
}
