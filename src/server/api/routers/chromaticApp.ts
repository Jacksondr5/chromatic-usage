import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { chromaticApps } from "~/server/db/schema";

export const chromaticAppRouter = createTRPCRouter({
  add: publicProcedure
    .input(z.object({ id: z.string().min(1), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(chromaticApps).values({
        id: input.id,
        name: input.name,
      });
    }),
  delete: publicProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(chromaticApps).where(eq(chromaticApps.id, input));
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(chromaticApps);
  }),
});
