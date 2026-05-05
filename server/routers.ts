import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { childrenRouter } from "./routers/children";
import { mealsRouter } from "./routers/meals";
import { symptomsRouter } from "./routers/symptoms";
import { premiumRouter } from "./routers/premium";
import { notificationsRouter } from "./routers/notifications";
import { appointmentsRouter } from "./routers/appointments";
import { dashboardRouter } from "./routers/dashboard";
import { timelineRouter } from "./routers/timeline";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  children: childrenRouter,
  meals: mealsRouter,
  symptoms: symptomsRouter,
  premium: premiumRouter,
  notifications: notificationsRouter,
  appointments: appointmentsRouter,
  dashboard: dashboardRouter,
  timeline: timelineRouter,
});

export type AppRouter = typeof appRouter;
