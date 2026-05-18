"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useOnboarding } from "@/components/onboarding/onboarding-provider";
import { getContexts } from "@/lib/contexts";
import { getSpots, type Spot } from "@/lib/spots";
import type { OnboardingContext } from "@/lib/onboarding";
import { DashboardHeader } from "./header/dashboard-header";
import { DashboardSidebar } from "./sidebar/dashboard-sidebar";
import { DashboardSpotsBar } from "./spots/dashboard-spots-bar";
import { DashboardEmptyState } from "./spots/dashboard-empty-state";
import { DiscoverModal } from "./discover/discover-modal";
import { DashboardMobileNav } from "./sidebar/dashboard-mobile-nav";

const DashboardMap = dynamic(
  () => import("./map/dashboard-map").then((module) => module.DashboardMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[34rem] items-center justify-center rounded-[2rem] border border-white/70 bg-white/70 text-sm text-[#6a7080]">
        Cargando mapa contextual...
      </div>
    ),
  },
);

function isContextReady(context: OnboardingContext | null) {
  return Boolean(
    context &&
    context.latitude !== null &&
    context.longitude !== null &&
    context.zoom !== null &&
    context.latitude !== undefined &&
    context.longitude !== undefined &&
    context.zoom !== undefined,
  );
}

export function DashboardShell() {
  const router = useRouter();
  const {
    state,
    clearOnboarding,
    setSelectedCountry,
    setSelectedCity,
    setSelectedContext,
  } = useOnboarding();
  const [contexts, setContexts] = useState<OnboardingContext[]>([]);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loadingContexts, setLoadingContexts] = useState(true);
  const [loadingSpots, setLoadingSpots] = useState(true);
  const [discoverOpen, setDiscoverOpen] = useState(false);

  useEffect(() => {
    // consume session flag so onboarding auto-redirect only happens once
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("uspot:justCompletedOnboarding");
    }

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

      const items = await getContexts(state.selectedCityId ?? undefined);

      if (isMounted) {
        setContexts(items);
        setLoadingContexts(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [state.selectedCityId]);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      setLoadingSpots(true);

      if (!state.selectedContextId) {
        if (isMounted) {
          setSpots([]);
          setLoadingSpots(false);
        }

        return;
      }

      const items = await getSpots(state.selectedContextId ?? undefined);

      if (isMounted) {
        setSpots(items);
        setLoadingSpots(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [state.selectedContextId]);

  const selectedContext = useMemo(() => {
    return (
      contexts.find((context) => context.id === state.selectedContextId) ?? null
    );
  }, [contexts, state.selectedContextId]);

  const hasValidContext = isContextReady(selectedContext);
  const contextCountLabel = loadingContexts
    ? "Cargando contexto"
    : selectedContext
      ? `${spots.length} spots en el contexto`
      : "Sin contexto seleccionado";

  const handleDiscover = () => {
    setDiscoverOpen(true);
  };

  const handleResetSelection = () => {
    clearOnboarding();
    setDiscoverOpen(false);
    router.push("/");
  };

  const handleResetFlow = () => {
    clearOnboarding();
    setDiscoverOpen(false);

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("uspot:justCompletedOnboarding");
    }

    router.push("/?reset=1");
  };

  const handleCloseDiscover = () => {
    setDiscoverOpen(false);
  };

  const handleApplyDiscoverSelection = (selection: {
    country: string;
    cityId: number;
    cityName: string;
    contextId: number;
    contextName: string;
    contextType: "CITY" | "UNIVERSITY" | "MALL";
  }) => {
    setSelectedCountry(selection.country);
    setSelectedCity({ cityId: selection.cityId, cityName: selection.cityName });
    setSelectedContext({
      contextId: selection.contextId,
      contextName: selection.contextName,
      contextType: selection.contextType,
    });
    setDiscoverOpen(false);
  };

  if (
    !state.hasCompletedOnboarding ||
    !state.selectedCityId ||
    !state.selectedContextId
  ) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,74,198,0.08),_transparent_36%),linear-gradient(180deg,_#f7f9fb_0%,_#eef3fb_100%)] text-[#191c1e]">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-8">
          <DashboardEmptyState
            title="Todavía no hay una selección contextual activa"
            description="Vuelve al flujo de ciudad y contexto para cargar un dashboard real centrado en el espacio seleccionado."
            actionLabel="Crear primer spot"
            onAction={handleDiscover}
            disabled={false}
          />
        </div>

        {discoverOpen ? (
          <DiscoverModal
            open={discoverOpen}
            selectedCountry={state.selectedCountry}
            selectedCityId={state.selectedCityId}
            selectedContextId={state.selectedContextId}
            onClose={handleCloseDiscover}
            onRestartSelection={handleResetSelection}
            onApplySelection={handleApplyDiscoverSelection}
          />
        ) : null}
      </div>
    );
  }

  const canRenderDocument = typeof document !== "undefined";

  const emptySpotsOverlay =
    canRenderDocument && hasValidContext && !loadingSpots && spots.length === 0
      ? createPortal(
          <div className="fixed inset-0 z-[4000] flex items-center justify-center px-4">
            <button
              type="button"
              aria-label="Cerrar estado vacío"
              onClick={handleDiscover}
              className="absolute inset-0 cursor-default bg-[rgba(247,249,251,0.7)] backdrop-blur-[2px]"
            />

            <div className="relative z-10 max-w-md rounded-[2rem] border border-white/50 bg-white/90 p-6 text-center shadow-[0_24px_60px_rgba(37,99,235,0.14)] backdrop-blur-xl">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#6a7080]">
                Spots del contexto
              </p>
              <h2 className="mt-3 text-xl font-bold text-[#191c1e]">
                Aún no hay spots en este contexto
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#556070]">
                Sé el pionero en descubrir y marcar los mejores rincones de tu
                campus.
              </p>
              <button
                type="button"
                onClick={handleDiscover}
                className="mt-5 rounded-full bg-[#004ac6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
              >
                Sé el primero en compartir uno
              </button>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f9fb] text-[#191c1e]">
      <DashboardSidebar onDiscover={handleDiscover} />

      <div className="flex min-h-screen flex-col lg:pl-[18.5rem]">
        <DashboardHeader
          cityName={state.selectedCityName ?? "Ciudad"}
          contextName={
            selectedContext?.name ?? state.selectedContextName ?? "Contexto"
          }
          contextType={
            selectedContext?.type ?? state.selectedContextType ?? "CITY"
          }
          statusLabel={contextCountLabel}
          onDiscover={handleDiscover}
          onResetFlow={handleResetFlow}
        />

        <main className="relative h-screen w-full pt-28 lg:pt-32">
          {hasValidContext && selectedContext ? (
            <DashboardMap
              context={selectedContext}
              spots={spots}
              loading={loadingContexts || loadingSpots}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <DashboardEmptyState
                title="No se encontró un contexto real"
                description="La selección guardada no tiene coordenadas válidas. Vuelve a descubrir un contexto para centrar el mapa."
                actionLabel="Volver a descubrir"
                onAction={handleDiscover}
                disabled={false}
              />
            </div>
          )}

          {spots.length > 0 && selectedContext ? (
            <section className="fixed bottom-3 left-3 right-3 z-[1200] pointer-events-auto lg:left-[19.5rem] lg:right-6">
              <DashboardSpotsBar spots={spots} />
            </section>
          ) : null}
        </main>
      </div>

      <DashboardMobileNav
        contextName={
          selectedContext?.name ?? state.selectedContextName ?? "Contexto"
        }
        onDiscover={handleDiscover}
      />

      {discoverOpen ? (
        <DiscoverModal
          open={discoverOpen}
          selectedCountry={state.selectedCountry}
          selectedCityId={state.selectedCityId}
          selectedContextId={state.selectedContextId}
          onClose={handleCloseDiscover}
          onRestartSelection={handleResetSelection}
          onApplySelection={handleApplyDiscoverSelection}
        />
      ) : null}

      {emptySpotsOverlay}
    </div>
  );
}
