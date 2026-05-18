export type ExplorationMode = "authenticated" | "guest";

export type OnboardingStep = "landing" | "location" | "context";

export type CountryOption = {
  code: string;
  name: string;
  flagLabel: string;
};

export type ContextType = "CITY" | "UNIVERSITY" | "MALL";

export type ContextSelection = {
  contextId: number;
  contextName: string;
  contextType: ContextType;
};

export type CitySelection = {
  cityId: number;
  cityName: string;
};

export type OnboardingContext = {
  id: number;
  name: string;
  type: ContextType;
  description: string;
  imageSrc: string;
  latitude?: number | null;
  longitude?: number | null;
  zoom?: number | null;
};

export type StoredOnboardingState = {
  selectedCountry: string | null;
  selectedCityId: number | null;
  selectedCityName: string | null;
  selectedContextId: number | null;
  selectedContextName: string | null;
  selectedContextType: ContextType | null;
  explorationMode: ExplorationMode | null;
  hasCompletedOnboarding: boolean;
};

export const ONBOARDING_STORAGE_KEY = "uspot:onboarding";

export const COUNTRIES: CountryOption[] = [
  {
    code: "CO",
    name: "Colombia",
    flagLabel: "CO",
  },
];

export const CONTEXT_TYPE_LABELS: Record<ContextType, string> = {
  CITY: "Ciudad",
  UNIVERSITY: "Universidades",
  MALL: "Centros comerciales",
};

export const CONTEXT_TYPE_DESCRIPTIONS: Record<ContextType, string> = {
  CITY: "Explora espacios urbanos, barrios y puntos de interés locales.",
  UNIVERSITY:
    "Descubre facultades, bibliotecas, zonas de estudio y vida estudiantil.",
  MALL: "Encuentra tiendas, restaurantes y zonas de encuentro interiores.",
};

export const CONTEXT_TYPE_IMAGES: Record<ContextType, string> = {
  CITY: "/images/cards-onboarding/city.webp",
  UNIVERSITY: "/images/cards-onboarding/university.webp",
  MALL: "/images/cards-onboarding/mall.webp",
};

export const CONTEXT_DISPLAY_ORDER: ContextType[] = [
  "UNIVERSITY",
  "MALL",
  "CITY",
];

export const INITIAL_ONBOARDING_STATE: StoredOnboardingState = {
  selectedCountry: null,
  selectedCityId: null,
  selectedCityName: null,
  selectedContextId: null,
  selectedContextName: null,
  selectedContextType: null,
  explorationMode: null,
  hasCompletedOnboarding: false,
};

export function getCountryByName(name: string): CountryOption | undefined {
  return COUNTRIES.find((country) => country.name === name);
}

export function hasActiveAuthSession(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return Object.keys(window.localStorage).some((key) => {
    return key.includes("auth-token") || key.startsWith("sb-");
  });
}
