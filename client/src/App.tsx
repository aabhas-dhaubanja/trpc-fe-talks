import React from "react";
import "./App.css";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../index";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/trpc",
    }),
  ],
});

function App() {
  const [state, setState] = React.useState<any>();

  const getUser = async () => {
    const user = await trpc.getUser.query("");
    setState(user);

    const newUser = await trpc.createUser.mutate("hari");
    console.log(newUser);
  };

  React.useEffect(() => {
    getUser();
  }, []);

  return <div>{state}</div>;
}

export default App;
