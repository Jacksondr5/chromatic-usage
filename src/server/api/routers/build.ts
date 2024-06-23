import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { builds, chromaticApps } from "~/server/db/schema";
import { type ChromaticCsv } from "~/server/parseChromaticCsv";

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
    const res = await ctx.db
      .select({
        appName: chromaticApps.name,
        date: dateSql,
        chromeSnapshots: sql<number>`sum(chromeSnapshots)`,
        firefoxSnapshots: sql<number>`sum(firefoxSnapshots)`,
        safariSnapshots: sql<number>`sum(safariSnapshots)`,
        edgeSnapshots: sql<number>`sum(edgeSnapshots)`,
        internetExplorerSnapshots: sql<number>`sum(internetExplorerSnapshots)`,
        totalSnapshots: sql<number>`sum(totalSnapshots)`,
      })
      .from(builds)
      .leftJoin(chromaticApps, eq(builds.appId, chromaticApps.id))
      .groupBy((x) => [x.appName, dateSql])
      .orderBy(desc(builds.date))
      .execute();
    return res;
  }),
});
