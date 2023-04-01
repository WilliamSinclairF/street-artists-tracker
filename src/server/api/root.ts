import { userRouter } from './routers/userRouter';
import { createTRPCRouter } from '@sat/server/api/trpc';
import { eventRouter } from '@sat/server/api/routers/eventRouter';
import { isArtistRouter } from './routers/isArtistRouter';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  eventRouter,
  userRouter,
  isArtistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
