"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  OnboardingProvider,
  useOnboarding,
} from "@/components/onboarding/onboarding-provider";
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";

function DashboardShell() {
  const router = useRouter();
  const { state } = useOnboarding();
  const { clearOnboarding } = useOnboarding();

  const mode = state.explorationMode ?? "authenticated";

  const summary = useMemo(() => {
    return {
      country: state.selectedCountry ?? "Colombia",
      city: state.selectedCity ?? "Sin ciudad",
      context: state.selectedContext?.name ?? "Sin contexto",
    };
  }, [state.selectedCity, state.selectedContext?.name, state.selectedCountry]);

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
              País
            </p>
            <p className="mt-2 text-lg font-semibold text-[#191c1e]">
              {summary.country}
            </p>
          </div>
          <div className="rounded-2xl bg-[#f7f9fb] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#434655]">
              Ciudad
            </p>
            <p className="mt-2 text-lg font-semibold text-[#191c1e]">
              {summary.city}
            </p>
          </div>
          <div className="rounded-2xl bg-[#f7f9fb] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#434655]">
              Contexto
            </p>
            <p className="mt-2 text-lg font-semibold text-[#191c1e]">
              {summary.context}
            </p>
          </div>
        </div>

        <div className="mt-8 inline-flex rounded-full bg-[#dbe1ff] px-4 py-2 text-sm font-semibold text-[#004ac6]">
          Estado de acceso: {mode === "guest" ? "Invitado" : "Autenticado"}
        </div>

        <p className="mt-4 text-sm text-[#434655]">
          El onboarding quedó persistido en localStorage y sobrevivirá
          refreshes.
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
      <DashboardShell />
    </OnboardingProvider>
  );
}
