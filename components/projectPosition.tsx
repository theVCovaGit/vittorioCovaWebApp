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
  /** Override slots per page (e.g. 4 for art). Default 91. */
  slotsPerPage?: number;
  /** Grid columns (derived from slotsPerPage if not set). */
  gridColumns?: number;
  /** Grid rows (derived from slotsPerPage if not set). */
  gridRows?: number;
}

const DEFAULT_SLOTS_PER_PAGE = 91;
const DEFAULT_GRID_COLUMNS = 13;
const DEFAULT_GRID_ROWS = 7;
const HORIZONTAL_BUFFER = 4;
const VERTICAL_BUFFER = 1;

const ProjectPosition = ({
  onPositionSelect,
  currentPosition = 1,
  currentPage = 1,
  onPageChange,
  projects = [],
  slotsPerPage: slotsPerPageProp,
  gridColumns: gridColumnsProp,
  gridRows: gridRowsProp,
}: ProjectPositionProps) => {
  const slotsPerPage = slotsPerPageProp ?? DEFAULT_SLOTS_PER_PAGE;
  const gridColumns = gridColumnsProp ?? (slotsPerPage === 4 ? 2 : DEFAULT_GRID_COLUMNS);
  const gridRows = gridRowsProp ?? (slotsPerPage === 4 ? 2 : DEFAULT_GRID_ROWS);
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

  const blockedPositions = useMemo(() => {
    const blocked = new Set<number>();

    pageAssignments.forEach((project, positionKey) => {
      if (typeof positionKey !== "number") return;

      const positionIndex = positionKey - 1;
      const baseRow = Math.floor(positionIndex / gridColumns);
      const baseCol = positionIndex % gridColumns;

      for (let rowOffset = -VERTICAL_BUFFER; rowOffset <= VERTICAL_BUFFER; rowOffset++) {
        const targetRow = baseRow + rowOffset;
        if (targetRow < 0 || targetRow >= gridRows) continue;

        for (let colOffset = -HORIZONTAL_BUFFER; colOffset <= HORIZONTAL_BUFFER; colOffset++) {
          const targetCol = baseCol + colOffset;
          if (targetCol < 0 || targetCol >= gridColumns) continue;

          const targetPosition = targetRow * gridColumns + targetCol + 1;
          if (targetPosition === positionKey) continue;

          blocked.add(targetPosition);
        }
      }
    });

    // Only block edge columns when we have a large grid (e.g. 13 columns)
    if (gridColumns > 2) {
      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridColumns; col++) {
          const isEdgeColumn = col === 0 || col === gridColumns - 1;
          if (isEdgeColumn) {
            const edgePosition = (page - 1) * slotsPerPage + row * gridColumns + col + 1;
            if (!pageAssignments.has(edgePosition)) {
              blocked.add(edgePosition);
            }
          }
        }
      }
    }

    return blocked;
  }, [pageAssignments, page, gridColumns, gridRows, slotsPerPage]);

  useEffect(() => {
    setSelectedPosition(currentPosition);
  }, [currentPosition]);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const handlePositionClick = (position: number) => {
    // Allow clicking on blocked positions - gray styling is just a visual indicator
    setSelectedPosition(position);
    onPositionSelect?.(position);
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

      <div className="relative h-96 w-full overflow-auto rounded-md border border-gray-300">
        <div
          className="grid h-full gap-1 p-1"
          style={{
            gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: slotsPerPage }, (_, index) => {
            const position = (page - 1) * slotsPerPage + index + 1;
            const occupant = pageAssignments.get(position);
            const isOccupied = Boolean(occupant);
            const isBlocked =
              !isOccupied && blockedPositions.has(position);
            const isAvailable = !isOccupied && !isBlocked;
            const canSelect = !isOccupied; // Allow selecting blocked positions too
            const isSelected = canSelect && selectedPosition === position;
            const slotLabel =
              occupant?.title?.trim() ||
              (isOccupied
                ? "Occupied"
                : isBlocked
                ? "Not recommended"
                : isAvailable
                ? "Available"
                : `Slot ${position}`);

            const previewUrl = occupant?.images?.[0] || null;
            const hasPreview = Boolean(previewUrl);

            const baseClasses =
              "relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-md border transition-colors";

            const variantClasses = isSelected
              ? "cursor-pointer border-2 border-blue-400 shadow-[0_0_0_1px_rgba(59,130,246,0.4)]"
              : isOccupied
              ? "cursor-pointer border-[#fec776]/70 bg-[#433231] hover:border-[#fec776]"
              : isBlocked
              ? "cursor-pointer border-gray-500/60 bg-gray-500/30 text-gray-300 hover:border-gray-400 hover:bg-gray-500/40"
              : "cursor-pointer border-green-400/60 bg-green-500/20 hover:border-green-300 hover:bg-green-500/30";

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
                    isSelected
                      ? "text-blue-600"
                      : isAvailable
                      ? "text-green-200"
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

export default ProjectPosition;
