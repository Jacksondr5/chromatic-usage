import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { builds, chromaticApps } from "~/server/db/schema";
import { type ChromaticCsv } from "~/server/parseChromaticCsv";
import {
  fillGroupByDate,
  fillGroupByDateAndApp,
} from "~/server/processGroupByDateData";

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
    const filledData = fillGroupByDateAndApp(
      // TODO: Make this more efficient by putting it in the SQL query
      dailyBuilds.map((x) => ({ ...x, appName: x.appName ?? "Unknown" })),
      { totalSnapshots: 0 },
    );
    const appNames = [...new Set(filledData.map((x) => x.appName))];
    const cumulativeSnapshots: Record<string, number> = {};
    appNames.forEach((appName) => {
      cumulativeSnapshots[appName] = 0;
    });
    return filledData.map((x) => {
      cumulativeSnapshots[x.appName]! += x.totalSnapshots;
      return {
        ...x,
        cumulativeSnapshots: cumulativeSnapshots[x.appName] ?? 0,
      };
    });
  }),

  dailySnapshots: publicProcedure.query(async ({ ctx }) => {
    const dateSql = sql<string>`date(date)`;
    const dailyBuilds = await ctx.db
      .select({
        date: dateSql,
        totalSnapshots: sql<number>`sum(totalSnapshots)`,
      })
      .from(builds)
      .groupBy(dateSql)
      .orderBy(asc(builds.date))
      .execute();
    let cumulativeSnapshots = 0;
    const res = fillGroupByDate(dailyBuilds, {
      totalSnapshots: 0,
    }).map((x) => ({
      ...x,
      cumulativeSnapshots: (cumulativeSnapshots += x.totalSnapshots),
    }));
    return res;
  }),
});
