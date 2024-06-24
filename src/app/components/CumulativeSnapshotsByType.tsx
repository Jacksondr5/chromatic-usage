"use client";

import { api } from "~/trpc/react";
import { BaseChart } from "./BaseChart";
import * as Plot from "@observablehq/plot";

export const CumulativeSnapshotsByType = () => {
  const query = api.build.dailySnapshots.useQuery();
  let options = undefined;
  if (query.data) {
    options = {
      color: { scheme: "RdBu" },
      marks: [
        Plot.areaY(
          query.data,
          Plot.mapY("cumsum", {
            x: "date",
            y: "value",
            fill: "type",
            title: "type",
          }),
        ),
      ],
      title: "Cumulative Snapshots by Type",
      y: { label: "Total Snapshots" },
    } satisfies Plot.PlotOptions;
  }
  return <BaseChart options={options} />;
};
