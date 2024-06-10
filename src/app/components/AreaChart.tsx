"use client";

import { type EChartsType, init } from "echarts";
import { useState, useRef, useEffect } from "react";

const option = {
  title: {
    text: "Stacked Area Chart",
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
  legend: {
    data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
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
  series: [
    {
      name: "Email",
      type: "line",
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: "Union Ads",
      type: "line",
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: "Video Ads",
      type: "line",
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: "Direct",
      type: "line",
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: "Search Engine",
      type: "line",
      stack: "Total",
      label: {
        show: true,
        position: "top",
      },
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
  ],
};

export const AreaChart = () => {
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

    chart.setOption(option);
  }, [chart]);
  return <div className={"min-h-80 min-w-80"} ref={ref} role="figure" />;
};
