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

// ✅ Art
export type ArtProject = CreativeProjectBase & {
  type: "art";
  description: string;
  medium: string;
  year?: number;
};

// ✅ Film
export type FilmProject = CreativeProjectBase & {
  type: "film";
  description: string;
  director?: string;
  releaseYear?: number;
};

// 🧠 Union of all project types
export type CreativeProject =
  | ArchitectureProject
  | ProductDesignProject
  | ArtProject
  | FilmProject;
