import { HttpClient } from "@effect/platform";
import { Resolver } from "@effect/rpc";
import { HttpResolver } from "@effect/rpc-http";
import type { Router } from "./router.js";
import { Signup } from "./schema.js";
import { Effect } from "effect";

// Create the client
const client = HttpResolver.make<Router>(
  HttpClient.client.fetchOk.pipe(
    HttpClient.client.mapRequest(
      HttpClient.request.prependUrl("http://localhost:3000/rpc")
    ),
    HttpClient.client.transformResponse((f) =>
      f.pipe(
        Effect.tap((res) => {
          console.log(res.cookies);
          console.log(res.headers);
        })
      )
    )
  )
).pipe(Resolver.toClient);

// Use the client

await Effect.runPromise(
  client(
    new Signup({
      username: "foo",
      password: "bar",
    })
  )
);
