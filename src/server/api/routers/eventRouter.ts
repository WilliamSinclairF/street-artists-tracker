import { createTRPCRouter, protectedProcedure } from '@sat/server/api/trpc';
import { z } from 'zod';

export const eventRouter = createTRPCRouter({
  getEventsCreatedByCurrentUser: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.event.findMany({
      where: { creatorId: ctx.session.user.id },
      include: { attendees: { include: { event: false, user: { include: { profile: true } } } } },
    })
  ),

  getEventsCurrentUserIsAttending: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.event.findMany({
      where: { attendees: { some: { userId: ctx.session.user.id } } },
      include: { attendees: { include: { user: { include: { profile: true } } } } },
    })
  ),

  getEventsByDate: protectedProcedure.input(z.object({ date: z.date() })).query(({ ctx, input }) => {
    const dateWithNoTimeStamp = input.date.toISOString().split('T')[0];

    console.log(input.date.toISOString().split('T'));

    return ctx.prisma.event.findMany({
      where: { date: new Date(dateWithNoTimeStamp as string) },
      include: {
        attendees: { include: { user: { include: { profile: true } } } },
        creator: { include: { profile: true } },
      },
    });
  }),
});
