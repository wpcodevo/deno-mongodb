import { Application, Router } from './deps.ts';
import type { RouterContext } from './deps.ts';
import config from './config/default.ts';
import {User} from "./models/user.model.ts"

const app = new Application();

const router = new Router();

router.get<string>('/api/healthchecker', (ctx: RouterContext<string>) => {
  ctx.response.body = 'Hello World!';
});

router.post("/users", async function({request,response}: RouterContext<string>){
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
