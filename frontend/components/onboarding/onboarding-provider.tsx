"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  INITIAL_ONBOARDING_STATE,
  ONBOARDING_STORAGE_KEY,
  type ExplorationMode,
  type CitySelection,
  type ContextSelection,
  type StoredOnboardingState,
} from "@/lib/onboarding";

type OnboardingContextValue = {
  state: StoredOnboardingState;
  setSelectedCountry: (country: string) => void;
  setSelectedCity: (city: CitySelection | null) => void;
  setSelectedContext: (context: ContextSelection | null) => void;
  setExplorationMode: (mode: ExplorationMode) => void;
  completeOnboarding: (mode: ExplorationMode) => void;
  clearOnboarding: () => void;
};

const OnboardingStoreContext = createContext<Omit<
  OnboardingContextValue,
  "state"
> | null>(null);

let currentState: StoredOnboardingState = INITIAL_ONBOARDING_STATE;
const listeners = new Set<() => void>();

function isContextSelection(value: unknown): value is ContextSelection {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ContextSelection>;

  return (
    typeof candidate.contextId === "number" &&
    typeof candidate.contextName === "string" &&
    typeof candidate.contextType === "string"
  );
}

function isCitySelection(value: unknown): value is CitySelection {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<CitySelection>;

  return (
    typeof candidate.cityId === "number" &&
    typeof candidate.cityName === "string"
  );
}

function readStoredState(): StoredOnboardingState {
  if (typeof window === "undefined") {
    return INITIAL_ONBOARDING_STATE;
  }

  try {
    const rawState = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);

    if (!rawState) {
      return INITIAL_ONBOARDING_STATE;
    }

    const parsedState = JSON.parse(rawState) as unknown;

    const normalizedState: StoredOnboardingState = {
      ...INITIAL_ONBOARDING_STATE,
    };

    if (parsedState && typeof parsedState === "object") {
      const rawObject = parsedState as Record<string, unknown>;

      if (typeof rawObject.selectedCountry === "string") {
        normalizedState.selectedCountry = rawObject.selectedCountry;
      }

      if (isCitySelection(parsedState)) {
        normalizedState.selectedCityId = parsedState.cityId;
        normalizedState.selectedCityName = parsedState.cityName;
      } else {
        if (typeof rawObject.selectedCityId === "number") {
          normalizedState.selectedCityId = rawObject.selectedCityId;
        }

        if (typeof rawObject.selectedCityName === "string") {
          normalizedState.selectedCityName = rawObject.selectedCityName;
        } else if (typeof rawObject.selectedCity === "string") {
          normalizedState.selectedCityName = rawObject.selectedCity;
        }
      }

      if (isContextSelection(parsedState)) {
        normalizedState.selectedContextId = parsedState.contextId;
        normalizedState.selectedContextName = parsedState.contextName;
        normalizedState.selectedContextType = parsedState.contextType;
      } else {
        if (typeof rawObject.selectedContextId === "number") {
          normalizedState.selectedContextId = rawObject.selectedContextId;
        }

        if (typeof rawObject.selectedContextName === "string") {
          normalizedState.selectedContextName = rawObject.selectedContextName;
        }

        if (
          rawObject.selectedContextType === "CITY" ||
          rawObject.selectedContextType === "UNIVERSITY" ||
          rawObject.selectedContextType === "MALL"
        ) {
          normalizedState.selectedContextType = rawObject.selectedContextType;
        } else if (
          rawObject.selectedContext &&
          typeof rawObject.selectedContext === "object"
        ) {
          const nestedContext = rawObject.selectedContext as Record<
            string,
            unknown
          >;

          if (typeof nestedContext.contextId === "number") {
            normalizedState.selectedContextId = nestedContext.contextId;
          }

          if (typeof nestedContext.contextName === "string") {
            normalizedState.selectedContextName = nestedContext.contextName;
          }

          if (
            nestedContext.contextType === "CITY" ||
            nestedContext.contextType === "UNIVERSITY" ||
            nestedContext.contextType === "MALL"
          ) {
            normalizedState.selectedContextType = nestedContext.contextType;
          }
        }
      }

      if (
        rawObject.explorationMode === "authenticated" ||
        rawObject.explorationMode === "guest"
      ) {
        normalizedState.explorationMode = rawObject.explorationMode;
      }

      if (typeof rawObject.hasCompletedOnboarding === "boolean") {
        normalizedState.hasCompletedOnboarding =
          rawObject.hasCompletedOnboarding;
      }
    }

    return normalizedState;
  } catch {
    return INITIAL_ONBOARDING_STATE;
  }
}

if (typeof window !== "undefined") {
  currentState = readStoredState();
}

function setStoredState(
  updater: (state: StoredOnboardingState) => StoredOnboardingState,
) {
  currentState = updater(currentState);

  if (typeof window !== "undefined") {
    if (
      JSON.stringify(currentState) === JSON.stringify(INITIAL_ONBOARDING_STATE)
    ) {
      window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } else {
      window.localStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify(currentState),
      );
    }
  }

  listeners.forEach((listener) => listener());
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const value: Omit<OnboardingContextValue, "state"> = {
    setSelectedCountry: (country) => {
      setStoredState((current) => ({
        ...current,
        selectedCountry: country,
        selectedCityId: null,
        selectedCityName: null,
        selectedContextId: null,
        selectedContextName: null,
        selectedContextType: null,
      }));
    },
    setSelectedCity: (city) => {
      setStoredState((current) => ({
        ...current,
        selectedCityId: city?.cityId ?? null,
        selectedCityName: city?.cityName ?? null,
        selectedContextId: null,
        selectedContextName: null,
        selectedContextType: null,
      }));
    },
    setSelectedContext: (context) => {
      setStoredState((current) => ({
        ...current,
        selectedContextId: context?.contextId ?? null,
        selectedContextName: context?.contextName ?? null,
        selectedContextType: context?.contextType ?? null,
      }));
    },
    setExplorationMode: (mode) => {
      setStoredState((current) => ({
        ...current,
        explorationMode: mode,
      }));
    },
    completeOnboarding: (mode) => {
      setStoredState((current) => ({
        ...current,
        explorationMode: mode,
        hasCompletedOnboarding: true,
      }));
    },
    clearOnboarding: () => {
      setStoredState(() => INITIAL_ONBOARDING_STATE);
    },
  };

  return (
    <OnboardingStoreContext.Provider value={value}>
      {children}
    </OnboardingStoreContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingStoreContext);

  if (!context) {
    throw new Error("useOnboarding debe usarse dentro de OnboardingProvider");
  }

  return {
    state: useSyncExternalStore(
      (listener) => {
        listeners.add(listener);

        return () => {
          listeners.delete(listener);
        };
      },
      () => currentState,
      () => INITIAL_ONBOARDING_STATE,
    ),
    ...context,
  };
}
