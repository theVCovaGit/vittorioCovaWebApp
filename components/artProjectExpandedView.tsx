"use client";

import { useEffect, useState } from "react";
import SponsoredByLifeAnimation from "./sponsoredByLifeAnimation";

interface ArtProject {
  id: number;
  type: "art";
  title: string;
  country: string;
  city: string;
  discipline: string;
  collection: string;
  year?: string;
  images: string[];
  icon?: string;
  position?: number;
  page?: number;
  forSale?: boolean;
  description?: string;
  price?: string;
}

interface ArtProjectExpandedViewProps {
  projectId: number;
  onClose: () => void;
}

export default function ArtProjectExpandedView({ 
  projectId, 
  onClose 
}: ArtProjectExpandedViewProps) {
  const [project, setProject] = useState<ArtProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Helper function to preload images
  const preloadImages = (imageUrls: string[]): Promise<void> => {
    return Promise.all(
      imageUrls.map((url) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          
          const timeout = setTimeout(() => {
            console.warn(`Image preload timeout: ${url}`);
            resolve();
          }, 90000);
          
          img.onload = () => {
            clearTimeout(timeout);
            if (img.complete && (img.naturalWidth > 0 || img.naturalHeight > 0)) {
              resolve();
            } else {
              setTimeout(() => resolve(), 100);
            }
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            console.error(`Failed to load image: ${url}`);
            resolve();
          };
          
          img.src = url;
        });
      })
    ).then(() => {
      return new Promise(resolve => setTimeout(resolve, 100));
    });
  };

  // Fetch project data and preload all images before showing
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      
      try {
        const response = await fetch(`/api/art/${projectId}`);
        if (response.ok) {
          const data = await response.json();
          const projectData = data.project;
          setProject(projectData);
          
          if (projectData.images && projectData.images.length > 0) {
            await preloadImages(projectData.images);
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          setLoading(false);
        } else {
          console.error('Error fetching project:', response.statusText);
          setLoading(false);
          onClose();
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
    window.dispatchEvent(new CustomEvent('art-expanded-close'));
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handlePreviousImage = () => {
    if (project.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (project.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const currentImage = project.images && project.images.length > 0 
    ? project.images[currentImageIndex] 
    : null;

  return (
    <div 
      className="fixed bg-[#FFF3DF] z-50 art-expanded-below-header"
      onClick={handleClose}
    >
      {/* Mobile: stacked — image top (full width, flush under header), text bottom */}
      <div 
        className="md:hidden flex flex-col w-full h-full overflow-hidden pt-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 w-full min-w-full h-[50vh] min-h-[280px] bg-[#e8e0d5] relative overflow-hidden">
          {currentImage ? (
            <>
              <img
                src={currentImage}
                alt={project.title}
                className="absolute top-0 bottom-0 object-cover block"
                style={{
                  left: -1,
                  width: "calc(100% + 2px)",
                  height: "100%",
                  minWidth: "calc(100% + 2px)",
                  minHeight: "100%",
                }}
              />
              {project.images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hover:opacity-80 transition-opacity bg-transparent border-0 p-0"
                  >
                    <img src="/assets/onHover.png" alt="Previous" className="w-10 h-10 object-contain" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hover:opacity-80 transition-opacity bg-transparent border-0 p-0"
                  >
                    <img src="/assets/onHover.png" alt="Next" className="w-10 h-10 object-contain scale-x-[-1]" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[#4A413C]/60 font-blurlight text-sm">No image available</div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto bg-[#FFF3DF] px-6 py-6">
          <h1 className="text-[#4A413C] font-microextend font-bold text-2xl uppercase tracking-wider mb-1">{project.collection.toUpperCase()} COLLECTION</h1>
          <p className="text-[#C6898F] font-microextend text-sm mb-6">For Sale</p>
          {project.description && project.description.trim() && (
            <div className="text-[#4A413C] font-electrolize text-sm leading-relaxed mb-6 max-w-xl"><p>{project.description}</p></div>
          )}
          <button type="button" className="bg-[#4A413C] hover:bg-[#3a332c] text-[#FFF3DF] font-microextend py-3 px-8 rounded-sm transition-colors mb-8" onClick={() => alert('Contact us for purchase information')}>I want it</button>
          {project.images && project.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.images.slice(0, 5).map((img, index) => (
                <button key={index} type="button" onClick={() => setCurrentImageIndex(index)} className={`w-14 h-14 border-2 bg-transparent shrink-0 ${currentImageIndex === index ? 'border-[#4A413C]' : 'border-[#4A413C]/30'} overflow-hidden rounded-sm`}>
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop: left image, right details (original layout) */}
      <div 
        className="hidden md:block relative w-full h-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute left-8 md:left-20 top-0 bottom-0 w-[35%] bg-transparent overflow-hidden z-10">
          {currentImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {project.images.length > 1 && (
                <>
                  <button onClick={handlePreviousImage} className="absolute left-4 z-10 hover:opacity-80 transition-opacity bg-transparent border-0 p-0">
                    <img src="/assets/onHover.png" alt="Previous" className="w-12 h-12 object-contain" />
                  </button>
                  <button onClick={handleNextImage} className="absolute right-4 z-10 hover:opacity-80 transition-opacity bg-transparent border-0 p-0">
                    <img src="/assets/onHover.png" alt="Next" className="w-12 h-12 object-contain scale-x-[-1]" />
                  </button>
                </>
              )}
              <img src={currentImage} alt={project.title} className="w-[130%] max-h-[70%] object-contain" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#4A413C]/60 font-blurlight">No image available</div>
          )}
        </div>
        <div className="absolute left-0 right-0 top-0 bottom-0 bg-[#FFF3DF] overflow-y-auto">
          <div className="absolute top-0 right-0 z-20">
            <div className="h-20" />
            <div className="flex justify-end pr-6 md:pr-12 pt-2">
              <button type="button" className="text-[#4A413C] font-microextend font-bold tracking-wider uppercase cursor-pointer hover:opacity-80 transition-colors text-lg md:text-xl" onClick={handleClose}>ART</button>
            </div>
          </div>
          <div className="ml-[35%] h-full pl-28 md:pl-40 pr-8 md:pr-12 pt-8 md:pt-12 pb-8 md:pb-12">
            <div className="mt-12 md:mt-16">
              <h1 className="text-[#4A413C] font-microextend font-bold text-2xl md:text-3xl uppercase tracking-wider mb-2">{project.collection.toUpperCase()} COLLECTION</h1>
              <p className="text-[#C6898F] font-microextend text-sm md:text-base mb-8">For Sale</p>
            </div>
            {project.description && project.description.trim() && (
              <div className="text-[#4A413C] font-electrolize text-sm md:text-base leading-relaxed mb-8 max-w-lg"><p>{project.description}</p></div>
            )}
            <button type="button" className="bg-[#4A413C] hover:bg-[#3a332c] text-[#FFF3DF] font-microextend py-3 px-8 rounded-sm transition-colors mb-8" onClick={() => alert('Contact us for purchase information')}>I want it</button>
            {project.images && project.images.length > 0 && (
              <div className="flex gap-2">
                {project.images.slice(0, 5).map((img, index) => (
                  <button key={index} type="button" onClick={() => setCurrentImageIndex(index)} className={`w-16 h-16 border-2 bg-transparent ${currentImageIndex === index ? 'border-[#4A413C]' : 'border-[#4A413C]/30'} overflow-hidden rounded-sm`}>
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

