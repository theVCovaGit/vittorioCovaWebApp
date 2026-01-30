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

// Product Design
export type ProductDesignProject = CreativeProjectBase & {
  type: "productDesign";
  year?: number;
  country?: string;
  city?: string;
  material?: string;
  useCase?: string;
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
  year?: string;
  registration?: string;
  synapsis?: string;
  length?: string;
};


// 🧠 Union of all project types
export type CreativeProject =
  | ArchitectureProject
  | ProductDesignProject
  | ArtProject
  | FilmProject;
