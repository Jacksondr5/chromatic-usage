"use client";

import { api } from "~/trpc/react";
import { BaseChart } from "./BaseChart";
import * as Plot from "@observablehq/plot";

export const DailyNormalizedTurbosnaps = () => {
  const query = api.build.dailySnapshots.useQuery();
  let options = undefined;
  if (query.data) {
    options = {
      color: { scheme: "RdBu" },
      marks: [
        Plot.barY(
          query.data,
          Plot.stackY(
            { offset: "normalize" },
            {
              x: "date",
              y: "value",
              fill: "type",
            },
          ),
        ),
      ],
      title: "Daily Normalized Turbosnaps",
      x: { type: "band" },
      y: { label: "% of Snapshots" },
    } satisfies Plot.PlotOptions;
  }
  return <BaseChart options={options} />;
};
