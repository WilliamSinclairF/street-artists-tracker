import { createTRPCRouter, protectedProcedure } from '@sat/server/api/trpc';

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
});
