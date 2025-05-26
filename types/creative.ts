export type ArchitectureProject = {
    id: number;
    type: "architecture";
    title: string;
    description: string;
    location: string;
    images: string[];
    icon?: string;
  };
  
  export type ProductDesignItem = {
    id: number;
    type: "productDesign";
    title: string;
    description: string;
    category: string;
    material?: string;
    images: string[];
    icon?: string;
  };
  
  export type ArtProject = {
    id: number;
    type: "art";
    title: string;
    description: string;
    medium: string;
    year?: number;
    images: string[];
    icon?: string;
  };
  
  export type FilmProject = {
    id: number;
    type: "film";
    title: string;
    description: string;
    director?: string;
    releaseYear?: number;
    images: string[];
    icon?: string;
  };
  
  
    export interface CreativeProject {
      id: number;
      title: string;
      description: string;
      category: string;
      images: string[];
      icon?: string;
    }
  