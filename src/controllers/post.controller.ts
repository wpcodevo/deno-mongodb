import type { RouterContext } from '../deps.ts';
import { Bson } from '../deps.ts';
import { Post } from '../models/post.model.ts';
import type {
  CreatePostInput,
  UpdatePostInput,
} from '../schema/post.schema.ts';

const createPostController = async ({
  state,
  request,
  response,
}: RouterContext<string>) => {
  try {
    const { title, category, content, image }: CreatePostInput =
      await request.body().value;
    const postExists = await Post.findOne({ title });
    if (postExists) {
      response.status = 409;
      response.body = {
        status: 'fail',
        message: 'Post with that title already exists',
      };
      return;
    }

    const createdAt = new Date();
    const updatedAt = createdAt;

    const postId: string | Bson.ObjectId = await Post.insertOne({
      title,
      content,
      category,
      user: new Bson.ObjectId(state.userId),
      image,
      createdAt,
      updatedAt,
    });

    if (!postId) {
      response.status = 500;
      response.body = { status: 'error', message: 'Error creating user' };
      return;
    }

    const pipeline = [
      { $match: { _id: postId } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {$unset: ["user.password", "user.verified","user.createdAt", "user.updatedAt"]}
    ];

    const posts = await Post.aggregate(pipeline).toArray();

    response.status = 201;
    response.body = {
      status: 'success',
       post: posts[0],
    };
  } catch (error) {
    response.status = 500;
    response.body = { status: 'error', message: error.message };
    return;
  }
};

const updatePostController = async ({
  params,
  request,
  response,
}: RouterContext<string>) => {
  try {
    const payload: UpdatePostInput['body'] = await request.body().value;

    const updatedInfo = await Post.updateOne(
      { _id: new Bson.ObjectId(params.postId) },
      { $set: { ...payload, updatedAt: new Date() } },
      { ignoreUndefined: true }
    );

    if (!updatedInfo.matchedCount) {
      response.status = 404;
      response.body = {
        status: 'fail',
        message: 'No post with that Id exists',
      };
      return;
    }

    const updatedPost = await Post.findOne({ _id: updatedInfo.upsertedId });

    response.status = 200;
    response.body = {
      status: 'success',
      post: updatedPost ,
    };
  } catch (error) {
    response.status = 500;
    response.body = { status: 'error', message: error.message };
    return;
  }
};

const findPostController = async ({
  params,
  response,
}: RouterContext<string>) => {
  try {
    const post = await Post.findOne({ _id: new Bson.ObjectId(params.postId) });

    if (!post) {
      response.status = 404;
      response.body = {
        status: 'success',
        message: 'No post with that Id exists',
      };
      return;
    }

    response.status = 200;
    response.body = {
      status: 'success',
       post,
    };
  } catch (error) {
    response.status = 500;
    response.body = { status: 'error', message: error.message };
    return;
  }
};

const findAllPostsController = async ({
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
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $skip: skip,
      },
      {
        $limit: intLimit,
      },
      {$unset: ["user.password", "user.verified","user.createdAt", "user.updatedAt"]}
    ];

    const posts = await Post.aggregate(pipeline).toArray();

    response.status = 200;
    response.body = {
      status: 'success',
      results: posts.length,
      posts,
    };
  } catch (error) {
    response.status = 500;
    response.body = { status: 'error', message: error.message };
    return;
  }
};

const deletePostController = async ({
  params,
  response,
}: RouterContext<string>) => {
  try {
    const numberOfPost = await Post.deleteOne({
      _id: new Bson.ObjectId(params.postId),
    });

    if (!numberOfPost) {
      response.status = 404;
      response.body = {
        status: 'success',
        message: 'No post with that Id exists',
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
  createPostController,
  updatePostController,
  findPostController,
  findAllPostsController,
  deletePostController,
};
