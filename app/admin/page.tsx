"use client";

import { useState, useEffect, useCallback } from "react";
import ArchitectureContentPanel from "@/components/architectureContentPanel";
// import ProductDesignContentPanel from "@/components/productDesignContentPanel"; // Section not active
import ArtContentPanel from "@/components/artContentPanel";
import FilmContentPanel from "@/components/filmContentPanel";
import NewsContentPanel from "@/components/newsContentPanel";
import SectionSwitches from "@/components/sectionSwitches";
import { SectionKey, SectionSetting, defaultSectionSettings, isSectionKey } from "@/lib/sections";
import { SECTION_SETTINGS_UPDATED_EVENT } from "@/hooks/useSectionSettings";
import { SESSION_CHANGED_EVENT, useSession } from "@/hooks/useSession";

/** Sections without a content panel yet – the button is a placeholder for now */
type PanelKey = SectionKey | "about" | "contact" | "cursor";

const GROUPS: { title: string; items: { key: PanelKey; label: string; dot: string }[] }[] = [
  {
    title: "Main",
    items: [
      { key: "architecture", label: "Architecture", dot: "#fff5e0" },
      { key: "art", label: "Art", dot: "#895a59" },
      { key: "film", label: "Film", dot: "#2d2f38" },
    ],
  },
  {
    title: "Footer",
    items: [
      { key: "news", label: "News", dot: "#4a7c59" },
      { key: "about", label: "About", dot: "#fec776" },
      { key: "contact", label: "Contact", dot: "#a08e80" },
    ],
  },
  {
    title: "Misc",
    items: [{ key: "cursor", label: "Cursor", dot: "#847263" }],
  },
];

