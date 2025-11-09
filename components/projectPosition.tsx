"use client";

import { useEffect, useMemo, useState } from "react";

interface PositionAssignment {
  id: number | string;
  title?: string;
  position?: number | null;
  page?: number | null;
  images?: string[];
}

interface ProjectPositionProps {
  onPositionSelect?: (position: number) => void;
  currentPosition?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  projects?: PositionAssignment[];
}

const SLOTS_PER_PAGE = 91;

const ProjectPosition = ({
  onPositionSelect,
  currentPosition = 1,
  currentPage = 1,
  onPageChange,
  projects = [],
}: ProjectPositionProps) => {
  const [selectedPosition, setSelectedPosition] = useState<number>(currentPosition);
  const [page, setPage] = useState<number>(currentPage);

  const assignments = useMemo(() => {
    const map = new Map<number, PositionAssignment>();
    projects.forEach((project) => {
      if (project && typeof project.position === "number") {
        map.set(project.position, project);
      }
    });
    return map;
  }, [projects]);

  useEffect(() => {
    setSelectedPosition(currentPosition);
  }, [currentPosition]);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const handlePositionClick = (position: number) => {
    setSelectedPosition(position);
    if (onPositionSelect) {
      onPositionSelect(position);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      onPageChange?.(newPage);
    }
  };

  const handleNextPage = () => {
    const newPage = page + 1;
    setPage(newPage);
    onPageChange?.(newPage);
  };

  const handlePageInputChange = (newPage: number) => {
    if (newPage >= 1) {
      setPage(newPage);
      onPageChange?.(newPage);
    }
  };

  const selectedAssignment = assignments.get(selectedPosition);

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

      <div className="relative h-96 w-full overflow-auto rounded-md border border-gray-300">
        <div className="grid h-full grid-cols-[repeat(13,minmax(0,1fr))] grid-rows-7 gap-1 p-1">
          {Array.from({ length: SLOTS_PER_PAGE }, (_, index) => {
            const position = (page - 1) * SLOTS_PER_PAGE + index + 1;
            const isSelected = selectedPosition === position;
            const occupant = assignments.get(position);
            const isOccupied = Boolean(occupant);
            const slotLabel =
              occupant?.title?.trim() ||
              (isOccupied ? "Occupied" : `Slot ${position}`);

            const previewUrl = occupant?.images?.[0] || null;
            const hasPreview = Boolean(previewUrl);

            const baseClasses =
              "relative flex h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border transition-colors";

            const variantClasses = isSelected
              ? "border-2 border-blue-400 shadow-[0_0_0_1px_rgba(59,130,246,0.4)]"
              : isOccupied
              ? "border-[#fdf053]/70 bg-[#433231] hover:border-[#fdf053]"
              : "border-gray-300 bg-transparent hover:bg-gray-100";

            return (
              <div
                key={position}
                className={`${baseClasses} ${variantClasses}`}
                onClick={() => handlePositionClick(position)}
                title={slotLabel}
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
                  className={`pointer-events-none absolute left-1 top-1 text-[9px] font-semibold ${
                    hasPreview ? "text-white drop-shadow" : "text-gray-300"
                  }`}
                >
                  #{position}
                </span>
                <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center px-1 text-center">
                  {isOccupied ? (
                    <>
                      <span
                        className={`truncate text-[11px] font-semibold leading-tight ${
                          isSelected ? "text-blue-200" : "text-[#FFF3DF]"
                        }`}
                      >
                        {occupant?.title || "Occupied"}
                      </span>
                      {occupant?.page && (
                        <span className="mt-1 text-[9px] uppercase tracking-wide text-gray-200">
                          Page {occupant.page}
                        </span>
                      )}
                    </>
                  ) : (
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? "text-blue-600" : "text-gray-400"
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

export default ProjectPosition;
