"use client";

import { api } from "~/trpc/react";
import { BaseChart } from "./BaseChart";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

// TODO: can we restrict "value" to be a keyof T that is a number?

type KeysMatching<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

function pie<T>(
  data: T[],
  { value, ...options }: Plot.GeoOptions & { value: KeysMatching<T, number> },
) {
  const cs = d3.cumsum(data, (d) => d[value] as number);
  console.log(data);
  console.log(cs);
  const total = cs[cs.length - 1];
  if (!total) return Plot.text("No data");
  const r = 360 / total;
  for (let i = 0; i < cs.length; ++i) cs[i] *= r;
  console.log(cs);
  for (const d of data)
    return Plot.geo(
      {
        type: "GeometryCollection",
        geometries: data.map((d, i) => {
          const a = -(cs[i - 1] ?? 0);
          const b = -(cs[i] ?? 0);
          return {
            type: "Polygon",
            ...d,
            coordinates: [
              [
                [0, 90],
                [a, 0],
                [(2 * a + b) / 3, 0], // add intermediate points for sectors larger than a half-circle
                [(a + 2 * b) / 3, 0],
                [b, 0],
                [0, 90],
              ],
            ],
          };
        }),
      },
      { ...options },
    );
}

export const NormalizedTurbosnapsByApp = () => {
  const query = api.build.snapshotsByApp.useQuery();
  let options = undefined;
  if (query.data) {
    // const data = d3
    //   .rollups(
    //     query.data,
    //     (x) => x.reduce((prev, cur) => prev + cur.value, 0),
    //     (x) => x.type,
    //   )
    //   .map(([type, value]) => ({ type, value }));
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
