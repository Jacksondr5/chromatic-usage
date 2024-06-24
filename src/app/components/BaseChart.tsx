import * as Plot from "@observablehq/plot";
import { useRef, useEffect } from "react";

export type BaseChartProps = {
  options?: Plot.PlotOptions;
};

export const BaseChart = ({ options }: BaseChartProps) => {
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
  return <div className="h-96 w-1/3" ref={ref} role="figure" />;
};
