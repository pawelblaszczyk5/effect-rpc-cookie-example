import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { HttpServer } from "@effect/platform";
import { Router, Rpc } from "@effect/rpc";
import { HttpRouterNoStream } from "@effect/rpc-http";
import { Effect, Layer } from "effect";
import { createServer } from "node:http";
import { Signup } from "./schema.js";

// Implement the RPC server router
const router = Router.make(
  Rpc.effect(Signup, (signup) =>
    Effect.gen(function* () {
      yield* HttpServer.app.appendPreResponseHandler((_, res) =>
        Effect.orDie(HttpServer.response.setCookie(res, "bla", "blu"))
      );
      // How to approach forwarding this cookie to response?

      yield* HttpServer.app.currentPreResponseHandlers.pipe(Effect.log);
    })
  )
);

export type Router = typeof router;

// Create the http server
const HttpLive = HttpServer.router.empty.pipe(
  HttpServer.router.post("/rpc", HttpRouterNoStream.toHttpApp(router)),
  HttpServer.server.serve(HttpServer.middleware.logger),
  HttpServer.server.withLogAddress,
  Layer.provide(NodeHttpServer.server.layer(createServer, { port: 3000 }))
);

Layer.launch(HttpLive).pipe(NodeRuntime.runMain);
