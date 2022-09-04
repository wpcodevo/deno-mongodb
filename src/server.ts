import { Application, Router } from './deps.ts';
import type { RouterContext } from './deps.ts';
import config from './config/default.ts';
import appRouter from './routes/index.ts'

const app = new Application();

const router = new Router(); // Create router

// Middleware Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});


// Test the API
router.get<string>('/api/healthchecker', (ctx: RouterContext<string>) => {
  ctx.response.body = {
    status: "success",
    message: "Welcome to Deno and MongoDB"
  };
});

// 👇 Evoke the routers here
appRouter.init(app)
app.use(router.routes()); // Implement our router
app.use(router.allowedMethods()); // Allow router HTTP methods

app.addEventListener('listen', ({ port, secure }) => {
  console.log(
    `🚀 Server started on ${secure ? 'https://' : 'http://'}localhost:${port}`
  );
});

const port = config.port;
app.listen({ port });
