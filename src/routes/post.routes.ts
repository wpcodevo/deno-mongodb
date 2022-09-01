import { Router } from '../deps.ts';
import postController from '../controllers/post.controller.ts';
import { createPostSchema, updatePostSchema } from '../schema/post.schema.ts';
import requireUser from '../middleware/requireUser.ts';
import validate from '../middleware/validate.ts';

const router = new Router();

router.use(requireUser);
router.get<string>('/', postController.findAllPostsController);
router.post<string>(
  '/',
  validate(createPostSchema),
  postController.createPostController
);
router.patch<string>(
  '/:postId',
  validate(updatePostSchema),
  postController.updatePostController
);
router.get<string>('/:postId', postController.findPostController);
router.delete<string>('/:postId', postController.deletePostController);

export default router;
