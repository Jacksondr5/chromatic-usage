import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { chromaticApps } from "~/server/db/schema";

export const chromaticAppRouter = createTRPCRouter({
  add: publicProcedure
    .input(z.object({ id: z.string().min(1), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      console.log("input", input);
      await ctx.db.insert(chromaticApps).values({
        id: input.id,
        name: input.name,
      });
    }),
});
