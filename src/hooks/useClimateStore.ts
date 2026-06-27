import { create } from "zustand";
import type { Scenario, VariableType } from "@/lib/computeClimate";

interface ClimateState {
  selectedStateId: string | null;
  activeVariable: VariableType;
  scenario: Scenario;
  targetYear: number;
  sidebarExpanded: boolean;
  alertsOpen: boolean;
  simPolicies: {
    renewable: number;
    forest: number;
    urbanGreen: number;
    agriculture: number;
    industrial: number;
    water: number;
  };
  setSelectedState: (id: string | null) => void;
  setVariable: (v: VariableType) => void;
  setScenario: (s: Scenario) => void;
  setYear: (y: number) => void;
  toggleSidebar: () => void;
  toggleAlerts: () => void;
  setPolicy: (key: keyof ClimateState["simPolicies"], value: number) => void;
}

export const useClimateStore = create<ClimateState>((set) => ({
  selectedStateId: "maharashtra",
  activeVariable: "temperature",
  scenario: "rcp45",
  targetYear: 2050,
  sidebarExpanded: false,
  alertsOpen: false,
  simPolicies: {
    renewable: 40,
    forest: 30,
    urbanGreen: 25,
    agriculture: 35,
    industrial: 30,
    water: 40,
  },
  setSelectedState: (id) => set({ selectedStateId: id }),
  setVariable: (v) => set({ activeVariable: v }),
  setScenario: (s) => set({ scenario: s }),
  setYear: (y) => set({ targetYear: y }),
  toggleSidebar: () => set((s) => ({ sidebarExpanded: !s.sidebarExpanded })),
  toggleAlerts: () => set((s) => ({ alertsOpen: !s.alertsOpen })),
  setPolicy: (key, value) =>
    set((s) => ({ simPolicies: { ...s.simPolicies, [key]: value } })),
}));
