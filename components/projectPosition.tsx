"use client";

import { useState } from "react";

interface ProjectPositionProps {
  onPositionSelect?: (position: number) => void;
  currentPosition?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const ProjectPosition = ({ 
  onPositionSelect, 
  currentPosition = 1,
  currentPage = 1, 
  onPageChange
}: ProjectPositionProps) => {
  const [selectedPosition, setSelectedPosition] = useState<number>(currentPosition);

  const handlePositionClick = (position: number) => {
    setSelectedPosition(position);
    if (onPositionSelect) {
      onPositionSelect(position);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="mt-4">
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-400 font-microextend">
          Page {currentPage}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="px-2 py-1 text-sm bg-transparent border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-microextend"
          >
            &lt;
          </button>
          <input
            type="number"
            min="1"
            value={currentPage}
            onChange={(e) => onPageChange?.(parseInt(e.target.value) || 1)}
            className="w-12 px-1 py-1 text-center border border-gray-300 rounded text-sm font-microextend"
          />
          <button
            onClick={handleNextPage}
            className="px-2 py-1 text-sm bg-transparent border border-gray-300 rounded hover:bg-gray-50 font-microextend"
          >
            &gt;
          </button>
        </div>
      </div>
      
      <div className="w-full h-64 border border-gray-300 rounded-md relative">
        <div className="grid grid-cols-3 grid-rows-3 gap-1 h-full">
          {Array.from({ length: 9 }, (_, index) => {
            const position = index + 1;
            const isSelected = selectedPosition === position;
            
            return (
              <div
                key={index}
                className={`relative w-full h-full border border-gray-300 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                  isSelected 
                    ? 'bg-blue-100 border-blue-400' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => handlePositionClick(position)}
              >
                <span className={`text-lg font-bold ${
                  isSelected ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {position}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {selectedPosition && (
        <div className="mt-3 text-sm text-gray-600 font-microextend">
          Selected position: {selectedPosition}
        </div>
      )}
    </div>
  );
};

export default ProjectPosition;
