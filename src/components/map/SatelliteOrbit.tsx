import { Satellite } from "lucide-react";

export default function SatelliteOrbit() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[6] flex items-center justify-center">
      <div className="relative h-[520px] w-[520px]">
        <div
          className="absolute inset-0 rounded-full border border-twin-cyan/15"
          style={{
            borderStyle: "dashed",
            transform: "rotate(-12deg) scaleY(0.32)",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2"
          style={{
            animation: "orbit 18s linear infinite",
            transformOrigin: "center",
          }}
        >
          <div
            style={{ transform: "translateX(260px) scaleY(0.32) rotate(12deg)" }}
            className="flex items-center gap-2"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-twin-cyan/20 ring-1 ring-twin-cyan/60 backdrop-blur">
              <Satellite className="h-3.5 w-3.5 text-twin-cyan" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
