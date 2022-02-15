import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getSession } from "next-auth/react";
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

const wsLink =
  typeof window != "undefined"
    ? new WebSocketLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_WEBSOCKET_ENDPOINT,
        options: {
          lazy: true,
          reconnect: true,
          connectionParams: async () => {
            const session = await getSession();
            return {
              headers: {
                Authorization: session ? `Bearer ${session.hasuraToken}` : "",
              },
            };
          },
        },
      })
    : null;

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink =
  typeof window != "undefined"
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
