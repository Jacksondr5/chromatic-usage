import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { builds, chromaticApps } from "~/server/db/schema";
import { type ChromaticCsv } from "~/server/parseChromaticCsv";
import {
  fillGroupByDate,
  fillGroupByDateAndApp,
} from "~/server/processGroupByDateData";
import { merge } from "d3-array";

type ProcessedCsv = ChromaticCsv & {
  totalSnapshots: number;
};

export const buildRouter = createTRPCRouter({
  uploadBatch: publicProcedure
    .input(
      z.array(
        z.object({
          appId: z.string().min(1),
          buildId: z.string().min(1),
          date: z.string().min(1),
          repositorySlug: z.string().min(1),
          branch: z.string().min(1),
          buildNumber: z.number(),
          skippedSnapshots: z.number(),
          chromeSnapshots: z.number(),
          firefoxSnapshots: z.number(),
          safariSnapshots: z.number(),
          edgeSnapshots: z.number(),
          internetExplorerSnapshots: z.number(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      await ctx.db.delete(builds).execute();

      // Inserting too many at once causes issues
      const chunkSize = 100;
      const processedBuilds = input.map((x) => ({
        ...x,
        totalSnapshots:
          x.chromeSnapshots +
          x.firefoxSnapshots +
          x.safariSnapshots +
          x.edgeSnapshots +
          x.internetExplorerSnapshots,
      }));
      const chunks: ProcessedCsv[][] = [];
      for (let i = 0; i < processedBuilds.length; i += chunkSize) {
        const chunk = processedBuilds.slice(i, i + chunkSize);
        chunks.push(chunk);
      }
      for (const chunk of chunks) {
        await ctx.db.insert(builds).values(chunk).execute();
      }
    }),

  clear: publicProcedure.mutation(async ({ ctx }) => {
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    await ctx.db.delete(builds).execute();
  }),

  dailySnapshotsByApp: publicProcedure.query(async ({ ctx }) => {
    const dateSql = sql<string>`date(date)`;
    const dailyBuilds = await ctx.db
      .select({
        appName: chromaticApps.name,
        date: dateSql,
        totalSnapshots: sql<number>`sum(totalSnapshots)`,
      })
      .from(builds)
      .leftJoin(chromaticApps, eq(builds.appId, chromaticApps.id))
      .groupBy((x) => [x.appName, dateSql])
      .orderBy(asc(builds.date))
      .execute();
    return fillGroupByDateAndApp(
      // TODO: Make this more efficient by putting it in the SQL query
      dailyBuilds.map((x) => ({ ...x, appName: x.appName ?? "Unknown" })),
      { totalSnapshots: 0 },
    );
  }),

  dailySnapshots: publicProcedure.query(async ({ ctx }) => {
    const dateSql = sql<string>`date(date)`;
    const dailyBuilds = await ctx.db
      .select({
        date: dateSql,
        totalSnapshots: sql<number>`sum(totalSnapshots)`,
        skippedSnapshots: sql<number>`sum(skippedSnapshots)`,
      })
      .from(builds)
      .groupBy(dateSql)
      .orderBy(asc(builds.date))
      .execute();
    const thing = fillGroupByDate(dailyBuilds, {
      totalSnapshots: 0,
      skippedSnapshots: 0,
    }).map((x) => [
      { date: x.date, type: "Total Snapshots", value: x.totalSnapshots },
      { date: x.date, type: "Skipped Snapshots", value: x.skippedSnapshots },
    ]);
    return merge<{ date: Date; type: string; value: number }>(thing);
  }),

  snapshotsByApp: publicProcedure.query(async ({ ctx }) => {
    const totalSnapshotsByApp = await ctx.db
      .select({
        appName: chromaticApps.name,
        totalSnapshots: sql<number>`sum(totalSnapshots)`,
        skippedSnapshots: sql<number>`sum(skippedSnapshots)`,
      })
      .from(builds)
      .leftJoin(chromaticApps, eq(builds.appId, chromaticApps.id))
      .groupBy(builds.appId)
      .execute();
    const split = totalSnapshotsByApp.map((x) => [
      {
        appName: x.appName ?? "Unknown",
        type: "Skipped Snapshots",
        value: x.skippedSnapshots,
      },
      {
        appName: x.appName ?? "Unknown",
        type: "Total Snapshots",
        value: x.totalSnapshots,
      },
    ]);
    return merge<{ type: string; value: number; appName: string }>(split);
  }),
});
