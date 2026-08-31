"use client";

import { useEffect, useState } from "react";
import {
  AboutContent,
  ContactContent,
  defaultAboutContent,
  defaultContactContent,
  parseAboutContent,
  parseContactContent,
} from "@/lib/pageContent";

export const ABOUT_UPDATED_EVENT = "about-content-updated";
export const CONTACT_UPDATED_EVENT = "contact-content-updated";

function usePageContent<T>(
  endpoint: string,
  event: string,
  fallback: () => T,
  parse: (value: unknown) => T
) {
  const [content, setContent] = useState<T>(fallback);

  useEffect(() => {
    let cancelled = false;

    const fetchContent = async () => {
      try {
        const res = await fetch(endpoint, { cache: "no-store" });
        const data = await res.json();
        if (!cancelled && data?.content) setContent(parse(data.content));
      } catch (error) {
        console.error(`❌ Error fetching ${endpoint}:`, error);
      }
    };

    fetchContent();

    const handleUpdate = () => fetchContent();
    window.addEventListener(event, handleUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener(event, handleUpdate);
    };
    // endpoint/event/parse are module constants
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return content;
}

/** The /about copy, starting from the built-in text so nothing flashes empty. */
export const useAboutContent = (): AboutContent =>
  usePageContent("/api/about", ABOUT_UPDATED_EVENT, defaultAboutContent, parseAboutContent);

/** The /contact copy, starting from the built-in text so nothing flashes empty. */
export const useContactContent = (): ContactContent =>
  usePageContent("/api/contact", CONTACT_UPDATED_EVENT, defaultContactContent, parseContactContent);
