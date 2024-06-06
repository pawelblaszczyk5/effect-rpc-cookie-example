import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { HttpServer } from "@effect/platform";
import { Router, Rpc } from "@effect/rpc";
import { HttpRouter } from "@effect/rpc-http";
import { Effect, Layer } from "effect";
import { createServer } from "node:http";
import { Signup } from "./schema.js";

const signupUser = (signup: Signup) =>
  Effect.succeed("cookie value with session");

// Implement the RPC server router
const router = Router.make(
  Rpc.effect(Signup, (signup) =>
    Effect.gen(function* () {
      const cookieValue = yield* signupUser(signup);

      // How to approach forwarding this cookie to response?
    })
  )
);

export type Router = typeof router;

// Create the http server
const HttpLive = HttpServer.router.empty.pipe(
  HttpServer.router.post("/rpc", HttpRouter.toHttpApp(router)),
  HttpServer.server.serve(HttpServer.middleware.logger),
  HttpServer.server.withLogAddress,
  Layer.provide(NodeHttpServer.server.layer(createServer, { port: 3000 }))
);

Layer.launch(HttpLive).pipe(NodeRuntime.runMain);
