"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FooterMobile() {
  const pathname = usePathname();
  const isFooterPage = ["/", "/about", "/contact", "/news"].includes(pathname);
  const barcodeRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLAnchorElement>(null);
  const newsRef = useRef<HTMLAnchorElement>(null);
  const [cToSWidth, setCToSWidth] = useState<number | null>(null);
  const [isArchitectureExpanded, setIsArchitectureExpanded] = useState(false);

  // Listen for architecture expanded view events
  useEffect(() => {
    const handleArchitectureExpandedOpen = () => {
      setIsArchitectureExpanded(true);
    };

    const handleArchitectureExpandedClose = () => {
      setIsArchitectureExpanded(false);
    };

    window.addEventListener('architecture-expanded-open', handleArchitectureExpandedOpen);
    window.addEventListener('architecture-expanded-close', handleArchitectureExpandedClose);

    return () => {
      window.removeEventListener('architecture-expanded-open', handleArchitectureExpandedOpen);
      window.removeEventListener('architecture-expanded-close', handleArchitectureExpandedClose);
    };
  }, []);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    
    // Device detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isPhone = isMobile && window.innerWidth < 768; // Phones are typically < 768px
    const initialDelay = isPhone ? 500 : 200; // 500ms for phones, 200ms for tablets/desktop
    
    const updateBarcodePosition = () => {
      if (barcodeRef.current) {
        // Use requestAnimationFrame to ensure layout is complete
        requestAnimationFrame(() => {
          // Check again inside the callback in case ref became null
          if (!barcodeRef.current) return;
          
          const barcodeRect = barcodeRef.current.getBoundingClientRect();
          const bottomOffset = window.innerHeight - barcodeRect.bottom;
          const barcodeHeight = barcodeRect.height;
          const barcodeRight = barcodeRect.right;
          
          // Only set if measurements seem reasonable
          if (barcodeHeight > 0 && bottomOffset >= 0) {
            document.documentElement.style.setProperty('--barcode-bottom-offset', `${bottomOffset}px`);
            document.documentElement.style.setProperty('--barcode-height', `${barcodeHeight}px`);
            document.documentElement.style.setProperty('--barcode-right', `${barcodeRight}px`);
            retryCount = 0; // Reset retry count on success
          } else if (retryCount < maxRetries) {
            // Retry if measurements seem wrong
            retryCount++;
            setTimeout(updateBarcodePosition, 100 * retryCount);
          }
        });
      }
    };

    // Initial update with device-specific delay
    const timeoutId = setTimeout(updateBarcodePosition, initialDelay);

    // Update on resize and scroll
    window.addEventListener('resize', updateBarcodePosition);
    window.addEventListener('scroll', updateBarcodePosition);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateBarcodePosition);
      window.removeEventListener('scroll', updateBarcodePosition);
      document.documentElement.style.removeProperty('--barcode-bottom-offset');
      document.documentElement.style.removeProperty('--barcode-height');
      document.documentElement.style.removeProperty('--barcode-right');
    };
  }, []);

  // On mobile: measure from beginning of C (CONTACT) to end of S (NEWS) using Range API for exact glyph bounds
  useEffect(() => {
    const measure = () => {
      const contact = contactRef.current;
      const news = newsRef.current;
      if (!contact || !news) return;
      const cText = contact.firstChild;
      const nText = news.firstChild;
      if (!cText || !nText || cText.nodeType !== Node.TEXT_NODE || nText.nodeType !== Node.TEXT_NODE) return;
      if ((cText.textContent?.length ?? 0) < 1 || (nText.textContent?.length ?? 0) < 4) return;
      const range = document.createRange();
      range.setStart(cText, 0);
      range.setEnd(cText, 1);
      const cLeft = range.getBoundingClientRect().left;
      range.setStart(nText, 3);
      range.setEnd(nText, 4);
      const sRight = range.getBoundingClientRect().right;
      const offset = 5; // extra pixels on each side, still aligned to C/S flags
      const width = (sRight - cLeft) + 2 * offset;
      if (width > 0) setCToSWidth(width);
    };
    measure();
    requestAnimationFrame(measure);
    const contact = contactRef.current;
    const news = newsRef.current;
    if (contact && news) {
      const ro = new ResizeObserver(measure);
      ro.observe(contact);
      ro.observe(news);
      return () => ro.disconnect();
    }
    const t = setTimeout(measure, 150);
    return () => clearTimeout(t);
  }, []);

  const isArchitecturePage = pathname === "/architecture";
  const isArtPage = pathname === "/art";
  const isHeroPage = pathname === "/";
  const footerTextColor = isHeroPage ? "#fec776" : "#a08e80";
  const footerBg = "transparent";

  return (
    <footer
      className="fixed bottom-0 left-0 z-50 w-full px-4 font-blurlight touch-none flex flex-col items-center justify-center"
      style={{
        touchAction: "none",
        height: "var(--mobile-header-height)",
        minHeight: "var(--mobile-header-height)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        backgroundColor: footerBg,
      }}
    >
      <div className="flex flex-col items-center justify-center gap-1.5 scale-[0.95]">
        {/* Barcode - width matches links (C of CONTACT to S of NEWS) */}
        <div ref={barcodeRef} className="mb-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 367 42"
            fill="none"
            className="h-auto block"
            style={{ width: cToSWidth != null ? `${cToSWidth}px` : "clamp(260px, 75vw, 340px)" }}
          >
          <path d="M5.14062 41.6719H0.328125V0.296875H5.14062V41.6719ZM9.84896 41.6719H7.44271V0.296875H9.84896V41.6719ZM16.6719 41.6719H14.2656V0.296875H16.6719V41.6719ZM28.0729 41.6719H25.6667V0.296875H28.0729V41.6719ZM39.5312 41.6719H34.776V0.296875H39.5312V41.6719ZM48.4844 41.6719H46.1094V0.296875H48.4844V41.6719ZM55.4792 41.6719H50.9948V0.296875H55.4792V41.6719ZM64.5677 41.6719H62.3281V0.296875H64.5677V41.6719ZM78.3438 41.6719H76.1042V0.296875H78.3438V41.6719ZM94.4167 41.6719H89.9792V0.296875H94.4167V41.6719ZM112.625 41.6719H105.995V0.296875H112.625V41.6719ZM83.0104 41.6719H80.7708V0.296875H83.0104V41.6719ZM103.714 41.6719H101.474V0.296875H103.714V41.6719ZM119.641 41.6719H115.057V0.296875H119.641V41.6719ZM140.359 41.6719H135.776V0.296875H140.359V41.6719ZM156.391 41.6719H151.807V0.296875H156.391V41.6719ZM163.177 41.6719H158.589V0.296875H163.177V41.6719ZM172.547 41.6719H167.964V0.296875H172.547V41.6719ZM181.427 41.6719H176.844V0.296875H181.427V41.6719ZM206.583 41.6719H202V0.296875H206.583V41.6719ZM241.052 41.6719H236.464V0.296875H241.052V41.6719ZM257.151 41.6719H252.568V0.296875H257.151V41.6719ZM264.234 41.6719H259.646V0.296875H264.234V41.6719ZM273.219 41.6719H268.635V0.296875H273.219V41.6719ZM284.708 41.6719H277.781V0.296875H284.708V41.6719ZM341.969 41.6719H335.042V0.296875H341.969V41.6719ZM296.089 41.6719H291.5V0.296875H296.089V41.6719ZM307.521 41.6719H302.932V0.296875H307.521V41.6719ZM332.734 41.6719H328.151V0.296875H332.734V41.6719ZM357.87 41.6719H353.286V0.296875H357.87V41.6719ZM190.599 41.6719H183.87V0.296875H190.599V41.6719ZM128.74 41.6719H126.5V0.296875H128.74V41.6719ZM144.896 41.6719H142.656V0.296875H144.896V41.6719ZM199.771 41.6719H197.531V0.296875H199.771V41.6719ZM215.927 41.6719H213.688V0.296875H215.927V41.6719ZM220.552 41.6719H218.312V0.296875H220.552V41.6719ZM229.557 41.6719H227.318V0.296875H229.557V41.6719ZM289.161 41.6719H286.922V0.296875H289.161V41.6719ZM316.604 41.6719H314.365V0.296875H316.604V41.6719ZM325.755 41.6719H323.516V0.296875H325.755V41.6719ZM346.516 41.6719H344.276V0.296875H346.516V41.6719ZM366.88 41.6719H364.641V0.296875H366.88V41.6719ZM245.63 41.6719H243.391V0.296875H245.63V41.6719ZM73.7656 41.6719H66.9948V0.296875H73.7656V41.6719Z"
            fill="#a08e80" 
          />
          </svg>
        </div>

        {/* Links - measured to size barcode (beginning of C to end of S) */}
        <div className="flex items-center justify-center text-xl font-medium leading-none gap-2" style={{ color: footerTextColor }}>
          <Link
            ref={contactRef}
            href="/contact"
            className="cursor-pointer no-underline transition-colors duration-200"
            style={{ color: footerTextColor }}
          >
            CONTACT
          </Link>
          <span>/</span>
          <Link
            href="/about"
            className="cursor-pointer no-underline transition-colors duration-200"
            style={{ color: footerTextColor }}
          >
            ABOUT
          </Link>
          <span>/</span>
          <Link
            ref={newsRef}
            href="/news"
            className="cursor-pointer no-underline transition-colors duration-200"
            style={{ color: footerTextColor }}
          >
            NEWS
          </Link>
        </div>
      </div>
    </footer>
  );
}

