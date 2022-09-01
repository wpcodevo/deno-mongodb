import { Application, Router, Bson } from './deps.ts';
import type { RouterContext } from './deps.ts';
import config from './config/default.ts';
import {User} from "./models/user.model.ts"

const app = new Application();

const router = new Router();

router.get<string>('/api/healthchecker', (ctx: RouterContext<string>) => {
  ctx.response.body = 'Hello World!';
});

router.post("/api/users", async function({request,response}: RouterContext<string>){
  try {
   const { name, email } = await request.body()
      .value;
    const userExists = await User.findOne({ email });
    if (userExists) {
      response.status = 409;
      response.body = {
        status: 'fail',
        message: 'User with that email already exists',
      };
      return;
    }

    const createdAt = new Date();
    const updatedAt = createdAt;

    const userId: string | Bson.ObjectId = await User.insertOne({
      name,
      email,
      createdAt,
      updatedAt,
    });

    if (!userId) {
      response.status = 500;
      response.body = { status: 'error', message: 'Error creating user' };
      return;
    }

    const user = await User.findOne({ _id: userId });

    response.status = 201;
    response.body = {
      status: 'success',
      data: { user },
    }; 
  } catch (error) {
    response.status = 500;
    response.body = {
      status: 'error',
      message: error.message,
    };
  }
})

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', ({ hostname, port, secure }) => {
  console.log(
    `🚀 Server started on ${secure ? 'https://' : 'http://'}localhost:${port}`
  );
});

const port = config.port;
app.listen({ port });
