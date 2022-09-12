import { Application, Router, Bson } from './deps.ts';
import type { RouterContext } from './deps.ts';
import config from './config/default.ts';
import { User } from './models/user.model.ts';

const app = new Application();

const router = new Router();

// Health checker
router.get<string>('/api/healthchecker', (ctx: RouterContext<string>) => {
  ctx.response.status = 200
  ctx.response.body = {
    status: "success",
    message: "Welcome to Deno with MongoDB"
  }
});

// Create a new user
router.post<string>('/api/users', async(ctx: RouterContext<string>)=> {
try {
  const {name, email}:{name: string, email: string} = await ctx.request.body().value
  const userId: string | Bson.ObjectId = await User.insertOne({name,email})

  if(!userId){
    ctx.response.status = 500;
  ctx.response.body = {
    status: 'error',
    message: "Something bad happened"
  }
    return
  }

  const user = await User.findOne({_id: userId})

  ctx.response.status = 200;
  ctx.response.body = {
    status: 'success',
    user
  }

} catch (error) {
  ctx.response.status = 500;
  ctx.response.body = {
    status: 'error',
    message: error.message
  }
}
})

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', ({ port, secure }) => {
  console.log(
    `🚀 Server started on ${secure ? 'https://' : 'http://'}localhost:${port}`
  );
});

const port = config.serverPort;
app.listen({ port });
