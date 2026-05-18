"use client";

export function DashboardSidebarSkeleton() {
  return (
    <aside className="fixed left-4 top-4 z-30 hidden h-[calc(100vh-2rem)] w-64 flex-col rounded-xl border border-white/30 bg-white/80 px-4 pb-6 pt-6 shadow-[0_16px_40px_rgba(37,99,235,0.12)] backdrop-blur-xl lg:flex">
      <div className="mb-6 px-2">
        <div className="h-10 w-28 rounded-2xl uspot-skeleton" />
      </div>

      <nav className="flex-1 space-y-2" aria-hidden="true">
        <div className="h-12 rounded-xl uspot-skeleton" />
        <div className="h-12 rounded-xl uspot-skeleton" />
        <div className="h-12 rounded-xl uspot-skeleton" />
      </nav>

      <div className="mt-4 px-2">
        <div className="h-12 rounded-xl uspot-skeleton" />
      </div>
    </aside>
  );
}

export function DashboardHeaderSkeleton() {
  return (
    <header className="fixed left-4 right-4 top-4 z-40 lg:left-[19.5rem]">
      <div className="flex items-center justify-between rounded-full border border-white/30 bg-white/80 px-5 py-3 shadow-[0_10px_30px_rgba(37,99,235,0.1)] backdrop-blur-xl">
        <div className="min-w-0 flex-1">
          <div className="h-3 w-24 rounded-full uspot-skeleton" />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="h-4 w-44 rounded-full uspot-skeleton" />
            <div className="h-6 w-20 rounded-full uspot-skeleton" />
            <div className="h-6 w-28 rounded-full uspot-skeleton" />
          </div>
        </div>

        <div className="ml-4 h-10 w-32 rounded-full uspot-skeleton" />
      </div>
    </header>
  );
}

export function DashboardMapSkeleton() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_top_left,_rgba(0,74,198,0.14),_transparent_36%),linear-gradient(180deg,_rgba(255,255,255,0.92)_0%,_rgba(235,240,248,0.92)_100%)]">
      <div className="absolute left-5 top-5 flex gap-2">
        <div className="h-9 w-28 rounded-full uspot-skeleton" />
        <div className="h-9 w-20 rounded-full uspot-skeleton" />
      </div>

      <div className="absolute inset-0 opacity-35">
        <div className="absolute inset-x-0 top-[18%] h-px bg-white/70" />
        <div className="absolute inset-x-0 top-[36%] h-px bg-white/55" />
        <div className="absolute inset-x-0 top-[54%] h-px bg-white/45" />
        <div className="absolute inset-x-0 top-[72%] h-px bg-white/55" />
        <div className="absolute left-[18%] top-0 h-full w-px bg-white/60" />
        <div className="absolute left-[42%] top-0 h-full w-px bg-white/45" />
        <div className="absolute left-[66%] top-0 h-full w-px bg-white/60" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid place-items-center gap-3 rounded-[2rem] border border-white/70 bg-white/72 px-8 py-8 shadow-[0_20px_60px_rgba(37,99,235,0.1)] backdrop-blur-xl">
          <div className="h-14 w-14 rounded-2xl uspot-skeleton" />
          <div className="h-4 w-40 rounded-full uspot-skeleton" />
          <div className="h-3 w-64 rounded-full uspot-skeleton" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSpotCardSkeleton() {
  return (
    <article className="min-w-[18rem] max-w-[18rem] shrink-0 snap-start overflow-hidden rounded-xl border border-white/40 bg-white shadow-[0_16px_30px_rgba(37,99,235,0.1)]">
      <div className="relative h-36 overflow-hidden bg-[linear-gradient(135deg,_#dbe1ff,_#eef3fb)]">
        <div className="absolute left-3 top-3 h-6 w-24 rounded-full uspot-skeleton" />
      </div>

      <div className="space-y-3 p-3">
        <div className="h-5 w-40 rounded-full uspot-skeleton" />
        <div className="h-3 w-52 rounded-full uspot-skeleton" />
        <div className="flex items-center justify-between">
          <div className="h-3 w-28 rounded-full uspot-skeleton" />
          <div className="h-3 w-16 rounded-full uspot-skeleton" />
        </div>
      </div>
    </article>
  );
}

export function DashboardDiscoverModalSkeleton() {
  return (
    <div className="w-full max-w-5xl rounded-3xl border border-white/40 bg-[#f7f9fb]/92 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.26)] backdrop-blur-xl md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="h-8 w-72 rounded-full uspot-skeleton" />
          <div className="h-4 w-[28rem] max-w-full rounded-full uspot-skeleton" />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="h-10 w-40 rounded-xl uspot-skeleton" />
          <div className="h-10 w-44 rounded-xl uspot-skeleton" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        <div className="space-y-3 md:col-span-2">
          <div className="h-3 w-28 rounded-full uspot-skeleton" />
          <div className="grid grid-cols-1 gap-3">
            <div className="h-20 rounded-xl uspot-skeleton" />
            <div className="h-20 rounded-xl uspot-skeleton" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-3 w-32 rounded-full uspot-skeleton" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="h-24 rounded-xl uspot-skeleton" />
            <div className="h-24 rounded-xl uspot-skeleton" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-3 w-28 rounded-full uspot-skeleton" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="h-24 rounded-xl uspot-skeleton" />
            <div className="h-24 rounded-xl uspot-skeleton" />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        <div className="h-11 w-28 rounded-full uspot-skeleton" />
        <div className="h-11 w-36 rounded-full uspot-skeleton" />
        <div className="h-11 w-36 rounded-full uspot-skeleton" />
      </div>
    </div>
  );
}
