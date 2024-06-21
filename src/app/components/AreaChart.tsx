"use client";

import { type EChartsType, init } from "echarts";
import { type ECBasicOption } from "echarts/types/dist/shared.js";
import { useState, useRef, useEffect } from "react";
import { ChromaticBuild } from "~/parseChromaticCsv";

const defaultOption = {
  title: {
    text: "Chromatic Usage",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985",
      },
    },
  },

  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
};

export interface AreaChartProps {
  data: ChromaticBuild[];
}

export const AreaChart = ({ data }: AreaChartProps) => {
  const [chart, setChart] = useState<EChartsType>();
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && !chart) {
      const initialisedChart = init(ref.current, undefined, {
        renderer: "svg",
      });
      setChart(initialisedChart);
    }
  }, [ref, chart]);
  useEffect(() => {
    if (chart) {
      const resizeChartOnScreenResize = () => {
        chart.resize();
      };
      window.addEventListener("resize", resizeChartOnScreenResize);
      return () => {
        window.removeEventListener("resize", resizeChartOnScreenResize);
      };
    }
    return undefined;
  }, [chart]);
  useEffect(() => {
    if (!chart) {
      return;
    }

    chart.setOption({
      ...defaultOption,
      legend: {
        data: data.map((x) => x.appName),
        series: data.map((x) => ({
          name: x.appName,
          type: "line",
          stack: "Total",
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: [120, 132, 101, 134, 90, 230, 210],
        })),
      },
    });
  }, [chart, data]);
  return <div className="h-96 w-2/3" ref={ref} role="figure" />;
};
