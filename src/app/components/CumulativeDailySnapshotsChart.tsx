"use client";

import { api } from "~/trpc/react";
import { BaseChart } from "./BaseChart";
import * as Plot from "@observablehq/plot";

export const CumulativeDailySnapshotsChart = () => {
  const query = api.build.dailySnapshotsByApp.useQuery();
  let options = undefined;
  if (query.data) {
    options = {
      marks: [
        Plot.areaY(query.data, {
          x: "date",
          y: "cumulativeSnapshots",
          fill: "appName",
          title: "appName",
        }),
      ],
      title: "Cumulative Daily Snapshots",
      y: { label: "Total Snapshots" },
    } satisfies Plot.PlotOptions;
  }
  return <BaseChart options={options} />;
  return <BaseChart />;
};
