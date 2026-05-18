"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { getCities, type CityRecord } from "@/lib/cities";
import { getContexts } from "@/lib/contexts";
import {
  CONTEXT_DISPLAY_ORDER,
  CONTEXT_TYPE_LABELS,
  COUNTRIES,
  type ContextType,
  type OnboardingContext,
} from "@/lib/onboarding";
import { DashboardDiscoverModalSkeleton } from "../loading/dashboard-skeletons";
import { DiscoverErrorState } from "../error/discover-error-state";

function getModalRoot() {
  if (typeof document === "undefined") {
    return null;
  }

  const rootId = "uspot-modal-root";
  let root = document.getElementById(rootId);

  if (!root) {
    root = document.createElement("div");
    root.id = rootId;
    document.body.appendChild(root);
  }

  return root;
}

type DiscoverSelection = {
  country: string;
  cityId: number;
  cityName: string;
  contextId: number;
  contextName: string;
  contextType: ContextType;
};

type DiscoverModalProps = {
  open: boolean;
  selectedCountry: string | null;
  selectedCityId: number | null;
  selectedContextId: number | null;
  onClose: () => void;
  onRestartSelection: () => void;
  onApplySelection: (selection: DiscoverSelection) => void;
};

export function DiscoverModal({
  open,
  selectedCountry,
  selectedCityId,
  selectedContextId,
  onClose,
  onRestartSelection,
  onApplySelection,
}: DiscoverModalProps) {
  const [country, setCountry] = useState<string>(
    selectedCountry ?? COUNTRIES[0]?.name ?? "Colombia",
  );
  const [cityId, setCityId] = useState<number | null>(selectedCityId);
  const [contextId, setContextId] = useState<number | null>(selectedContextId);
  const [cities, setCities] = useState<CityRecord[]>([]);
  const [contexts, setContexts] = useState<OnboardingContext[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingContexts, setLoadingContexts] = useState(false);
  const [contextsError, setContextsError] = useState<unknown>(null);
  const [contextsRetryKey, setContextsRetryKey] = useState(0);

  useEffect(() => {
    if (!open) {
      return;
    }

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
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let isMounted = true;

    void (async () => {
      setLoadingContexts(true);
      setContextsError(null);

      if (!cityId) {
        if (isMounted) {
          setContexts([]);
          setLoadingContexts(false);
        }

        return;
      }

      try {
        const items = await getContexts(cityId);

        if (isMounted) {
          setContexts(items);
          setLoadingContexts(false);
        }
      } catch (error) {
        if (isMounted) {
          setContexts([]);
          setContextsError(error);
          setLoadingContexts(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [cityId, contextsRetryKey, open]);

  const citiesForCountry = useMemo(() => {
    if (!country) {
      return cities;
    }

    return cities.filter((city) => {
      if (country === "Colombia") {
        return city.country === "COLOMBIA";
      }

      return city.country.toLowerCase() === country.toLowerCase();
    });
  }, [cities, country]);

  const groupedContexts = useMemo(() => {
    return CONTEXT_DISPLAY_ORDER.map((type) => ({
      type,
      contexts: contexts.filter((context) => context.type === type),
    }));
  }, [contexts]);

  const selectedCity = cities.find((city) => city.id === cityId) ?? null;
  const selectedContext =
    contexts.find((context) => context.id === contextId) ?? null;
  const showLoadingState = loadingCities || loadingContexts;

  const handleRetryContexts = useCallback(() => {
    setContextsError(null);
    setContextsRetryKey((current) => current + 1);
  }, []);

  const handleApply = useCallback(() => {
    if (!selectedCity || !selectedContext) return;

    onApplySelection({
      country,
      cityId: selectedCity.id,
      cityName: selectedCity.name,
      contextId: selectedContext.id,
      contextName: selectedContext.name,
      contextType: selectedContext.type,
    });
  }, [country, onApplySelection, selectedCity, selectedContext]);

  if (!open) {
    return null;
  }

  const portalRoot = getModalRoot();

  if (!portalRoot) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center px-4 py-6"
      style={{ zIndex: 2147483647 }}
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#0f172a]/32 backdrop-blur-[5px]"
      />

      <div className="relative z-10 w-full max-w-5xl rounded-3xl border border-white/40 bg-[#f7f9fb]/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.26)] backdrop-blur-xl md:p-8">
        {contextsError ? (
          <DiscoverErrorState
            error={contextsError}
            onRetry={handleRetryContexts}
          />
        ) : showLoadingState ? (
          <DashboardDiscoverModalSkeleton />
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold leading-tight text-[#191c1e] md:text-3xl">
                  ¿Qué espacio quieres explorar ahora?
                </h2>
                <p className="mt-1 text-sm text-[#556070] md:text-base">
                  Reelige país, ciudad y espacio sin salir del dashboard.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <select
                  value={country}
                  onChange={(event) => {
                    setCountry(event.target.value);
                    setCityId(null);
                    setContextId(null);
                  }}
                  className="rounded-xl border border-[#c3c6d7] bg-white px-3 py-2 text-sm font-medium text-[#191c1e]"
                >
                  {COUNTRIES.map((option) => (
                    <option key={option.code} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>

                <select
                  value={cityId ?? ""}
                  onChange={(event) => {
                    const nextCityId = Number(event.target.value);

                    if (!Number.isNaN(nextCityId)) {
                      setCityId(nextCityId);
                      setContextId(null);
                    }
                  }}
                  disabled={loadingCities || citiesForCountry.length === 0}
                  className="rounded-xl border border-[#c3c6d7] bg-white px-3 py-2 text-sm font-medium text-[#191c1e] disabled:cursor-not-allowed disabled:bg-[#edf1f6]"
                >
                  <option value="" disabled>
                    {loadingCities
                      ? "Cargando ciudades..."
                      : "Selecciona ciudad"}
                  </option>
                  {citiesForCountry.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              {groupedContexts.map((group) => (
                <section
                  key={group.type}
                  className={
                    group.type === "CITY" ? "md:col-span-2" : undefined
                  }
                >
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#737686]">
                    {CONTEXT_TYPE_LABELS[group.type]}
                  </h3>

                  {loadingContexts ? (
                    <div className="rounded-xl border border-white bg-white p-3 text-sm text-[#556070] shadow-sm">
                      Cargando espacios...
                    </div>
                  ) : group.contexts.length === 0 ? (
                    <div className="rounded-xl border border-white bg-white p-3 text-sm text-[#556070] shadow-sm">
                      Sin espacios disponibles para este tipo.
                    </div>
                  ) : (
                    <div
                      className={
                        group.type === "CITY"
                          ? "grid grid-cols-1 gap-3"
                          : "grid grid-cols-1 gap-3 sm:grid-cols-2"
                      }
                    >
                      {group.contexts.map((context) => {
                        const selected = context.id === contextId;

                        return (
                          <button
                            key={context.id}
                            type="button"
                            onClick={() => setContextId(context.id)}
                            className={`rounded-xl border bg-white p-3 text-left shadow-sm transition ${
                              selected
                                ? "border-[#004ac6] ring-2 ring-[#004ac6]/15"
                                : "border-white hover:border-[#c3c6d7]"
                            }`}
                          >
                            <p className="font-semibold text-[#191c1e]">
                              {context.name}
                            </p>
                            <p className="text-sm text-[#556070]">
                              {context.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-[#cfd6e6] bg-white px-5 py-2.5 text-sm font-semibold text-[#191c1e] transition hover:bg-[#f7f9fb]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!selectedCity || !selectedContext}
                className="rounded-full bg-[#004ac6] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,74,198,0.18)] transition hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:bg-[#9ab4ea]"
              >
                Aplicar selección
              </button>
              <button
                type="button"
                onClick={onRestartSelection}
                className="rounded-full border border-[#cfd6e6] bg-white px-5 py-2.5 text-sm font-semibold text-[#191c1e] transition hover:bg-[#f7f9fb]"
              >
                Reiniciar desde cero
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    portalRoot,
  );
}
