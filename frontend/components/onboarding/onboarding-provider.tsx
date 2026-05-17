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
  type OnboardingContext,
  type StoredOnboardingState,
} from "@/lib/onboarding";

type OnboardingContextValue = {
  state: StoredOnboardingState;
  setSelectedCountry: (country: string) => void;
  setSelectedCity: (city: string) => void;
  setSelectedContext: (context: OnboardingContext | null) => void;
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

function readStoredState(): StoredOnboardingState {
  if (typeof window === "undefined") {
    return INITIAL_ONBOARDING_STATE;
  }

  try {
    const rawState = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);

    if (!rawState) {
      return INITIAL_ONBOARDING_STATE;
    }

    const parsedState = JSON.parse(rawState) as Partial<StoredOnboardingState>;

    return {
      ...INITIAL_ONBOARDING_STATE,
      ...parsedState,
    };
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
    window.localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      JSON.stringify(currentState),
    );
  }

  listeners.forEach((listener) => listener());
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const value: Omit<OnboardingContextValue, "state"> = {
    setSelectedCountry: (country) => {
      setStoredState((current) => ({
        ...current,
        selectedCountry: country,
        selectedCity: null,
        selectedContext: null,
      }));
    },
    setSelectedCity: (city) => {
      setStoredState((current) => ({
        ...current,
        selectedCity: city,
        selectedContext: null,
      }));
    },
    setSelectedContext: (context) => {
      setStoredState((current) => ({
        ...current,
        selectedContext: context,
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
