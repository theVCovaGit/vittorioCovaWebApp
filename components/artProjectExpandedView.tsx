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
      className="fixed inset-0 bg-[#895a59] z-50"
      onClick={handleClose}
    >
      <div 
        className="relative w-full h-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side - Artwork Display (Smaller) */}
        <div className="absolute left-0 top-0 bottom-0 w-[35%] bg-transparent overflow-hidden z-10">
          {currentImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Navigation Arrows */}
              {project.images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 z-10 hover:opacity-80 transition-opacity bg-transparent border-0 p-0"
                  >
                    <img
                      src="/assets/onHover.png"
                      alt="Previous"
                      className="w-12 h-12 object-contain"
                    />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 z-10 hover:opacity-80 transition-opacity bg-transparent border-0 p-0"
                  >
                    <img
                      src="/assets/onHover.png"
                      alt="Next"
                      className="w-12 h-12 object-contain"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                  </button>
                </>
              )}
              
              {/* Main Artwork Image */}
              <img
                src={currentImage}
                alt={project.title}
                className="max-w-[90%] max-h-[90%] object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              No image available
            </div>
          )}
        </div>

        {/* Right Side - Product Details (Red background extends full width) */}
        <div className="absolute left-0 right-0 top-0 bottom-0 bg-[#895a59] overflow-y-auto">
          <div className="ml-[35%] h-full p-8 md:p-12">
          {/* ART Label - Top Right */}
          <div className="absolute top-6 right-6 md:top-8 md:right-12">
            <div 
              className="text-[#fbef56] font-microextend font-bold tracking-wider uppercase cursor-pointer hover:text-[#fff5e0] transition-colors text-lg md:text-xl"
              onClick={handleClose}
            >
              ART
            </div>
          </div>

          {/* Collection Name and For Sale */}
          <div className="mt-12 md:mt-16">
            <h1 className="text-white font-microextend font-bold text-2xl md:text-3xl uppercase tracking-wider mb-2">
              {project.collection.toUpperCase()} COLLECTION
            </h1>
            <div className="text-[#fbef56] font-microextend text-sm md:text-base mb-8">
              For Sale
            </div>
          </div>

          {/* Description */}
          <div className="text-[#fff5e0] font-basica text-sm md:text-base leading-relaxed mb-8 max-w-lg">
            {project.discipline && (
              <p className="mb-4">
                <span className="font-bold">{project.discipline.toUpperCase()}</span>
                {project.collection && ` · ${project.collection.toUpperCase()}`}
              </p>
            )}
            <p className="mb-4">
              {project.title}
            </p>
            {project.city && project.country && (
              <p className="mb-4">
                {project.city}, {project.country}
                {project.year && ` · ${project.year}`}
              </p>
            )}
          </div>

          {/* Price - Placeholder for now */}
          <div className="text-white font-microextend font-bold text-2xl md:text-3xl mb-8">
            Price on Request
          </div>

          {/* I want it Button */}
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white font-microextend py-3 px-8 rounded-sm transition-colors mb-8"
            onClick={() => {
              // TODO: Handle purchase intent
              alert('Contact us for purchase information');
            }}
          >
            I want it
          </button>

          {/* Thumbnail Navigation - 5 rectangles */}
          {project.images && project.images.length > 0 && (
            <div className="flex gap-2">
              {project.images.slice(0, 5).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-16 border-2 ${
                    currentImageIndex === index 
                      ? 'border-[#fbef56]' 
                      : 'border-[#fbef56]/30'
                  } overflow-hidden`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
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

