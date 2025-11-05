"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";

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

interface ArchitectureProjectExpandedViewProps {
  projectId: number;
  onClose: () => void;
}

export default function ArchitectureProjectExpandedView({ 
  projectId, 
  onClose 
}: ArchitectureProjectExpandedViewProps) {
  const [project, setProject] = useState<ArchitectureProject | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/architecture/${projectId}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data.project);
        } else {
          console.error('Error fetching project:', response.statusText);
          onClose(); // Close if project not found
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        onClose();
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId, onClose]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const handleClose = () => {
    // Dispatch the close event first
    window.dispatchEvent(new CustomEvent('architecture-expanded-close'));
    // Add a small delay to ensure the event is processed
    setTimeout(() => {
      onClose();
    }, 100);
  };

  return (
    <div 
      className="fixed inset-0 bg-transparent z-50"
      onClick={handleClose}
    >
      <div 
        className="relative w-full h-full bg-transparent overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Instagram-style Image Carousel - Below main header */}
        <div className={`absolute ${isMobile ? 'top-16' : 'top-20'} left-0 right-0 bottom-0 overflow-y-auto scrollbar-hide`}>
          {project.images && project.images.length > 0 ? (
            <div className="flex flex-col">
              {project.images.map((image, index) => (
                <div key={index} className={`w-full ${isMobile ? 'h-[calc((100vh-4rem)/2)]' : 'h-[calc(100vh-5rem)]'} flex-shrink-0 overflow-hidden`}>
                  <img
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={`w-full ${isMobile ? 'h-[calc(100vh-4rem)]' : 'h-[calc(100vh-5rem)]'} bg-gray-200 flex items-center justify-center`}>
              <div className="text-gray-500 text-xl">No images available</div>
            </div>
          )}
        </div>

        {/* Project Details Overlay */}
        <div className={`absolute ${isMobile ? 'top-16' : 'top-20'} left-0 right-0 bottom-0 pointer-events-none z-20`}>
          {/* Architecture Text - Top Center on desktop, Right on mobile */}
          <div className={`absolute top-6 pointer-events-auto ${isMobile ? 'right-2' : 'left-[43.5%] transform -translate-x-1/2'}`}>
            <div 
              className={`text-[#fbef56] font-microextend font-bold tracking-wider uppercase cursor-pointer hover:text-[#fff5e0] transition-colors ${isMobile ? 'text-base' : 'text-lg'}`}
              onClick={handleClose}
            >
              ARCHITECTURE
            </div>
          </div>

          {/* Project Name and Year in Yellow Rectangle */}
          <div className={`absolute top-14 left-12 ${isMobile ? 'right-0' : 'right-[49%]'}`}>
            <div className={`bg-[#fbef56] pl-1 ${isMobile ? 'py-0 pr-4' : 'py-0.5 pr-8'}`}>
              <div className={`text-black font-microextend font-bold tracking-wider uppercase leading-tight ${isMobile ? 'text-base' : 'text-lg'}`}>
                {project.title.toUpperCase()}
              </div>
              <div className={`text-black font-microextend font-bold -mt-1 leading-tight ${isMobile ? 'text-sm' : 'text-base'}`}>
                {project.year || new Date().getFullYear()}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="absolute bottom-[24.25rem] left-12">
            <div className="text-[#fbef56] font-electrolize font-bold text-xl">
              {project.city.toUpperCase()}
            </div>
            <div className="text-[#fff5e0] font-microextend font-bold text-3xl mt-1 transform -translate-y-2">
              {project.country.toUpperCase()}
            </div>
            <div className="text-[#fbef56] font-electrolize font-bold text-lg mt-1 transform translate-y-4">
              {project.category.toUpperCase()}
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
}
