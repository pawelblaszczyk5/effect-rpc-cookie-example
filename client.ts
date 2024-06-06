import { HttpClient } from "@effect/platform";
import { Resolver } from "@effect/rpc";
import { HttpResolver } from "@effect/rpc-http";
import type { Router } from "./router.js";
import { Signup } from "./schema.js";

// Create the client
const client = HttpResolver.make<Router>(
  HttpClient.client.fetchOk.pipe(
    HttpClient.client.mapRequest(
      HttpClient.request.prependUrl("http://localhost:3000/rpc")
    )
  )
).pipe(Resolver.toClient);

// Use the client
client(
  new Signup({
    username: "foo",
    password: "bar",
  })
);
