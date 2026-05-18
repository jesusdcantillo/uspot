"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  COUNTRIES,
  type OnboardingContext,
  type OnboardingStep,
  hasActiveAuthSession,
} from "@/lib/onboarding";
import { CitySelector } from "./city-selector";
import { CountrySelector } from "./country-selector";
import { LandingHero } from "./landing-hero";
import { LoginModal } from "./login-modal";
import { OnboardingLayout } from "./onboarding-layout";
import { ContextTypeGrid } from "./context-type-grid";
import { useOnboarding } from "./onboarding-provider";
import { getContexts } from "@/lib/contexts";
import { getCities, type CityRecord } from "@/lib/cities";

function getInitialStep(
  country: string | null,
  cityId: number | null,
  contextId: number | null,
): OnboardingStep {
  if (contextId) {
    return "context";
  }

  if (country || cityId) {
    return "location";
  }

  return "landing";
}

export function OnboardingFlow() {
  const router = useRouter();
  const {
    state,
    setSelectedCountry,
    setSelectedCity,
    setSelectedContext,
    setExplorationMode,
    completeOnboarding,
    clearOnboarding,
  } = useOnboarding();
  const searchParams = useSearchParams();
  const [manualStep, setManualStep] = useState<OnboardingStep | null>(null);
  const [cities, setCities] = useState<CityRecord[]>([]);
  const [contexts, setContexts] = useState<OnboardingContext[]>([]);
  const [loadingContexts, setLoadingContexts] = useState(true);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const step =
    manualStep ??
    getInitialStep(
      state.selectedCountry,
      state.selectedCityId,
      state.selectedContextId,
    );

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      setLoadingCities(true);
      const items = await getCities();

      if (isMounted) {
        setCities(items);
        setLoadingCities(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      setLoadingContexts(true);

      if (!state.selectedCityId) {
        if (isMounted) {
          setContexts([]);
          setLoadingContexts(false);
        }

        return;
      }

      try {
        const items = await getContexts(state.selectedCityId ?? undefined);

        if (isMounted) {
          setContexts(items);
          setLoadingContexts(false);
        }
      } catch {
        if (isMounted) {
          setContexts([]);
          setLoadingContexts(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [state.selectedCityId]);

  useEffect(() => {
    if (searchParams.get("reset") !== "1") {
      return;
    }

    clearOnboarding();

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("uspot:justCompletedOnboarding");
    }

    router.replace("/");
  }, [clearOnboarding, router, searchParams]);

  useEffect(() => {
    if (!state.hasCompletedOnboarding) {
      return;
    }

    if (typeof window !== "undefined") {
      const justCompleted = window.sessionStorage.getItem(
        "uspot:justCompletedOnboarding",
      );

      if (!justCompleted) {
        return;
      }

      // consume the flag and redirect once
      window.sessionStorage.removeItem("uspot:justCompletedOnboarding");

      router.replace(
        `/dashboard?mode=${state.explorationMode ?? "authenticated"}`,
      );
    }
  }, [router, state.explorationMode, state.hasCompletedOnboarding]);

  const selectedCountry = useMemo(() => {
    return (
      COUNTRIES.find((country) => country.name === state.selectedCountry) ??
      null
    );
  }, [state.selectedCountry]);

  const selectedContextId = state.selectedContextId;

  const goToLocationStep = (mode: "authenticated" | "guest") => {
    setExplorationMode(mode);
    setSelectedCountry("Colombia");
    setSelectedContext(null);
    setManualStep("location");
  };

  const handleStart = () => {
    goToLocationStep("authenticated");
  };

  const handleGuestExplore = () => {
    goToLocationStep("guest");
  };

  const handleLocationContinue = () => {
    setManualStep("context");
  };

  const handleContextContinue = () => {
    const nextMode = state.explorationMode ?? "authenticated";

    if (nextMode === "guest") {
      completeOnboarding("guest");
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("uspot:justCompletedOnboarding", "1");
      }
      router.push("/dashboard?mode=guest");
      return;
    }

    if (hasActiveAuthSession()) {
      completeOnboarding("authenticated");
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("uspot:justCompletedOnboarding", "1");
      }
      router.push("/dashboard?mode=authenticated");
      return;
    }

    setLoginModalOpen(true);
  };

  const handleContinueAsGuest = () => {
    completeOnboarding("guest");
    setLoginModalOpen(false);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("uspot:justCompletedOnboarding", "1");
    }
    router.push("/dashboard?mode=guest");
  };

  const action =
    step === "landing" ? (
      <button
        type="button"
        onClick={() => setLoginModalOpen(true)}
        className="rounded-full bg-[#004ac6] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,74,198,0.18)] transition hover:bg-[#2563eb]"
      >
        Iniciar sesión
      </button>
    ) : (
      <button
        type="button"
        onClick={() => setLoginModalOpen(true)}
        className="rounded-full border border-[#c3c6d7] bg-white px-4 py-2 text-sm font-semibold text-[#191c1e] transition hover:bg-[#f6f8ff]"
      >
        Iniciar sesión
      </button>
    );

  const footer =
    step === "landing" ? (
      <>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-start">
          <a href="#" className="transition hover:text-[#004ac6]">
            Privacidad
          </a>
          <a href="#" className="transition hover:text-[#004ac6]">
            Términos
          </a>
          <a href="#" className="transition hover:text-[#004ac6]">
            Soporte
          </a>
        </div>
        <p>© 2026 USpot.</p>
      </>
    ) : null;

  return (
    <OnboardingLayout action={action} footer={footer}>
      <div className="w-full">
        {step === "landing" ? (
          <LandingHero
            onStart={handleStart}
            onExploreGuest={handleGuestExplore}
          />
        ) : null}

        {step === "location" ? (
          <section className="mx-auto grid w-full max-w-5xl gap-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#434655]">
                Paso 1 de 2
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#191c1e] sm:text-5xl">
                ¿Dónde quieres explorar?
              </h1>
              <p className="mt-4 text-base leading-7 text-[#434655] sm:text-lg">
                Selecciona país y ciudad para continuar con el espacio.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <CountrySelector
                value={state.selectedCountry}
                onChange={(country) => {
                  setSelectedCountry(country);
                }}
              />
              <CitySelector
                selectedCountry={state.selectedCountry}
                selectedCityId={state.selectedCityId}
                cities={cities}
                onChange={(city) => {
                  setSelectedCity({ cityId: city.id, cityName: city.name });
                }}
              />
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleLocationContinue}
                disabled={!state.selectedCountry || !state.selectedCityId}
                className="inline-flex min-w-56 items-center justify-center rounded-2xl bg-[#004ac6] px-6 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,74,198,0.18)] transition hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:bg-[#c3c6d7]"
              >
                Continuar
              </button>
            </div>
          </section>
        ) : null}

        {step === "context" ? (
          <section className="mx-auto grid w-full max-w-6xl gap-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#434655]">
                Paso 2 de 2
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#191c1e] sm:text-5xl">
                ¿Qué espacio quieres explorar?
              </h1>
              <p className="mt-4 text-base leading-7 text-[#434655] sm:text-lg">
                Elige el espacio que mejor describe el lugar que vas a recorrer.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-[#434655]">
              <span className="rounded-full bg-white/80 px-4 py-2 font-semibold shadow-sm">
                País:{" "}
                {state.selectedCountry ?? selectedCountry?.name ?? "Colombia"}
              </span>
              <span className="rounded-full bg-white/80 px-4 py-2 font-semibold shadow-sm">
                Ciudad: {state.selectedCityName ?? "Sin seleccionar"}
              </span>
            </div>

            {loadingCities || loadingContexts ? (
              <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-6 text-center text-sm text-[#434655] shadow-[0_12px_40px_rgba(37,99,235,0.08)]">
                Cargando ciudades y espacios reales...
              </div>
            ) : contexts.length === 0 ? (
              <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-6 text-center text-sm text-[#434655] shadow-[0_12px_40px_rgba(37,99,235,0.08)]">
                No se pudieron cargar espacios reales desde la API.
              </div>
            ) : (
              <ContextTypeGrid
                contexts={contexts}
                selectedContextId={selectedContextId}
                onSelect={(context) => {
                  setSelectedContext({
                    contextId: context.id,
                    contextName: context.name,
                    contextType: context.type,
                  });
                }}
              />
            )}

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleContextContinue}
                disabled={!state.selectedContextId}
                className="inline-flex min-w-56 items-center justify-center rounded-2xl bg-[#004ac6] px-6 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,74,198,0.18)] transition hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:bg-[#c3c6d7]"
              >
                Comenzar
              </button>
            </div>
          </section>
        ) : null}
      </div>

      <LoginModal
        open={loginModalOpen}
        onClose={handleContinueAsGuest}
        onContinueAsGuest={handleContinueAsGuest}
      />
    </OnboardingLayout>
  );
}
