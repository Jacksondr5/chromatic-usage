"use client";

import { api } from "~/trpc/react";
import * as Plot from "@observablehq/plot";
import { BaseChart } from "./BaseChart";

export const DailySnapshotsByApp = () => {
  const query = api.build.dailySnapshotsByApp.useQuery();
  let options = undefined;
  if (query.data) {
    options = {
      marks: [
        Plot.barY(query.data, {
          x: "date",
          y: "totalSnapshots",
          fill: "appName",
          title: "appName",
        }),
      ],
      title: "Daily Snapshots By App",
      x: { type: "band" },
      y: { label: "Total Snapshots" },
    } satisfies Plot.PlotOptions;
  }
  return <BaseChart options={options} />;
};
