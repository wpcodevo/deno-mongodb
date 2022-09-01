import { Router } from '../deps.ts';
import todoController from '../controllers/todo.controller.ts';
import { createTodoSchema, updateTodoSchema } from '../schema/todo.schema.ts'


const router = new Router();

router.get<string>('/', todoController.findAllTodosController);
router.post<string>(
  '/',
  validate(createTodoSchema),
  todoController.createTodoController
);
router.patch<string>(
  '/:todoId',
  validate(updateTodoSchema),
  todoController.updateTodoController
);
router.get<string>('/:todoId', todoController.findTodoController);
router.delete<string>('/:todoId', todoController.deleteTodoController);

export default router;
