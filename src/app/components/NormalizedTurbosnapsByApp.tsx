"use client";

import { api } from "~/trpc/react";
import { BaseChart } from "./BaseChart";
import * as Plot from "@observablehq/plot";

export const NormalizedTurbosnapsByApp = () => {
  const query = api.build.snapshotsByApp.useQuery();
  let options = undefined;
  if (query.data) {
    options = {
      color: { scheme: "RdBu" },
      marginLeft: 130,
      marks: [
        Plot.barX(
          query.data,
          Plot.stackX(
            { offset: "normalize" },
            {
              y: "appName",
              x: "value",
              fill: "type",
            },
          ),
        ),
      ],
      title: "Normalized Turbosnaps By App",
      y: { label: "App Name" },
      x: { label: "% of Snapshots" },
    } satisfies Plot.PlotOptions;
  }
  return <BaseChart className="col-span-1" options={options} />;
};
