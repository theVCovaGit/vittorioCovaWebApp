"use client";

import { useEffect, useState, useRef } from "react";
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
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const isMobile = useIsMobile();
  const imageRefs = useRef<Map<number, HTMLImageElement>>(new Map());

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

  // Fetch project data and preload images
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setImagesPreloaded(false);
      
      try {
        const response = await fetch(`/api/architecture/${projectId}`);
        if (response.ok) {
          const data = await response.json();
          const projectData = data.project;
          setProject(projectData);
          
          // Preload all images before showing them
          if (projectData.images && projectData.images.length > 0) {
            await preloadImages(projectData.images);
            
            // Small delay to ensure images are in browser cache and DOM can render them
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Force all images to be in the DOM and rendered
            requestAnimationFrame(() => {
              // Trigger a reflow to force all images to render
              imageRefs.current.forEach((img) => {
                if (img) {
                  // Force browser to render the image
                  void img.offsetHeight;
                }
              });
            });
          } else {
            // If no images, mark as preloaded immediately
            setImagesPreloaded(true);
            setLoading(false);
            return;
          }
          
          setImagesPreloaded(true);
          // Small additional delay before hiding loading screen to ensure DOM is ready
          setTimeout(() => {
            setLoading(false);
          }, 150);
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

  if (loading || !imagesPreloaded) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className={`text-white font-microextend ${isMobile ? 'text-lg' : 'text-xl'}`}>Loading ...</div>
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
        <div 
          className={`absolute ${isMobile ? 'top-16' : 'top-20'} left-0 right-0 bottom-0 overflow-y-auto scrollbar-hide`}
          style={{ 
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
                const imageHeight = isMobile ? 'calc((100vh - 4rem) / 2)' : 'calc(100vh - 5rem)';
                return (
                  <div 
                    key={`${project.id}-${index}`} 
                    className="w-full flex-shrink-0 overflow-hidden relative"
                    style={{ 
                      height: imageHeight,
                      minHeight: imageHeight,
                      willChange: 'auto',
                      contain: 'layout style paint',
                      position: 'relative',
                      display: 'block'
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={(el) => {
                        if (el) {
                          imageRefs.current.set(index, el);
                        } else {
                          imageRefs.current.delete(index);
                        }
                      }}
                      src={image}
                      alt={`${project.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="eager"
                      decoding="sync"
                      style={{ 
                        willChange: 'auto',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 1
                      }}
                      onLoad={(e) => {
                        // Ensure image is fully loaded
                        const img = e.currentTarget;
                        if (!img.complete || (img.naturalWidth === 0 && img.naturalHeight === 0)) {
                          // Force reload if not complete
                          const src = img.src;
                          img.src = '';
                          img.src = src;
                        }
                        // Force opacity to ensure visibility
                        img.style.opacity = '1';
                      }}
                      onError={() => {
                        console.error(`Failed to display image: ${image}`);
                      }}
                    />
                  </div>
                );
              })}
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
          <div className={`absolute ${isMobile ? 'top-[14vh]' : 'bottom-[24.25rem]'} left-12`}>
            <div className={`text-[#fbef56] font-electrolize font-bold ${isMobile ? 'text-sm' : 'text-xl'}`}>
              {project.city.toUpperCase()}
            </div>
            <div className={`text-[#fff5e0] font-microextend font-bold mt-1 transform -translate-y-2 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
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
