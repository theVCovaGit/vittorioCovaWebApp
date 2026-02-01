"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import SponsoredByLifeAnimation from "./sponsoredByLifeAnimation";

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
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const isMobile = useIsMobile();

  // Helper function to preload images
  const preloadImages = (imageUrls: string[]): Promise<void> => {
    return Promise.all(
      imageUrls.map((url) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          
          // Set timeout to avoid infinite waiting
          const timeout = setTimeout(() => {
            console.warn(`Image preload timeout: ${url}`);
            resolve(); // Resolve anyway to not block, but log the issue
          }, 90000); // 90 second timeout
          
          img.onload = () => {
            clearTimeout(timeout);
            // Verify image is actually loaded by checking dimensions
            if (img.complete && (img.naturalWidth > 0 || img.naturalHeight > 0)) {
              resolve();
            } else {
              // If image doesn't have dimensions, wait a bit more
              setTimeout(() => resolve(), 100);
            }
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            console.error(`Failed to load image: ${url}`);
            resolve(); // Still resolve to not block, but log error
          };
          
          img.src = url;
        });
      })
    ).then(() => {
      // Add a small delay to ensure images are in browser cache
      return new Promise(resolve => setTimeout(resolve, 100));
    });
  };

  // Fetch project data and preload all images before showing
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setLoadedImages(new Set());
      
      try {
        const response = await fetch(`/api/architecture/${projectId}`);
        if (response.ok) {
          const data = await response.json();
          const projectData = data.project;
          setProject(projectData);
          
          // Preload all images before showing the view
          if (projectData.images && projectData.images.length > 0) {
            await preloadImages(projectData.images);
            // Small delay to ensure images are in browser cache
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          // Only hide loading screen after all images are preloaded
          setLoading(false);
        } else {
          console.error('Error fetching project:', response.statusText);
          setLoading(false);
          onClose(); // Close if project not found
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setLoading(false);
        onClose();
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId, onClose]);

  // Show loading screen until project data and all images are loaded
  if (loading) {
    return <SponsoredByLifeAnimation />;
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
        <div 
          className={`absolute ${isMobile ? '' : 'top-20'} left-0 right-0 bottom-0 overflow-y-auto scrollbar-hide`}
          style={isMobile ? { 
            top: 'var(--mobile-header-height)',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          } : { 
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          {project.images && project.images.length > 0 ? (
            <div 
              className="flex flex-col"
              style={{ 
                minHeight: '100%',
                willChange: 'auto'
              }}
            >
              {project.images.map((image, index) => {
                const imageHeight = isMobile ? `calc((100vh - var(--mobile-header-height)) / 2)` : 'calc(100vh - 5rem)';
                const isLoaded = loadedImages.has(index);
                
                return (
                  <div 
                    key={`${project.id}-${index}`} 
                    className="w-full flex-shrink-0 overflow-hidden relative"
                    style={{ 
                      height: imageHeight,
                      minHeight: imageHeight,
                      position: 'relative',
                      display: 'block',
                      backgroundColor: '#1a1a1a' // Dark background for placeholder
                    }}
                  >
                    {/* Blurred placeholder skeleton */}
                    {!isLoaded && (
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(90deg, #2a2a2a 0%, #1a1a1a 50%, #2a2a2a 100%)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 1.5s infinite',
                        }}
                      />
                    )}
                    
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={`${project.title} - Image ${index + 1}`}
                      loading="eager"
                      decoding="async"
                      style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out',
                        willChange: 'opacity',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)'
                      }}
                      onLoad={() => {
                        setLoadedImages((prev) => {
                          const newSet = new Set(prev);
                          newSet.add(index);
                          return newSet;
                        });
                      }}
                      onError={() => {
                        console.error(`Failed to display image: ${image}`);
                        // Mark as loaded even on error to hide placeholder
                        setLoadedImages((prev) => {
                          const newSet = new Set(prev);
                          newSet.add(index);
                          return newSet;
                        });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div 
              className={`w-full ${isMobile ? '' : 'h-[calc(100vh-5rem)]'} bg-gray-200 flex items-center justify-center`}
              style={isMobile ? { height: 'calc(100vh - var(--mobile-header-height))' } : {}}
            >
              <div className="text-gray-500 text-xl">No images available</div>
            </div>
          )}
        </div>

        {/* Project Details Overlay */}
        <div 
          className={`absolute ${isMobile ? '' : 'top-20'} left-0 right-0 bottom-0 pointer-events-none z-20`}
          style={isMobile ? { top: 'var(--mobile-header-height)' } : {}}
        >
          {/* Architecture Text - Top Center on desktop only; hidden on mobile */}
          {!isMobile && (
            <div className="absolute top-6 left-[43.5%] transform -translate-x-1/2 pointer-events-auto">
              <div 
                className="text-[#fbef56] font-microextend font-bold tracking-wider uppercase cursor-pointer hover:text-[#fff5e0] transition-colors text-lg"
                onClick={handleClose}
              >
                ARCHITECTURE
              </div>
            </div>
          )}

          {/* Project Name and Year in Rectangle (brown bar). Mobile: align to S. Desktop /architecture only: align left edge to "V" in VITTORIO; dimensions unchanged */}
          <div 
            className={`absolute top-14 ${isMobile ? 'right-0' : 'right-[49%]'}`}
            style={
              isMobile
                ? { left: "var(--studio-s-left, 0.75rem)" }
                : { left: "var(--vittorio-v-left, 3rem)" }
            }
          >
            <div className={`bg-[#554943] pl-1 ${isMobile ? 'py-0 pr-4' : 'py-0.5 pr-8'}`}>
              <div className={`text-[#fff3df] font-microextend font-bold tracking-wider uppercase leading-tight ${isMobile ? 'text-base' : 'text-lg'}`}>
                {project.title.toUpperCase()}
              </div>
              <div className={`text-[#fff3df] font-microextend font-bold -mt-1 leading-tight ${isMobile ? 'text-sm' : 'text-base'}`}>
                {project.year || new Date().getFullYear()}
              </div>
            </div>
          </div>

          {/* Location (city, country, building type). Mobile: align to S. Desktop /architecture only: align left edge to "V" in VITTORIO; dimensions unchanged */}
          <div 
            className={`absolute ${isMobile ? 'top-[14vh]' : 'bottom-[24.25rem]'}`}
            style={
              isMobile
                ? { left: "var(--studio-s-left, 0.75rem)" }
                : { left: "var(--vittorio-v-left, 3rem)" }
            }
          >
            <div className={`text-[#fbef56] font-electrolize font-bold ${isMobile ? 'text-sm' : 'text-xl'}`}>
              {project.city.toUpperCase()}
            </div>
            <div className={`text-[#fff5e0] font-blurlight font-bold mt-1 transform -translate-y-2 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
              {project.country.toUpperCase()}
            </div>
            <div className={`text-[#fbef56] font-electrolize font-bold transform ${isMobile ? 'mt-0 translate-y-2' : 'mt-1 translate-y-4'} ${isMobile ? 'text-xs' : 'text-lg'}`}>
              {project.category.toUpperCase()}
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
}
