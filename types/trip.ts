export type TripInput = {
  destination: string;
  origin?: string;
  budget: string;
  days: string;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type UnsplashImage = {
  id?: string; // BAGO
  url: string;
  thumbUrl: string;
  alt: string;
  credit: string;
  creditLink: string;
  downloadLocation?: string | null; // BAGO
};

export type TripResult = {
  title: string;
  summary: string;

  country: string;
  city: string;

  coordinates: Coordinates;

  bestSeason: string;

  estimatedDailyBudget: number;

  budgetFeasible: boolean;
  budgetNote: string;
  flightEstimate: string;

  heroImageQuery: string;

  galleryQueries: string[];

  itinerary: string[];

  tips: string[];

  heroImage?: UnsplashImage | null;
  galleryImages?: (UnsplashImage | null)[];
};