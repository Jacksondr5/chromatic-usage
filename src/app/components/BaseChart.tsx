import * as Plot from "@observablehq/plot";
import { useRef, useEffect } from "react";
import { cn } from "~/lib/utils";

export type BaseChartProps = {
  className?: string;
  options?: Plot.PlotOptions;
};

export const BaseChart = ({ className, options }: BaseChartProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!options || !ref.current) return;
    const plot = Plot.plot({
      marginLeft: 50,
      marginTop: 30,
      ...options,
      color: { scheme: "turbo", legend: true, ...options.color },
      y: { grid: true, ...options.y },
    });
    ref.current.append(plot);
    return () => plot.remove();
  }, [options, ref]);
  return <div className={cn("mb-4", className)} ref={ref} role="figure" />;
};
