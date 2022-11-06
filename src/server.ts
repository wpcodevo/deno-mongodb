import { Application, Router, oakCors, logger } from "./deps.ts";
import type { RouterContext } from "./deps.ts";
import config from "./config/default.ts";
import appRouter from "./routes/index.ts";

const app = new Application();
const router = new Router();

// Middleware Logger
app.use(logger.default.logger);
app.use(logger.default.responseTime);

// Health checker
router.get<string>("/api/healthchecker", (ctx: RouterContext<string>) => {
  ctx.response.status = 200;
  ctx.response.body = {
    status: "success",
    message: "Welcome to Deno with MongoDB",
  };
});

app.use(
  oakCors({
    origin: /^.+localhost:(3000|3001)$/,
    optionsSuccessStatus: 200,
  })
);

appRouter.init(app);
app.use(router.routes());
app.use(router.allowedMethods());

// app.use(({ request, response }) => {
//   response.status = 404;
//   response.body = {
//     status: "fail",
//     message: `Route ${request.url} not found`,
//   };
//   return;
// });

app.addEventListener("listen", ({ port, secure }) => {
  console.info(
    `🚀 Server started on ${secure ? "https://" : "http://"}localhost:${port}`
  );
});

const port = config.port;
app.listen({ port });
