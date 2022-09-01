import type { RouterContext } from '../deps.ts';
import { Bson } from '../deps.ts';
import { Todo } from '../models/todo.model.ts';
import type {
  CreateTodoInput,
  UpdateTodoInput,
} from '../schema/todo.schema.ts';

const createTodoController = async ({
  request,
  response,
}: RouterContext<string>) => {
  try {
    const { title, content, status }: CreateTodoInput =
      await request.body().value;
    const totoExists = await Todo.findOne({ title });
    if (totoExists) {
      response.status = 409;
      response.body = {
        status: 'fail',
        message: 'Todo with that title already exists',
      };
      return;
    }

    const createdAt = new Date();
    const updatedAt = createdAt;

    const todoId: string | Bson.ObjectId = await Todo.insertOne({
      title,
      content,
      status,
      createdAt,
      updatedAt,
    });

    if (!todoId) {
      response.status = 500;
      response.body = { status: 'error', message: 'Error creating user' };
      return;
    }

    const todo = await Todo.findOne({_id: todoId})

    response.status = 201;
    response.body = {
      status: 'success',
      data: { todo },
    };
  } catch (error) {
    response.status = 500;
    response.body = { status: 'error', message: error.message };
    return;
  }
};

const updateTodoController = async ({
  params,
  request,
  response,
}: RouterContext<string>) => {
  try {
    const payload: UpdateTodoInput['body'] = await request.body().value;

    const updatedInfo = await Todo.updateOne(
      { _id: new Bson.ObjectId(params.todoId) },
      { $set: { ...payload, updatedAt: new Date() } },
      { ignoreUndefined: true }
    );

    if (!updatedInfo.matchedCount) {
      response.status = 404;
      response.body = {
        status: 'fail',
        message: 'No todo with that Id exists',
      };
      return;
    }

    const updatedTodo = await Todo.findOne({ _id: updatedInfo.upsertedId });

    response.status = 200;
    response.body = {
      status: 'success',
      data: { todo: updatedTodo },
    };
  } catch (error) {
    response.status = 500;
    response.body = { status: 'error', message: error.message };
    return;
  }
};

const findTodoController = async ({
  params,
  response,
}: RouterContext<string>) => {
  try {
    const todo = await Todo.findOne({ _id: new Bson.ObjectId(params.todoId) });

    if (!todo) {
      response.status = 404;
      response.body = {
        status: 'success',
        message: 'No todo with that Id exists',
      };
      return;
    }

    response.status = 200;
    response.body = {
      status: 'success',
      data: { todo },
    };
  } catch (error) {
    response.status = 500;
    response.body = { status: 'error', message: error.message };
    return;
  }
};

const findAllTodosController = async ({
  request,
  response,
}: RouterContext<string>) => {
  try {
    const page = request.url.searchParams.get('page');
    const limit = request.url.searchParams.get('limit');
    const intPage = page ? parseInt(page) : 1;
    const intLimit = limit ? parseInt(limit) : 10;
    const skip = (intPage - 1) * intLimit;
    const pipeline = [
      { $match: {} },
      {
        $skip: skip,
      },
      {
        $limit: intLimit,
      },
    ];

    const cursor = Todo.aggregate(pipeline);
    const cursorTodos = cursor.map((todo) => todo);
    const todos = await cursorTodos;

    response.status = 200;
    response.body = {
      status: 'success',
      results: todos.length,
      data: { todos },
    };
  } catch (error) {
    response.status = 500;
    response.body = { status: 'error', message: error.message };
    return;
  }
};

const deleteTodoController = async ({
  params,
  response,
}: RouterContext<string>) => {
  try {
    const numberOfTodo = await Todo.deleteOne({
      _id: new Bson.ObjectId(params.todoId),
    });

    if (!numberOfTodo) {
      response.status = 404;
      response.body = {
        status: 'success',
        message: 'No todo with that Id exists',
      };
      return;
    }

    response.status = 204;
  } catch (error) {
    response.status = 500;
    response.body = { status: 'error', message: error.message };
    return;
  }
};

export default {
  createTodoController,
  updateTodoController,
  findTodoController,
  findAllTodosController,
  deleteTodoController,
};
