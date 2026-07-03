export type TripInput = {
  destination: string;
  budget: string;
  days: string;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type TripResult = {
  title: string;
  summary: string;

  country: string;
  city: string;

  coordinates: Coordinates;

  bestSeason: string;

  estimatedDailyBudget: number;

  heroImageQuery: string;

  galleryQueries: string[];

  itinerary: string[];

  tips: string[];
};