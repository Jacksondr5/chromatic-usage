import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { builds } from "~/server/db/schema";
import { ChromaticBuild, ChromaticCsv } from "~/server/parseChromaticCsv";

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
      const chunks: ChromaticCsv[][] = [];
      for (let i = 0; i < input.length; i += chunkSize) {
        const chunk = input.slice(i, i + chunkSize);
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
});
