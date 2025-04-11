"use client";

import React from "react";

type CreativePageLayoutProps = {
  children?: React.ReactNode;
};

export default function CreativePageLayout({ children }: CreativePageLayoutProps) {
  return (
    <section className="w-full min-h-screen bg-black font-basica text-[#fef4dc] pt-[10rem] sm:pt-[13.25rem] md:pt-[14.5rem] px-6 md:px-12 lg:px-24">
      {children}
    </section>
  );
}
