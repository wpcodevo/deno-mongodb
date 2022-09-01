import { Application } from '../deps.ts';
import postRouter from './todo.routes.ts';

function init(app: Application) {
  app.use(postRouter.prefix('/api/posts/').routes());
}

export default {
  init,
};
