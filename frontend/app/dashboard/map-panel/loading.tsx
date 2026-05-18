import { MapLoadingState } from "@/components/dashboard/loading/map-loading-state";

export default function Loading() {
  return (
    <div className="h-screen w-screen bg-[#f7f9fb] p-3">
      <MapLoadingState />
    </div>
  );
}
