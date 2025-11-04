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
        <div className="absolute top-20 left-0 right-0 bottom-0 overflow-y-auto scrollbar-hide">
          {project.images && project.images.length > 0 ? (
            <div className="flex flex-col">
              {project.images.map((image, index) => (
                <div key={index} className="w-full h-[calc(100vh-5rem)] flex-shrink-0">
                  <img
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-[calc(100vh-5rem)] bg-gray-200 flex items-center justify-center">
              <div className="text-gray-500 text-xl">No images available</div>
            </div>
          )}
        </div>

        {/* Project Details Overlay */}
        <div className="absolute top-20 left-0 right-0 bottom-0 pointer-events-none z-20">
          {/* Architecture Text - Top Center */}
          <div className="absolute top-6 left-[43.5%] transform -translate-x-1/2">
            <div className="text-[#fbef56] font-microextend text-lg font-bold tracking-wider uppercase">
              ARCHITECTURE
            </div>
          </div>

          {/* Project Name and Year in Yellow Rectangle */}
          <div className="absolute top-12 left-12 right-[49%]">
            <div className="bg-[#fbef56] pl-5 pr-8 py-2">
              <div className="text-black font-microextend font-bold text-lg tracking-wider uppercase leading-tight">
                {project.title.toUpperCase()}
              </div>
              <div className="text-black font-microextend font-bold text-base -mt-1 leading-tight">
                {project.year || new Date().getFullYear()}
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="absolute top-12 right-8">
            <div className="text-[#FFD700] font-bold text-xl tracking-wider">
              {project.category.toUpperCase()}
            </div>
          </div>

          {/* Location */}
          <div className="absolute bottom-32 left-8">
            <div className="text-[#FFD700] font-bold text-2xl">
              {project.city.toUpperCase()}
            </div>
            <div className="text-[#FFD700] font-bold text-xl mt-1">
              {project.country.toUpperCase()}
            </div>
          </div>

          {/* Project Type */}
          <div className="absolute bottom-20 left-8">
            <div className="text-[#FFD700] font-bold text-lg">
              {project.category.toUpperCase()}
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
}
