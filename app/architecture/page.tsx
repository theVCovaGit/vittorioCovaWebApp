"use client";

import { useEffect, useState } from "react";

interface ArchitectureProject {
  id: number;
  type: "architecture";
  title: string;
  country: string;
  city: string;
  category: string;
  year?: string;
  images: string[];
  icon?: string;
  position?: number;
  page?: number;
}

// Position mapping for 3x3 grid inside the scroll with symmetric spacing
const getPositionStyles = (position: number) => {
  const positions = {
    1: "top-[20%] left-[10%]",      // Top-left
    2: "top-[20%] left-[50%]",      // Top-center  
    3: "top-[20%] right-[10%]",     // Top-right
    4: "top-[50%] left-[10%]",      // Middle-left
    5: "top-[50%] left-[50%]",      // Center
    6: "top-[50%] right-[10%]",     // Middle-right
    7: "top-[80%] left-[10%]",      // Bottom-left
    8: "top-[80%] left-[50%]",      // Bottom-center
    9: "top-[80%] right-[10%]"      // Bottom-right
  };
  return positions[position as keyof typeof positions] || positions[1];
};

export default function Architecture() {
  const [projects, setProjects] = useState<ArchitectureProject[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/architecture');
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  // Get projects for current page
  const currentPageProjects = projects.filter(project => (project.page || 1) === currentPage);

  return (
    <div className="min-h-screen bg-[#fff5e0] relative overflow-visible">
      {/* Film Strip Container */}
      <div 
        className="film-strip-container absolute top-[48.3%] left-0 transform -translate-y-1/2 w-screen h-[700px] overflow-x-scroll overflow-y-visible scrollbar-hide"
        style={{ 
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Architecture Scroll with Tapes */}
        <div className="relative w-full h-full flex items-center">
          <div className="relative flex-shrink-0">
            <img 
              src="/assets/scroll.svg" 
              alt="Architecture Scroll" 
              className="h-[500px] w-auto object-contain"
            />
            
            {/* Tapes positioned relative to the scroll - Above */}
            <img 
              src="/assets/tape1.svg" 
              alt="Tape" 
              className="absolute -top-4 left-[5%] w-48 h-16 opacity-80 transform rotate-[2deg] z-[9999]"
            />
            <img 
              src="/assets/tape2.svg" 
              alt="Tape" 
              className="absolute -top-4 left-[25%] w-48 h-16 opacity-80 transform rotate-[-5deg] z-[9999]"
            />
            <img 
              src="/assets/tape3.svg" 
              alt="Tape" 
              className="absolute -top-4 left-[45%] w-48 h-16 opacity-80 transform rotate-[4deg] z-[9999]"
            />
            <img 
              src="/assets/tape4.svg" 
              alt="Tape" 
              className="absolute -top-4 left-[65%] w-48 h-16 opacity-80 transform rotate-[-2deg] z-[9999]"
            />
            <img 
              src="/assets/tape5.svg" 
              alt="Tape" 
              className="absolute -top-4 left-[85%] w-48 h-16 opacity-80 transform rotate-[3deg] z-[9999]"
            />
            <img 
              src="/assets/tape6.svg" 
              alt="Tape" 
              className="absolute -top-4 left-[15%] w-48 h-16 opacity-80 transform rotate-[-4deg] z-[9999]"
            />
            
            {/* Tapes positioned relative to the scroll - Below */}
            <img 
              src="/assets/tape7.svg" 
              alt="Tape" 
              className="absolute bottom-[-20px] left-[5%] w-48 h-16 opacity-80 transform rotate-[2deg] z-[9999]"
            />
            <img 
              src="/assets/tape8.svg" 
              alt="Tape" 
              className="absolute bottom-[-20px] left-[25%] w-48 h-16 opacity-80 transform rotate-[-5deg] z-[9999]"
            />
            <img 
              src="/assets/tape9.svg" 
              alt="Tape" 
              className="absolute bottom-[-20px] left-[45%] w-48 h-16 opacity-80 transform rotate-[4deg] z-[9999]"
            />
            <img 
              src="/assets/tape10.svg" 
              alt="Tape" 
              className="absolute bottom-[-20px] left-[65%] w-48 h-16 opacity-80 transform rotate-[-2deg] z-[9999]"
            />
            <img 
              src="/assets/tape11.svg" 
              alt="Tape" 
              className="absolute bottom-[-20px] left-[85%] w-48 h-16 opacity-80 transform rotate-[3deg] z-[9999]"
            />

            {/* Architecture Projects positioned INSIDE the scroll based on their position data */}
            {currentPageProjects.map((project) => (
              <div
                key={project.id}
                className={`absolute w-32 h-32 transform -translate-x-1/2 -translate-y-1/2 z-10 ${getPositionStyles(project.position || 1)}`}
              >
                <div className="relative w-full h-full bg-white rounded-lg shadow-lg border-2 border-gray-300 overflow-hidden hover:scale-105 transition-transform duration-200">
                  {project.images && project.images.length > 0 && (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
                    <h3 className="text-xs font-bold truncate">{project.title}</h3>
                    <p className="text-xs truncate">{project.city}, {project.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <img 
            src="/assets/scroll.svg" 
            alt="Architecture Scroll" 
            className="h-[500px] w-auto object-contain flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
