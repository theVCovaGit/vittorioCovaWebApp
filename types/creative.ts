// Shared base type (common to all projects)
export interface CreativeProjectBase {
  id: number;
  type: "architecture" | "productDesign" | "art" | "film";
  title: string;
  images: string[];
  icon?: string;
}

// ✅ Architecture
export type ArchitectureProject = CreativeProjectBase & {
  type: "architecture";
  country: string;
  city: string;
  category: string;
  year?: number;
};

// ✅ Product Design
export type ProductDesignProject = CreativeProjectBase & {
  type: "productDesign";
  description: string;
  category: string;
  material?: string;
};

// Art
export type ArtProject = CreativeProjectBase & {
  type: "art";
  description: string;
  discipline: string;       // e.g., painting, sculpture
  collection: string;       // e.g., private, gallery, museum
  country: string;
  city: string;
  year?: number;
};


// Film
export type FilmProject = CreativeProjectBase & {
  type: "film";
  releaseYear?: number;
  countries?: string[];
  cities?: string[];
  genre?: string;
  category?: string; // e.g. "Short Film", "Full Film", etc.
};


// 🧠 Union of all project types
export type CreativeProject =
  | ArchitectureProject
  | ProductDesignProject
  | ArtProject
  | FilmProject;
