"use client";

import { useEffect, useMemo, useState } from "react";

interface PositionAssignment {
  id: number | string;
  title?: string;
  position?: number | null;
  page?: number | null;
  icon?: string;
  images?: string[];
}

interface FilmProjectPositionProps {
  onPositionSelect?: (position: number) => void;
  currentPosition?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  projects?: PositionAssignment[];
}

const SLOTS_PER_PAGE = 4;

const FilmProjectPosition = ({
  onPositionSelect,
  currentPosition = 1,
  currentPage = 1,
  onPageChange,
  projects = [],
}: FilmProjectPositionProps) => {
  const [selectedPosition, setSelectedPosition] = useState<number>(currentPosition);
  const [page, setPage] = useState<number>(currentPage);

  const pageAssignments = useMemo(() => {
    const map = new Map<number, PositionAssignment>();
    projects.forEach((project) => {
      if (
        project &&
        typeof project.position === "number" &&
        (project.page ?? 1) === page
      ) {
        map.set(project.position, project);
      }
    });
    return map;
  }, [projects, page]);

  useEffect(() => {
    setSelectedPosition(currentPosition);
  }, [currentPosition]);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const handlePositionClick = (position: number) => {
    const occupant = pageAssignments.get(position);
    
    setSelectedPosition(position);
    onPositionSelect?.(position);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      onPageChange?.(newPage);
      // Reset position to 1 when changing pages
      setSelectedPosition(1);
      onPositionSelect?.(1);
    }
  };

  const handleNextPage = () => {
    const newPage = page + 1;
    setPage(newPage);
    onPageChange?.(newPage);
    // Reset position to 1 when changing pages
    setSelectedPosition(1);
    onPositionSelect?.(1);
  };

  const handlePageInputChange = (newPage: number) => {
    if (newPage >= 1) {
      setPage(newPage);
      onPageChange?.(newPage);
      // Reset position to 1 when changing pages
      setSelectedPosition(1);
      onPositionSelect?.(1);
    }
  };

  const selectedAssignment = pageAssignments.get(selectedPosition);

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="font-microextend text-sm text-gray-400">Page {page}</div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={page <= 1}
            className="font-microextend rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            &lt;
          </button>
          <input
            type="number"
            min="1"
            value={page}
            onChange={(e) => handlePageInputChange(parseInt(e.target.value, 10) || 1)}
            className="w-12 rounded border border-gray-300 px-1 py-1 text-center text-sm font-microextend"
          />
          <button
            onClick={handleNextPage}
            className="font-microextend rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Film strip visualization with 4 slots */}
      <div className="relative w-full overflow-hidden rounded-md border border-gray-300 bg-[#2d2f38]">
        <div className="grid grid-cols-4 gap-2 p-4 h-64">
          {Array.from({ length: SLOTS_PER_PAGE }, (_, index) => {
            const position = index + 1; // Positions 1-4 per page
            const occupant = pageAssignments.get(position);
            const isOccupied = Boolean(occupant);
            const isSelected = selectedPosition === position;

            const previewUrl = occupant?.icon || occupant?.images?.[0] || null;
            const hasPreview = Boolean(previewUrl);

            const baseClasses =
              "relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-md border-2 transition-colors";

            const variantClasses = isSelected
              ? "cursor-pointer border-blue-400 shadow-[0_0_0_2px_rgba(59,130,246,0.6)]"
              : isOccupied
              ? "cursor-pointer border-[#fdf053]/70 bg-[#433231] hover:border-[#fdf053]"
              : "cursor-pointer border-gray-500/60 bg-gray-500/20 hover:border-gray-400 hover:bg-gray-500/30";

            return (
              <div
                key={position}
                className={`${baseClasses} ${variantClasses}`}
                onClick={() => handlePositionClick(position)}
                title={occupant?.title || `Slot ${position}`}
              >
                {hasPreview && (
                  <>
                    <div
                      className="pointer-events-none absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${previewUrl})` }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-black/45" />
                  </>
                )}

                <span
                  className={`pointer-events-none absolute left-2 top-2 text-xs font-semibold ${
                    hasPreview ? "text-white drop-shadow" : "text-gray-300"
                  }`}
                >
                  #{position}
                </span>
                <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center px-2 text-center">
                  {isOccupied ? (
                    <>
                      <span
                        className={`truncate text-sm font-semibold leading-tight ${
                          isSelected ? "text-blue-200" : "text-[#FFF3DF]"
                        }`}
                      >
                        {occupant?.title || "Occupied"}
                      </span>
                      {occupant?.page && (
                        <span className="mt-1 text-xs uppercase tracking-wide text-gray-200">
                          Page {occupant.page}
                        </span>
                      )}
                    </>
                  ) : (
                    <span
                      className={`text-lg font-bold ${
                        isSelected
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    >
                      {position}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedPosition && (
        <div className="mt-3 text-sm text-gray-600 font-microextend">
          Selected position: {selectedPosition}
          {selectedAssignment?.title && (
            <span className="ml-2 text-gray-400">
              · {selectedAssignment.title}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilmProjectPosition;

