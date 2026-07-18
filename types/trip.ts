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
  id?: string;
  url: string;
  thumbUrl: string;
  alt: string;
  credit: string;
  creditLink: string;
  downloadLocation?: string | null;
};

export type ItineraryDay = {
  day: string;
  userCost: string;
  localCost: string;
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
  recommendedBudget?: string;
  flightEstimate: string;

  heroImageQuery: string;

  galleryQueries: string[];

  itinerary: ItineraryDay[];

  tips: string[];

  heroImage?: UnsplashImage | null;
  galleryImages?: (UnsplashImage | null)[];
};