"use client";

import type { CreativeProject } from "@/types/creative";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AnimatedDotFrame from "@/components/dotFrameAnimation";
import AnimatedDownwardDots from "./downwardDotsAnimation";
import AnimatedSidebarContent from "@/components/sidebarContentAnimation";
import AnimatedHeroImage from "@/components/heroImageAnimation"; 
import ProjectTitleAnimation from "@/components/projectTitleAnimation";


type CreativePageLayoutProps = {
  heroImage?: React.ReactNode;
  children?: React.ReactNode;
  projectList?: React.ReactNode;
  expandedProject?: CreativeProject | null;
  setExpandedProject?: (project: CreativeProject | null) => void;
  
  contentMoved?: boolean;
  setContentMoved?: (v: boolean) => void;
  onHeroClick?: () => void;
};

export default function CreativePageLayout({
  heroImage,
  projectList,
  expandedProject,
  setContentMoved,
}: CreativePageLayoutProps) {
  const [showSection, setShowSection] = useState(false);
  const [slideStarted, setSlideStarted] = useState(false);

  

  const handleHeroClick = () => {
    console.log("Hero clicked starting animation");
    setSlideStarted(true);
  };  

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSection(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.section
      className="relative w-full min-h-screen bg-black font-basica text-[#fef4dc] pt-[10rem] sm:pt-[13.25rem] md:pt-[14.5rem] overflow-x-hidden"
      initial={{ y: "-100%" }}
      animate={{ y: showSection ? 0 : "-100%" }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* 🖼️ Hero image with animation */}
      <AnimatedHeroImage animate={slideStarted}>
        <div onClick={handleHeroClick}>
          {heroImage}
        </div>
      </AnimatedHeroImage>


      {/* 📦 Sidebar + Content (slide out when expanded) */}
      <AnimatedSidebarContent animate={slideStarted}>
        {projectList}
      </AnimatedSidebarContent>

      {/* ⬇️ Downward dots with animation */}
      <AnimatedDownwardDots
        animate={slideStarted}
        onComplete={() => setContentMoved?.(true)}
      />

      {/* 🟡 Dot frame with animation */}
      <AnimatedDotFrame
        animate={slideStarted}
        onComplete={() => setContentMoved?.(true)}
      />

      {/* 🪩 Expanded content overlay */}
      {expandedProject && (
  <ProjectTitleAnimation
    title={expandedProject.title}
    animateIn={true}
  />
)}
    </motion.section>
  );
}
