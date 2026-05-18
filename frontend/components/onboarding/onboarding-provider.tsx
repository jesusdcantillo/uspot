"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
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

function areOnboardingStatesEqual(
  left: StoredOnboardingState,
  right: StoredOnboardingState,
) {
  return (
    left.selectedCountry === right.selectedCountry &&
    left.selectedCityId === right.selectedCityId &&
    left.selectedCityName === right.selectedCityName &&
    left.selectedContextId === right.selectedContextId &&
    left.selectedContextName === right.selectedContextName &&
    left.selectedContextType === right.selectedContextType &&
    left.explorationMode === right.explorationMode &&
    left.hasCompletedOnboarding === right.hasCompletedOnboarding
  );
}

function readStoredState(): StoredOnboardingState {
  if (typeof window === "undefined") {
    return INITIAL_ONBOARDING_STATE;
  }

  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);

    if (!raw) return INITIAL_ONBOARDING_STATE;

    const parsed = JSON.parse(raw) as Partial<StoredOnboardingState>;

    return {
      selectedCountry:
        parsed.selectedCountry ?? INITIAL_ONBOARDING_STATE.selectedCountry,
      selectedCityId:
        parsed.selectedCityId ?? INITIAL_ONBOARDING_STATE.selectedCityId,
      selectedCityName:
        parsed.selectedCityName ?? INITIAL_ONBOARDING_STATE.selectedCityName,
      selectedContextId:
        parsed.selectedContextId ?? INITIAL_ONBOARDING_STATE.selectedContextId,
      selectedContextName:
        parsed.selectedContextName ??
        INITIAL_ONBOARDING_STATE.selectedContextName,
      selectedContextType:
        parsed.selectedContextType ??
        INITIAL_ONBOARDING_STATE.selectedContextType,
      explorationMode:
        parsed.explorationMode ?? INITIAL_ONBOARDING_STATE.explorationMode,
      hasCompletedOnboarding:
        parsed.hasCompletedOnboarding ??
        INITIAL_ONBOARDING_STATE.hasCompletedOnboarding,
    };
  } catch {
    return INITIAL_ONBOARDING_STATE;
  }
}

if (typeof window !== "undefined") {
  currentState = readStoredState();
}

function persistState(next: StoredOnboardingState) {
  if (typeof window === "undefined") return;

  if (areOnboardingStatesEqual(next, INITIAL_ONBOARDING_STATE)) {
    window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    return;
  }

  try {
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors silently
  }
}

function setStoredState(
  updater: (state: StoredOnboardingState) => StoredOnboardingState,
) {
  const next = updater(currentState);

  if (areOnboardingStatesEqual(currentState, next)) return;

  currentState = next;
  persistState(currentState);
  listeners.forEach((l) => l());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => listeners.delete(listener);
};

const getSnapshot = () => currentState;

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const setSelectedCountry = useCallback((country: string) => {
    setStoredState((current) => ({
      ...current,
      selectedCountry: country,
      selectedCityId: null,
      selectedCityName: null,
      selectedContextId: null,
      selectedContextName: null,
      selectedContextType: null,
    }));
  }, []);

  const setSelectedCity = useCallback((city: CitySelection | null) => {
    setStoredState((current) => ({
      ...current,
      selectedCityId: city?.cityId ?? null,
      selectedCityName: city?.cityName ?? null,
      selectedContextId: null,
      selectedContextName: null,
      selectedContextType: null,
    }));
  }, []);

  const setSelectedContext = useCallback((context: ContextSelection | null) => {
    setStoredState((current) => ({
      ...current,
      selectedContextId: context?.contextId ?? null,
      selectedContextName: context?.contextName ?? null,
      selectedContextType: context?.contextType ?? null,
    }));
  }, []);

  const setExplorationMode = useCallback((mode: ExplorationMode) => {
    setStoredState((current) => ({ ...current, explorationMode: mode }));
  }, []);

  const completeOnboarding = useCallback((mode: ExplorationMode) => {
    setStoredState((current) => ({
      ...current,
      explorationMode: mode,
      hasCompletedOnboarding: true,
    }));
  }, []);

  const clearOnboarding = useCallback(() => {
    setStoredState(() => INITIAL_ONBOARDING_STATE);
  }, []);

  const value = useMemo(
    () => ({
      setSelectedCountry,
      setSelectedCity,
      setSelectedContext,
      setExplorationMode,
      completeOnboarding,
      clearOnboarding,
    }),
    [
      setSelectedCity,
      setSelectedContext,
      setSelectedCountry,
      setExplorationMode,
      completeOnboarding,
      clearOnboarding,
    ],
  );

  return (
    <OnboardingStoreContext.Provider value={value}>
      {children}
    </OnboardingStoreContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const context = useContext(OnboardingStoreContext);

  if (!context) {
    throw new Error("useOnboarding debe usarse dentro de OnboardingProvider");
  }

  return {
    state: useSyncExternalStore(
      subscribe,
      getSnapshot,
      () => INITIAL_ONBOARDING_STATE,
    ),
    ...context,
  };
}
