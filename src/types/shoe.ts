// Core type definitions for shoes, categories, and specs.
// Used by: asics.json (data), shoe-utils.ts (access), all shoe components.
// CategoryId/SubcategoryId must stay in sync with categories.ts definitions.

export type CategoryId = 'daily' | 'super-trainer' | 'racing';

export type SubcategoryId =
  // Daily
  | 'entry'
  | 'max-cushion'
  | 'stability'
  | 'all-rounder'
  | 'lightweight'
  // Super Trainer
  | 'no-plate'
  | 'light-plate'
  | 'carbon-plate'
  // Racing
  | 'half'
  | 'full';

export interface Category {
  id: CategoryId;
  name: string;
  nameKo: string;
  description: string;
  color: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: SubcategoryId;
  name: string;
  nameKo: string;
  description: string;
  categoryId: CategoryId;
}

export interface ShoeSpecs {
  weight: number; // grams
  drop: number; // mm
  cushioning: number; // 1-10
  responsiveness: number; // 1-10
  stability: number; // 1-10
  durability: number; // 1-10
  stackHeight: {
    heel: number;
    forefoot: number;
  };
}

export interface RunningShoe {
  id: string;
  brandId: string;
  name: string;
  nameKo: string;
  categoryId: CategoryId;
  subcategoryId: SubcategoryId;
  price: number;
  priceFormatted: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  specs: ShoeSpecs;
  pros: string[];
  cons: string[];
  bestFor: string[];
  technologies: string[];
  releaseYear: number;
  colorways: string[];
  slug: string;
  isUpcoming?: boolean;
  upcomingNote?: string;
}

export interface Brand {
  id: string;
  name: string;
  nameKo: string;
  logo: string;
  color: string;
  description: string;
}
