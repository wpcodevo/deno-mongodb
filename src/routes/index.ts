import { Application } from '../deps.ts';
import authRouter from './auth.routes.ts';
import userRouter from './user.routes.ts';
import postRouter from './post.routes.ts';

function init(app: Application) {
  app.use(authRouter.prefix('/api/auth/').routes());
  app.use(userRouter.prefix('/api/users/').routes());
  app.use(postRouter.prefix('/api/posts/').routes());
}

export default {
  init,
};
