import { Schema } from "@effect/schema";

export class Signup extends Schema.TaggedRequest<Signup>()(
  "Signup",
  Schema.Never,
  Schema.Void,
  {
    username: Schema.String,
    password: Schema.String,
  }
) {}
