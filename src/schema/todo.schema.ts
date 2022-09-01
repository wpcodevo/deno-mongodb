import { z } from '../deps.ts';

export const createTodoSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    content: z.string({
      required_error: 'Content is required',
    }),
    status: z.string({
      required_error: 'Status is required',
    }),
  }),
});

const params = {
  params: z.object({
    todoId: z.string(),
  }),
};

export const getTodoSchema = z.object({
  ...params,
});

export const updateTodoSchema = z.object({
  ...params,
  body: z
    .object({
      title: z.string(),
      content: z.string(),
      status: z.string(),
    })
    .partial(),
});

export const deleteTodoSchema = z.object({
  ...params,
});

export type CreateTodoInput = z.TypeOf<typeof createTodoSchema>['body'];
export type GetTodoInput = z.TypeOf<typeof getTodoSchema>['params'];
export type UpdateTodoInput = z.TypeOf<typeof updateTodoSchema>;
export type DeleteTodoInput = z.TypeOf<typeof deleteTodoSchema>['params'];
