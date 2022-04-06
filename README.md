# Overview

A social media app, loosely based on Instagram and Facebook. This app uses a GraphQl [Hasura](https://hasura.io/) Backend with a [PostgreSQL](https://www.postgresql.org/) Database and [Next.js](https://nextjs.org/) as it's frontend and API Server.

Authentication is managed through [NextAuth](https://next-auth.js.org/) with a custom hasura adapter.

The GraphQl request are send via [ApolloClient](https://www.apollographql.com/docs/react/) for React.

# DEMO available

You can check out a working demo of the project [here](https://fakestagram-sriechers.vercel.app/)

# Realtime Chat

In order to achieve a realtime chat, the app uses a websocket connection to the hasura server to display chat messages.
All other calls the the database / hasura server use a normal http connection.
