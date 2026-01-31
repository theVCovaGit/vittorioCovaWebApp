"use client";

import { createPortal } from "react-dom";

const spinnerContent = (
  <div
    className="fixed inset-0 flex flex-col items-center justify-center gap-4 z-[9999] pointer-events-none"
    style={{ top: 0, left: 0, right: 0, bottom: 0 }}
    aria-live="polite"
    aria-busy="true"
  >
    <div className="w-12 h-12 border-4 border-[#554943]/20 border-t-[#554943] rounded-full animate-spin" />
    <p className="font-blurlight text-[#554943]">Loading...</p>
  </div>
);

export default function LoadingSpinner() {
  if (typeof document !== "undefined" && document.body) {
    return createPortal(spinnerContent, document.body);
  }
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-4 z-[9999]"
      style={{ top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="w-12 h-12 border-4 border-[#554943]/20 border-t-[#554943] rounded-full animate-spin" />
      <p className="font-blurlight text-[#554943]">Loading...</p>
    </div>
  );
}
