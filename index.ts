import express from "express";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { randomUUID } from "crypto";

interface IUser {
  id: string;
  name: string;
}

const users: IUser[] = [{ id: randomUUID(), name: "aabhas" }];

const t = initTRPC.create();

const appRouter = t.router({
  getUser: t.procedure
    .input((val: unknown) => {
      if (typeof val === "string") return val;
      throw new Error("wrong type");
    })
    .query((req) => {
      const { input } = req;
      const user = users.find(({ id }) => id == input);
      return user;
    }),
  createUser: t.procedure
    .input((name: unknown) => {
      if (typeof name === "string") return name;
      throw new Error("wrong type");
    })
    .mutation((req) => {
      const newUser = { id: randomUUID(), name: req.input };
      users.push(newUser);
      return newUser;
    }),
});

export type AppRouter = typeof appRouter;

const app = express();

app.use(cors());

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(3000, () => console.log("listening on 3000 ..."));
