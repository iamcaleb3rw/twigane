import { Gauge } from "@/components/ui/gauge";

export function Gauge01() {
  return (
    <main className="flex flex-wrap items-center gap-6">
      <Gauge className="w-[160px] h-[160px]" value={90} primary={"#22c55e"} />
    </main>
  );
}
