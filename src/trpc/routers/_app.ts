import { messagesRouter } from '@/modules/messages/server/procedures';
import { projectRouter } from '@/modules/projects/server/procedures';

import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  messages : messagesRouter,
  projects: projectRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;