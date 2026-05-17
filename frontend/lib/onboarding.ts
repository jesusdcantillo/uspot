export type ExplorationMode = "authenticated" | "guest";

export type OnboardingStep = "landing" | "location" | "context";

export type CountryOption = {
  code: string;
  name: string;
  flagLabel: string;
  cities: string[];
};

export type ContextType = "CITY" | "UNIVERSITY" | "MALL";

export type OnboardingContext = {
  id: number;
  name: string;
  type: ContextType;
  description: string;
  imageSrc: string;
};

export type StoredOnboardingState = {
  selectedCountry: string | null;
  selectedCity: string | null;
  selectedContext: OnboardingContext | null;
  explorationMode: ExplorationMode | null;
  hasCompletedOnboarding: boolean;
};

export const ONBOARDING_STORAGE_KEY = "uspot:onboarding";

export const COUNTRIES: CountryOption[] = [
  {
    code: "CO",
    name: "Colombia",
    flagLabel: "CO",
    cities: ["Barranquilla", "Bogotá"],
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

export const FALLBACK_CONTEXTS: OnboardingContext[] = [
  {
    id: 1,
    name: "Universidad de la Costa",
    type: "UNIVERSITY",
    description: CONTEXT_TYPE_DESCRIPTIONS.UNIVERSITY,
    imageSrc: CONTEXT_TYPE_IMAGES.UNIVERSITY,
  },
  {
    id: 2,
    name: "Portal del Prado",
    type: "MALL",
    description: CONTEXT_TYPE_DESCRIPTIONS.MALL,
    imageSrc: CONTEXT_TYPE_IMAGES.MALL,
  },
  {
    id: 3,
    name: "Barranquilla Centro",
    type: "CITY",
    description: CONTEXT_TYPE_DESCRIPTIONS.CITY,
    imageSrc: CONTEXT_TYPE_IMAGES.CITY,
  },
];

export const CONTEXT_DISPLAY_ORDER: ContextType[] = [
  "UNIVERSITY",
  "MALL",
  "CITY",
];

export const INITIAL_ONBOARDING_STATE: StoredOnboardingState = {
  selectedCountry: null,
  selectedCity: null,
  selectedContext: null,
  explorationMode: null,
  hasCompletedOnboarding: false,
};

export function getCountryByName(name: string): CountryOption | undefined {
  return COUNTRIES.find((country) => country.name === name);
}

export function getCityOptions(countryName: string | null): string[] {
  const country = countryName ? getCountryByName(countryName) : undefined;

  return country?.cities ?? [];
}

export function hasActiveAuthSession(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return Object.keys(window.localStorage).some((key) => {
    return key.includes("auth-token") || key.startsWith("sb-");
  });
}
