import { createTRPCRouter, protectedProcedure, publicProcedure } from '@sat/server/api/trpc';
import { z } from 'zod';

export const isArtistRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.profile.findMany();
  }),
  create: protectedProcedure.input(z.object({
    isArtist: z.boolean(),
  })).mutation(async ({ctx, input}) => {
    const userId = ctx.session.user.id;
    const isArtistUpdate = await ctx.prisma.profile.create({
      data: {
        userId,
        isArtist: input.isArtist,
      }
    })

  })
});
