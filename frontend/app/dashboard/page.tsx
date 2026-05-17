"use client";

import { Suspense, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  OnboardingProvider,
  useOnboarding,
} from "@/components/onboarding/onboarding-provider";
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import { useSearchParams } from "next/navigation";

function DashboardShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useOnboarding();
  const { clearOnboarding } = useOnboarding();

  const mode =
    searchParams.get("mode") ?? state.explorationMode ?? "authenticated";

  const summary = useMemo(() => {
    return {
      cityId: state.selectedCityId ?? "Sin ciudad",
      cityName: state.selectedCityName ?? "Sin ciudad",
      contextId: state.selectedContextId ?? "Sin contexto",
      contextName: state.selectedContextName ?? "Sin contexto",
      contextType: state.selectedContextType ?? "Sin tipo",
    };
  }, [
    state.selectedCityId,
    state.selectedCityName,
    state.selectedContextId,
    state.selectedContextName,
    state.selectedContextType,
  ]);

  return (
    <OnboardingLayout>
      <section className="mx-auto w-full max-w-3xl rounded-[1.75rem] border border-white/70 bg-white/80 p-8 text-center shadow-[0_16px_48px_rgba(37,99,235,0.08)] backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#434655]">
          Navegación inicial
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#191c1e]">
          Onboarding completado
        </h1>
        <p className="mt-4 text-base leading-7 text-[#434655]">
          Esta pantalla es solo una parada mínima para validar el flujo. El
          mapa, spots y demás módulos siguen fuera de este alcance.
        </p>

        <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
          <div className="rounded-2xl bg-[#f7f9fb] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#434655]">
              Ciudad
            </p>
            <p className="mt-2 text-lg font-semibold text-[#191c1e]">
              {summary.cityName}
            </p>
          </div>
          <div className="rounded-2xl bg-[#f7f9fb] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#434655]">
              Ciudad ID
            </p>
            <p className="mt-2 text-lg font-semibold text-[#191c1e]">
              {summary.cityId}
            </p>
          </div>
          <div className="rounded-2xl bg-[#f7f9fb] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#434655]">
              Contexto
            </p>
            <p className="mt-2 text-lg font-semibold text-[#191c1e]">
              {summary.contextName}
            </p>
          </div>
        </div>

        <div className="mt-3 grid gap-3 text-left sm:grid-cols-2">
          <div className="rounded-2xl bg-[#f7f9fb] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#434655]">
              Contexto ID
            </p>
            <p className="mt-2 text-lg font-semibold text-[#191c1e]">
              {summary.contextId}
            </p>
          </div>
          <div className="rounded-2xl bg-[#f7f9fb] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#434655]">
              Tipo
            </p>
            <p className="mt-2 text-lg font-semibold text-[#191c1e]">
              {summary.contextType}
            </p>
          </div>
        </div>

        <div className="mt-8 inline-flex rounded-full bg-[#dbe1ff] px-4 py-2 text-sm font-semibold text-[#004ac6]">
          Estado de acceso: {mode === "guest" ? "Invitado" : "Autenticado"}
        </div>

        <p className="mt-4 text-sm text-[#434655]">
          La ciudad y el contexto seleccionados quedan persistidos en
          localStorage para reutilizarlos en el dashboard.
        </p>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => {
              clearOnboarding();
              router.replace("/");
            }}
            className="rounded-full border border-[#c3c6d7] bg-white px-4 py-2 text-sm font-semibold text-[#191c1e] transition hover:bg-[#f6f8ff]"
          >
            Reiniciar onboarding
          </button>
        </div>
      </section>
    </OnboardingLayout>
  );
}

export default function DashboardPage() {
  return (
    <OnboardingProvider>
      <Suspense fallback={null}>
        <DashboardShell />
      </Suspense>
    </OnboardingProvider>
  );
}
