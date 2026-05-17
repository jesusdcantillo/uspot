"use client";

import Image from "next/image";

type LandingHeroProps = {
  onStart: () => void;
  onExploreGuest: () => void;
};

const previewCards = [
  {
    title: "Campus Central",
    description: "Zona de estudio silenciosa con el mejor café del campus.",
    type: "campus" as const,
  },
  {
    title: "Spot Social",
    description: "Vibras de viernes en la terraza de la Facultad de Artes.",
    type: "social" as const,
  },
  {
    title: "Cerca de ti",
    description: null,
    type: "nearby" as const,
  },
];

export function LandingHero({
  onStart,
  onExploreGuest,
}: LandingHeroProps) {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#004ac6]/10 bg-white/70 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#004ac6] shadow-[0_8px_32px_rgba(37,99,235,0.08)] backdrop-blur">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#004ac6] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#004ac6]" />
        </span>
        En vivo ahora
      </div>

      <h1 className="mt-4 max-w-4xl text-[2.8rem] font-extrabold leading-tight tracking-tight text-[#191c1e] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.06]">
        Explora los mejores <span className="text-[#004ac6]">spots</span> a tu
        alrededor
      </h1>

      <p className="mt-3 max-w-2xl text-[0.95rem] leading-6 text-[#434655] sm:text-base">
        Descubre lugares dentro de ciudades, universidades y espacios sociales.
        Conecta con lo que está pasando ahora mismo en tu entorno.
      </p>

      <div className="mt-5 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center justify-center rounded-xl bg-[#004ac6] px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(37,99,235,0.2)] transition hover:scale-[0.98] hover:bg-[#2563eb]"
        >
          Comenzar
        </button>
        <button
          type="button"
          onClick={onExploreGuest}
          className="inline-flex items-center justify-center rounded-xl border-[1.5px] border-[#c3c6d7] bg-white/80 px-7 py-3 text-sm font-semibold text-[#434655] shadow-[0_8px_24px_rgba(25,28,30,0.04)] transition hover:bg-[#f2f4f6]"
        >
          Explorar como invitado
        </button>
      </div>

      <div className="mt-7 grid w-full gap-4 lg:grid-cols-3">
        {previewCards.map((card) => {
          if (card.type === "social") {
            return (
              <article
                key={card.title}
                className="overflow-hidden rounded-[1rem] border border-white/60 bg-white/70 p-3.5 text-left shadow-[0_8px_32px_rgba(37,99,235,0.08)] backdrop-blur lg:translate-y-4"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-lg bg-[#dc2c4f]/15 px-2.5 py-1.5 text-[0.8rem] font-semibold text-[#dc2c4f]">
                    Spot Social
                  </div>
                </div>
                <div className="relative mb-2.5 h-28 overflow-hidden rounded-lg">
                  <Image
                    src="/images/landing-hero/spot-social.webp"
                    alt="Spot Social"
                    fill
                    sizes="(max-width: 1024px) 100vw, 340px"
                    className="object-cover"
                  />
                </div>
                <p className="text-[0.9rem] leading-6 text-[#434655]">
                  {card.description}
                </p>
              </article>
            );
          }

          if (card.type === "nearby") {
            return (
              <article
                key={card.title}
                className="overflow-hidden rounded-[1rem] border border-white/60 bg-white/70 p-3.5 text-left shadow-[0_8px_32px_rgba(37,99,235,0.08)] backdrop-blur lg:rotate-2"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-lg bg-[#004ac6]/10 px-2.5 py-1.5 text-[0.8rem] font-semibold text-[#004ac6]">
                    Cerca de ti
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-2 text-[0.85rem]">
                    <span className="text-[#434655]">Auditorio A1</span>
                    <span className="font-semibold text-[#007d55]">Libre</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-2 text-[0.85rem]">
                    <span className="text-[#434655]">Biblioteca Norte</span>
                    <span className="font-semibold text-[#dc2c4f]">Lleno</span>
                  </div>
                </div>
              </article>
            );
          }

          return (
            <article
              key={card.title}
              className="overflow-hidden rounded-[1rem] border border-white/60 bg-white/70 p-3.5 text-left shadow-[0_8px_32px_rgba(37,99,235,0.08)] backdrop-blur lg:-rotate-2"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#007d55]/15 text-[0.8rem] font-bold text-[#007d55]">
                  S
                </div>
                <h2 className="text-[0.9rem] font-semibold text-[#191c1e]">
                  {card.title}
                </h2>
              </div>
              <p className="text-[0.9rem] leading-6 text-[#434655]">
                {card.description}
              </p>
              <div className="mt-3 flex -space-x-2">
                <span className="h-6 w-6 rounded-full border-2 border-white bg-[#dbe1ff]" />
                <span className="h-6 w-6 rounded-full border-2 border-white bg-[#b4c5ff]" />
                <span className="h-6 w-6 rounded-full border-2 border-white bg-[#4edea3]" />
                <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#eceef0] text-[0.6rem] font-semibold text-[#434655]">
                  +12
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
