"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "@/providers/session-provider";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/components/onboarding/onboarding-provider";
import { getContexts } from "@/lib/contexts";
import { getSpots, type Spot } from "@/lib/spots";
import type { OnboardingContext } from "@/lib/onboarding";
import { DashboardHeader } from "./header/dashboard-header";
import { DashboardSidebar } from "./sidebar/dashboard-sidebar";
import { AuthModal } from "@/components/onboarding/auth-modal";
import { CreateSpotModal } from "@/components/dashboard/create-spot-modal";
import { DashboardSpotsBar } from "./spots/dashboard-spots-bar";
import { DashboardEmptyState } from "./spots/dashboard-empty-state";
import { DiscoverModal } from "./discover/discover-modal";
import { DashboardMobileNav } from "./sidebar/dashboard-mobile-nav";
import { DashboardLoadingState } from "./loading/dashboard-loading-state";
import { SpotsLoadingState } from "./loading/spots-loading-state";
import { DashboardErrorBoundary } from "./error/dashboard-error-boundary";
import { DashboardErrorState } from "./error/dashboard-error-state";
import { SpotsErrorState } from "./error/spots-error-state";
import { DashboardMapLoader } from "./map/dashboard-map-loader";

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
  const session = useSession();
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
  const [contextsError, setContextsError] = useState<unknown>(null);
  const [spotsError, setSpotsError] = useState<unknown>(null);
  const [dashboardBoundaryKey, setDashboardBoundaryKey] = useState(0);
  const [mapBoundaryKey, setMapBoundaryKey] = useState(0);
  const [contextsRetryKey, setContextsRetryKey] = useState(0);
  const [spotsRetryKey, setSpotsRetryKey] = useState(0);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [createSpotOpen, setCreateSpotOpen] = useState(false);
  const [joinCommunityOpen, setJoinCommunityOpen] = useState(false);

  useEffect(() => {
    // consume session flag so onboarding auto-redirect only happens once
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("uspot:justCompletedOnboarding");
    }

    let isMounted = true;

    void (async () => {
      setLoadingContexts(true);
      setContextsError(null);

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
  }, [contextsRetryKey, state.selectedCityId]);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      setLoadingSpots(true);
      setSpotsError(null);

      if (!state.selectedContextId) {
        if (isMounted) {
          setSpots([]);
          setLoadingSpots(false);
        }

        return;
      }

      try {
        const items = await getSpots(state.selectedContextId ?? undefined);

        if (isMounted) {
          setSpots(items);
          setLoadingSpots(false);
        }
      } catch (error) {
        if (isMounted) {
          setSpots([]);
          setSpotsError(error);
          setLoadingSpots(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [spotsRetryKey, state.selectedContextId]);

  const selectedContext = useMemo(() => {
    return (
      contexts.find((context) => context.id === state.selectedContextId) ?? null
    );
  }, [contexts, state.selectedContextId]);

  const hasValidContext = isContextReady(selectedContext);
  const hasSpots = spots.length > 0;
  const isInitialDashboardLoading = loadingContexts && contexts.length === 0;
  const contextCountLabel = loadingContexts
    ? "Cargando espacio"
    : selectedContext
      ? `${spots.length} spots en el espacio`
      : "Sin espacio seleccionado";

  const handleDiscover = useCallback(() => {
    setDiscoverOpen(true);
  }, []);

  const handleCreateSpot = useCallback(() => {
    // open join community modal for guests, otherwise open create spot
    if (session.status === "guest") {
      setJoinCommunityOpen(true);
      return;
    }

    setCreateSpotOpen(true);
  }, [session.status]);

  const handleResetSelection = useCallback(() => {
    clearOnboarding();
    setDiscoverOpen(false);
    router.push("/");
  }, [clearOnboarding, router]);

  const handleResetFlow = useCallback(() => {
    clearOnboarding();
    setDiscoverOpen(false);

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("uspot:justCompletedOnboarding");
    }

    router.push("/?reset=1");
  }, [clearOnboarding, router]);

  const handleCloseDiscover = useCallback(() => {
    setDiscoverOpen(false);
  }, []);

  const handleRetryContexts = useCallback(() => {
    setContextsError(null);
    setContextsRetryKey((current) => current + 1);
  }, []);

  const handleRetrySpots = useCallback(() => {
    setSpotsError(null);
    setSpotsRetryKey((current) => current + 1);
  }, []);

  const handleRetryDashboard = useCallback(() => {
    setContextsError(null);
    setSpotsError(null);
    setContextsRetryKey((current) => current + 1);
    setSpotsRetryKey((current) => current + 1);
    setDashboardBoundaryKey((current) => current + 1);
    setMapBoundaryKey((current) => current + 1);
  }, []);

  const handleRetryMap = useCallback(() => {
    setMapBoundaryKey((current) => current + 1);
  }, []);

  const handleApplyDiscoverSelection = useCallback(
    (selection: {
      country: string;
      cityId: number;
      cityName: string;
      contextId: number;
      contextName: string;
      contextType: "CITY" | "UNIVERSITY" | "MALL";
    }) => {
      setSelectedCountry(selection.country);
      setSelectedCity({
        cityId: selection.cityId,
        cityName: selection.cityName,
      });
      setSelectedContext({
        contextId: selection.contextId,
        contextName: selection.contextName,
        contextType: selection.contextType,
      });
      setDiscoverOpen(false);
    },
    [setSelectedCity, setSelectedContext, setSelectedCountry],
  );

  if (
    !state.hasCompletedOnboarding ||
    !state.selectedCityId ||
    !state.selectedContextId
  ) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,74,198,0.08),_transparent_36%),linear-gradient(180deg,_#f7f9fb_0%,_#eef3fb_100%)] text-[#191c1e]">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-8">
          <DashboardEmptyState
            title="Todavía no hay una selección activa"
            description="Vuelve al flujo de ciudad y espacio para cargar un dashboard real centrado en el espacio seleccionado."
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

  if (isInitialDashboardLoading) {
    return <DashboardLoadingState />;
  }

  return (
    <DashboardErrorBoundary
      key={dashboardBoundaryKey}
      resetKey={dashboardBoundaryKey}
      onRetry={handleRetryDashboard}
    >
      <div className="relative min-h-screen overflow-hidden bg-[#f7f9fb] text-[#191c1e]">
        <DashboardSidebar
          onDiscover={handleDiscover}
          onCreateSpot={handleCreateSpot}
        />

        <div className="flex min-h-screen flex-col lg:pl-[18.5rem]">
          <DashboardHeader
            cityName={state.selectedCityName ?? "Ciudad"}
            contextName={
              selectedContext?.name ?? state.selectedContextName ?? "Espacio"
            }
            contextType={
              selectedContext?.type ?? state.selectedContextType ?? "CITY"
            }
            statusLabel={contextCountLabel}
            onResetFlow={handleResetFlow}
          />

          <main className="relative h-screen w-full pt-28 lg:pt-32">
            {contextsError ? (
              <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
                <DashboardErrorState
                  title="No pudimos cargar los contexts"
                  description="Revisa tu conexión e inténtalo nuevamente."
                  detail="La selección guardada sigue intacta y puedes intentar recuperar el espacio sin salir del dashboard."
                  actionLabel="Reintentar contexts"
                  onAction={handleRetryContexts}
                  className="w-full max-w-5xl"
                />
              </div>
            ) : hasValidContext && selectedContext ? (
              <>
                <div
                  className={`relative h-full w-full transition-opacity duration-200 ${
                    loadingSpots || !hasSpots || spotsError
                      ? "opacity-0 pointer-events-none"
                      : "opacity-100"
                  }`}
                >
                  <DashboardMapLoader
                    key={mapBoundaryKey}
                    context={selectedContext}
                    spots={spots}
                    loading={loadingContexts || loadingSpots}
                    retryKey={mapBoundaryKey}
                    onRetry={handleRetryMap}
                  />
                </div>

                {loadingSpots ? (
                  <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
                    <SpotsLoadingState className="w-full max-w-5xl" />
                  </div>
                ) : spotsError ? (
                  <div className="absolute inset-x-3 bottom-24 z-20 lg:bottom-3 lg:left-[19.5rem] lg:right-6">
                    <SpotsErrorState
                      error={spotsError}
                      onRetry={handleRetrySpots}
                    />
                  </div>
                ) : !hasSpots ? (
                  <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
                    <DashboardEmptyState
                      title="Aún no hay spots en este espacio"
                      description="Este espacio todavía no tiene spots publicados, sé el primero en empezar a poblar el mapa."
                      actionLabel="Sé el primero en compartir un spot"
                      onAction={handleDiscover}
                      disabled={false}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
                <DashboardEmptyState
                  title="No se encontró un espacio real"
                  description="La selección guardada no tiene coordenadas válidas. Vuelve a descubrir un espacio para centrar el mapa."
                  actionLabel="Volver a descubrir"
                  onAction={handleDiscover}
                  disabled={false}
                />
              </div>
            )}

            {spots.length > 0 && selectedContext && !spotsError ? (
              <section className="fixed bottom-24 left-3 right-3 z-30 pointer-events-auto lg:bottom-3 lg:left-[19.5rem] lg:right-6">
                <DashboardSpotsBar spots={spots} />
              </section>
            ) : null}
          </main>
        </div>

        <DashboardMobileNav onDiscover={handleDiscover} />

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

        {joinCommunityOpen ? (
          <AuthModal
            open={joinCommunityOpen}
            mode="login"
            onModeChange={() => undefined}
            onClose={() => setJoinCommunityOpen(false)}
            onContinueAsGuest={() => {
              setJoinCommunityOpen(false);
            }}
          />
        ) : null}

        {createSpotOpen ? (
          <CreateSpotModal
            open={createSpotOpen}
            onClose={() => setCreateSpotOpen(false)}
          />
        ) : null}
      </div>
    </DashboardErrorBoundary>
  );
}
