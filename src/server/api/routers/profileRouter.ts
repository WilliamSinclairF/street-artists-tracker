import { createTRPCRouter, protectedProcedure, publicProcedure } from '@sat/server/api/trpc';
import { z } from 'zod';

export const profileRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.profile.findMany();
  }),

  getOne: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.profile.findUnique({ where: { userId: ctx.session.user.id } });
  }),

  createOrUpdateProfile: protectedProcedure
    .input(
      z.object({
        isArtist: z.boolean().default(false),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const existingProfile = await ctx.prisma.profile.findUnique({ where: { userId: user.id } });

      if (existingProfile) {
        return ctx.prisma.profile.update({
          where: { userId: user.id },
          data: {
            ...input,
          },
        });
      } else {
        return ctx.prisma.profile.create({
          data: {
            user: { connect: { id: user.id } },
            firstName: '',
            lastName: '',
            description: '',
            ...input,
          },
        });
      }
    }),
});
