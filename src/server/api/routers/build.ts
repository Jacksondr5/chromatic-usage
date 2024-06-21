import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { builds } from "~/server/db/schema";

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
          skippedSnapshots: z.number().optional(),
          chromeSnapshots: z.number().optional(),
          firefoxSnapshots: z.number().optional(),
          safariSnapshots: z.number().optional(),
          edgeSnapshots: z.number().optional(),
          internetExplorerSnapshots: z.number().optional(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(builds).values(
        input.map((x) => ({
          ...x,
          //TODO: figure out how to store date
          date: 0,
          id: x.appId,
        })),
      );
    }),

  clear: publicProcedure.mutation(async ({ ctx }) => {
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    await ctx.db.delete(builds).execute();
  }),
});
