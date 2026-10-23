/**
 * Per-tab marker that makes a sign-in last only as long as the tab.
 *
 * sessionStorage is scoped to one tab and wiped when it closes, so a reopened
 * tab has no marker and the session is dropped on load. The auth cookie is a
 * session cookie too, so nothing is persisted to disk either way.
 */
const TAB_KEY = "vcs_tab_session";

export function markTabSession(): void {
  try {
    sessionStorage.setItem(TAB_KEY, "1");
  } catch {
    // Storage blocked (private mode, hardened settings) - the session cookie still applies
  }
}

/** False only when we can positively tell this tab never signed in. */
export function hasTabSession(): boolean {
  try {
    return sessionStorage.getItem(TAB_KEY) === "1";
  } catch {
    // Can't tell, so don't lock anyone out
    return true;
  }
}

export function clearTabSession(): void {
  try {
    sessionStorage.removeItem(TAB_KEY);
  } catch {
    // Nothing to clear
  }
}
