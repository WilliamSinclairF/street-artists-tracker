import { createTRPCRouter, protectedProcedure } from '@sat/server/api/trpc';
import { z } from 'zod';

export const eventRouter = createTRPCRouter({
  createEvent: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        time: z.date(),
        description: z.string(),
        type: z.string(),
        title: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      return ctx.prisma.event.create({
        data: {
          creator: { connect: { id: user.id } },
          ...input,
        },
      });
    }),

  getEventsCreatedByCurrentUser: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.event.findMany({
      where: { creatorId: ctx.session.user.id },
      include: { attendees: { include: { event: false, user: { include: { profile: true } } } } },
      orderBy: { createdAt: 'desc' },
    })
  ),

  getEventsCurrentUserIsAttending: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.event.findMany({
      where: { attendees: { some: { userId: ctx.session.user.id } } },
      include: { attendees: { include: { user: { include: { profile: true } } } } },
      orderBy: { createdAt: 'desc' },
    })
  ),

  getEventsByDate: protectedProcedure.input(z.object({ date: z.date() })).query(({ ctx, input }) => {
    const dateWithNoTimeStamp = input.date.toISOString().split('T')[0];
    return ctx.prisma.event.findMany({
      where: { date: new Date(dateWithNoTimeStamp as string) },
      include: {
        attendees: { include: { user: { include: { profile: true } } } },
        creator: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }),

  getEventById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const event = await ctx.prisma.event.findUniqueOrThrow({
      where: { id: input.id },
      include: {
        attendees: { include: { user: { include: { profile: true } } } },
        creator: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return event;
  }),
});
