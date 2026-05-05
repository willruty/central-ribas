import { createContext, useContext, useLayoutEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export type Density = "comfortable" | "compact";

interface DensityContextValue {
  density: Density;
  setDensity: (d: Density) => void;
}

const DensityContext = createContext<DensityContextValue>({
  density: "comfortable",
  setDensity: () => {},
});

export function DensityProvider({ children }: { children: React.ReactNode }) {
  const [density, setDensity] = useLocalStorage<Density>("gr:density", "comfortable");

  // Apply synchronously before paint to avoid flash
  useLayoutEffect(() => {
    if (density === "compact") {
      document.documentElement.setAttribute("data-density", "compact");
    } else {
      document.documentElement.removeAttribute("data-density");
    }
  }, [density]);

  return (
    <DensityContext.Provider value={{ density, setDensity }}>
      {children}
    </DensityContext.Provider>
  );
}

export function useDensity() {
  return useContext(DensityContext);
}