const AdminPage = () => {
  const { user, loaded: sessionLoaded } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [sectionSettings, setSectionSettings] = useState<Record<SectionKey, SectionSetting>>(
    defaultSectionSettings
  );
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [savingSection, setSavingSection] = useState<SectionKey | null>(null);

  const isAuthenticated = user !== null;

  // Dispatch events when panels expand/collapse for footer visibility
  useEffect(() => {
    if (activePanel !== null) {
      window.dispatchEvent(new CustomEvent("admin-panel-open"));
    } else {
      window.dispatchEvent(new CustomEvent("admin-panel-close"));
    }
  }, [activePanel]);

  // Nothing open: everything fits on one screen, so no scrolling at all
  useEffect(() => {
    if (activePanel !== null) return;

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    html.style.setProperty("overflow", "hidden", "important");
    body.style.setProperty("overflow", "hidden", "important");

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [activePanel]);

  // Load the section switches once logged in
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/sections", { cache: "no-store" });
        const data = await res.json();
        if (cancelled || !Array.isArray(data?.sections)) return;

        const next = defaultSectionSettings();
        for (const entry of data.sections as SectionSetting[]) {
          if (isSectionKey(entry?.section)) {
            next[entry.section] = {
              section: entry.section,
              hidden: entry.hidden === true,
              paused: entry.paused === true,
            };
          }
        }
        setSectionSettings(next);
      } catch (err) {
        console.error("❌ Error fetching section settings:", err);
      } finally {
        if (!cancelled) setSettingsLoaded(true);
      }
    };

    fetchSettings();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const updateSection = useCallback(
    async (section: SectionKey, key: "hidden" | "paused", value: boolean) => {
      const previous = sectionSettings[section];
      setSectionSettings((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } })); // optimistic
      setSavingSection(section);

      try {
        const res = await fetch("/api/sections", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section, [key]: value }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || "Failed to update section");
        }

        window.dispatchEvent(new CustomEvent(SECTION_SETTINGS_UPDATED_EVENT));
      } catch (err) {
        console.error("❌ Error updating section settings:", err);
        setSectionSettings((prev) => ({ ...prev, [section]: previous })); // revert
        alert("Could not save the change. Please try again.");
      } finally {
        setSavingSection(null);
      }
    },
    [sectionSettings]
  );

  const handleLogin = async () => {
    if (signingIn) return;
    setSigningIn(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setLoginError(err?.error || "Could not sign in");
        return;
      }

      setPassword("");
      // Refreshes useSession here and anywhere else on the page
      window.dispatchEvent(new CustomEvent(SESSION_CHANGED_EVENT));
    } catch (err) {
      console.error("❌ Error signing in:", err);
      setLoginError("Could not sign in");
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
      setActivePanel(null);
      window.dispatchEvent(new CustomEvent(SESSION_CHANGED_EVENT));
    } catch (err) {
      console.error("❌ Error signing out:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-96 p-6 bg-transparent text-white">
          <h1 className="text-2xl font-blurlight mb-4 text-center"></h1>
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="bg-transparent font-blurlight text-black w-full p-2 mb-4 border border-gray-600 rounded-md"
            placeholder="Enter user"
          />
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="bg-transparent font-blurlight text-black w-full p-2 mb-4 border border-gray-600 rounded-md"
            placeholder="Enter password"
          />
          {loginError && (
            <p className="font-blurlight text-sm text-black mb-3 text-center">{loginError}</p>
          )}
          <button
            onClick={handleLogin}
            disabled={signingIn || !sessionLoaded}
            className="w-full font-blurlight bg-transparent text-white py-2 px-4 rounded-md"
          >
            {signingIn ? "Signing in…" : "Login"}
          </button>
        </div>
      </div>
    );
  }

  const switchesFor = (section: SectionKey) => (
    <SectionSwitches
      section={section}
      hidden={sectionSettings[section].hidden}
      paused={sectionSettings[section].paused}
      disabled={!settingsLoaded || savingSection !== null}
      onChange={updateSection}
    />
  );

  return (
    <div className={`min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-6.5rem)] md:min-h-[calc(100vh-7rem)] bg-[#554943] text-[#19333F] px-6 md:px-12 lg:px-24 mt-[6rem] sm:mt-[6.5rem] md:mt-[7rem] ${activePanel === null ? "pb-8" : "pb-28 sm:pb-32"}`}>
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-blurlight text-black text-2xl font-bold">
          Welcome back {user ? user.charAt(0).toUpperCase() + user.slice(1) : ""}
        </h1>
        <button
          onClick={handleLogout}
          className="font-blurlight text-sm text-black/70 hover:text-black underline bg-transparent p-0"
        >
          Log out
        </button>
      </div>

      {GROUPS.map(({ title, items }) => (
        <div key={title} className="mt-8 first:mt-4">
          <h2 className="font-blurlight text-black text-lg font-bold mb-3">{title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {items.map(({ key, label, dot }) => {
              const setting = isSectionKey(key) ? sectionSettings[key] : null;
              // Deactivated or paused sections read as dimmed, but stay editable
              const isDimmed = setting ? setting.hidden || setting.paused : false;

              return (
                <div key={key} className="flex flex-col gap-3">
                  <button
                    onClick={() => setActivePanel(activePanel === key ? null : key)}
                    className={`font-blurlight bg-[#554943] border-2 py-3 px-6 rounded-md flex items-center gap-2 w-full transition-opacity ${
                      isDimmed ? "border-black/40 text-black/40 opacity-50" : "border-black text-black"
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: dot, opacity: isDimmed ? 0.4 : 1 }}
                    ></div>
                    {label}
                  </button>
                  {/* No content panel built for this one yet */}
                  {activePanel === key && !setting && (
                    <p className="font-blurlight text-sm text-black/70 pl-1">
                      Configuration coming soon.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Content Panels – each opens with its section switches under the heading */}
      <ArchitectureContentPanel
        isActive={activePanel === "architecture"}
        headerSlot={switchesFor("architecture")}
      />
      {/* <ProductDesignContentPanel isActive={activePanel === "productdesign"} /> */}
      <ArtContentPanel isActive={activePanel === "art"} headerSlot={switchesFor("art")} />
      <FilmContentPanel isActive={activePanel === "film"} headerSlot={switchesFor("film")} />
      <NewsContentPanel isActive={activePanel === "news"} headerSlot={switchesFor("news")} />
    </div>
  );
};

export default AdminPage;
