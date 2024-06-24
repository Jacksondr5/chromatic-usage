"use client";

import { api } from "~/trpc/react";
import { BaseChart } from "./BaseChart";
import * as Plot from "@observablehq/plot";

export const CumulativeSnapshotsByApp = () => {
  const query = api.build.dailySnapshotsByApp.useQuery();
  let options = undefined;
  if (query.data) {
    options = {
      marks: [
        Plot.areaY(
          query.data,
          Plot.mapY("cumsum", {
            x: "date",
            y: "totalSnapshots",
            fill: "appName",
            title: "appName",
          }),
        ),
      ],
      title: "Cumulative Snapshots by App",
      y: { label: "Total Snapshots" },
    } satisfies Plot.PlotOptions;
  }
  return <BaseChart options={options} />;
};
