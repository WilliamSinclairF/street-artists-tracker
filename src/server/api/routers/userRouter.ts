import { createTRPCRouter, protectedProcedure } from '@sat/server/api/trpc';

export const userRouter = createTRPCRouter({
  getCurrentUserWithProfileAndPastAttendedEvents: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        profile: true,
        attendedEvents: {
          include: { event: { include: { attendees: true } } },
          where: { event: { date: { lte: new Date() } } },
        },
      },
    })
  ),
});
