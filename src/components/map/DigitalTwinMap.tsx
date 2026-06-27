import { useEffect, useRef } from "react";
import type { FeatureCollection, Feature } from "geojson";
import maplibregl from "maplibre-gl";
import type { Map as MLMap, GeoJSONSource } from "maplibre-gl";
import { CLIMATE_DATA, getStateById } from "@/lib/climateData";
import { useClimateStore } from "@/hooks/useClimateStore";
import {
  colorFor,
  getVariableValue,
  VARIABLE_META,
} from "@/lib/computeClimate";
import AnimatedParticles from "./AnimatedParticles";
import SatelliteOrbit from "./SatelliteOrbit";
import MapLegend from "./MapLegend";

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

type StateFeatureProps = {
  name: string;
  value: number;
  fill: string;
  stateId: string;
};

export default function DigitalTwinMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const { activeVariable, scenario, targetYear, selectedStateId, setSelectedState } =
    useClimateStore();

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [80.5, 22.5],
      zoom: 3.7,
      attributionControl: false,
      maxBounds: [
        [60, 0],
        [100, 40],
      ],
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", async () => {
      const res = await fetch("/india-states.geojson");
      const geo = await res.json();

      // Attach computed properties per feature
      const enriched = enrichGeoJSON(geo);
      map.addSource("india-states", { type: "geojson", data: enriched });

      map.addLayer({
        id: "states-fill",
        type: "fill",
        source: "india-states",
        paint: {
          "fill-color": ["coalesce", ["get", "fill"], "#1a2740"],
          "fill-opacity": 0.78,
        },
      });
      map.addLayer({
        id: "states-outline",
        type: "line",
        source: "india-states",
        paint: {
          "line-color": "#00f5ff",
          "line-width": 0.6,
          "line-opacity": 0.55,
        },
      });
      map.addLayer({
        id: "states-hover",
        type: "line",
        source: "india-states",
        paint: {
          "line-color": "#00f5ff",
          "line-width": 2.4,
          "line-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0,
          ],
        },
      });
      map.addLayer({
        id: "states-selected",
        type: "line",
        source: "india-states",
        paint: {
          "line-color": "#fbbf24",
          "line-width": 2.6,
          "line-opacity": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            1,
            0,
          ],
        },
      });

      let hoveredId: number | string | null = null;
      map.on("mousemove", "states-fill", (e) => {
        if (!e.features?.length) return;
        const f = e.features[0];
        const props = f.properties as StateFeatureProps;
        map.getCanvas().style.cursor = "pointer";
        if (hoveredId !== null) {
          map.setFeatureState({ source: "india-states", id: hoveredId }, { hover: false });
        }
        hoveredId = f.id as number | string;
        map.setFeatureState({ source: "india-states", id: hoveredId }, { hover: true });

        const sd = getStateById(props.stateId);
        if (popupRef.current) popupRef.current.remove();
        popupRef.current = new maplibregl.Popup({ closeButton: false, offset: 12 })
          .setLngLat(e.lngLat)
          .setHTML(
            `<div style="min-width:200px">
              <div style="font-family:'Space Mono';font-size:10px;letter-spacing:.12em;color:#7a9bb5;text-transform:uppercase">${sd?.zone ?? ""}</div>
              <div style="font-size:15px;font-weight:600;color:#e2f0ff;margin-top:2px">${props.name}</div>
              <div style="margin-top:8px;display:flex;align-items:baseline;gap:6px">
                <span style="font-family:'Space Mono';font-size:22px;color:#00f5ff;font-weight:700">${props.value.toFixed(1)}</span>
                <span style="color:#7a9bb5;font-size:11px">${VARIABLE_META[useClimateStore.getState().activeVariable].unit}</span>
              </div>
              <div style="margin-top:8px;font-size:10px;color:#7a9bb5;font-family:'Space Mono'">${sd?.dataSources.slice(0,3).join(" \u00b7 ") ?? ""}</div>
            </div>`,
          )
          .addTo(map);
      });
      map.on("mouseleave", "states-fill", () => {
        if (hoveredId !== null) {
          map.setFeatureState({ source: "india-states", id: hoveredId }, { hover: false });
          hoveredId = null;
        }
        map.getCanvas().style.cursor = "";
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      });
      map.on("click", "states-fill", (e) => {
        if (!e.features?.length) return;
        const props = e.features[0].properties as StateFeatureProps;
        setSelectedState(props.stateId);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [setSelectedState]);

  // Re-enrich when variable / scenario / year change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const src = map.getSource("india-states") as GeoJSONSource | undefined;
      if (!src) return;
      fetch("/india-states.geojson")
        .then((r) => r.json())
        .then((geo) => {
          src.setData(enrichGeoJSON(geo));
        });
    };
    if (map.isStyleLoaded() && map.getSource("india-states")) {
      apply();
    } else {
      map.once("load", apply);
    }
  }, [activeVariable, scenario, targetYear]);

  // Update selected feature state
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedStateId) return;
    const onIdle = () => {
      const feats = map.querySourceFeatures("india-states");
      feats.forEach((f) => {
        if (f.id == null) return;
        const props = f.properties as StateFeatureProps;
        map.setFeatureState(
          { source: "india-states", id: f.id },
          { selected: props.stateId === selectedStateId },
        );
      });
    };
    if (map.isStyleLoaded() && map.getSource("india-states")) onIdle();
    else map.once("idle", onIdle);
  }, [selectedStateId]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl glass-card">
      <div ref={containerRef} className="absolute inset-0" />
      <AnimatedParticles mapRef={mapRef} />
      <SatelliteOrbit />
      <MapLegend />
      <div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-md border border-twin-border bg-twin-dark/70 px-2.5 py-1.5 font-mono text-[10px] tracking-wider text-twin-muted backdrop-blur">
        <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-twin-teal align-middle" />
        DATA AS OF {new Date().toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit" })} IST
      </div>
    </div>
  );
}

function enrichGeoJSON(geo: GeoJSON.FeatureCollection) {
  const v = useClimateStore.getState().activeVariable;
  const s = useClimateStore.getState().scenario;
  const y = useClimateStore.getState().targetYear;
  const features = geo.features.map((f, idx) => {
    const name = (f.properties as { name?: string })?.name ?? "";
    const stateData =
      CLIMATE_DATA.find((sd) => sd.geoName === name) ??
      CLIMATE_DATA.find((sd) => sd.name === name);
    let value = 0;
    let fill = "#1a2740";
    if (stateData) {
      value = getVariableValue(stateData, v, y, s);
      fill = colorFor(v, value);
    }
    return {
      ...f,
      id: idx,
      properties: {
        name,
        value,
        fill,
        stateId: stateData?.id ?? "",
      },
    };
  });
  return { ...geo, features };
}
