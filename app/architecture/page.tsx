"use client";

import React from "react";
import Image from "next/image";
import CreativePageLayout from "@/components/creativePageLayout";

export default function Architecture() {
  return (
    <CreativePageLayout
      heroImage={
        <Image
          src="/images/1.png" // ⬅️ Replace this with your actual path or dynamic src
          alt="Architecture hero image"
          fill
          className="object-cover object-center"
          priority // Optional: makes sure it's loaded ASAP
        />
      }
    >
      <div className="w-full flex flex-col md:flex-row items-start gap-8 md:gap-14 pb-20">
        {/* your content */}
      </div>
    </CreativePageLayout>
  );
}
