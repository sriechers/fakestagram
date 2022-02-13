import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../db";
import { AnimateSharedLayout } from "framer-motion";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);

const REFETCH_SESSION_AFTER_SECONDS = 30 * 30; // 15 Minutes

function MyApp({ Component, pageProps, session }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ApolloProvider client={apolloClient}>
      <SessionProvider
        session={session}
        refetchInterval={REFETCH_SESSION_AFTER_SECONDS}
      >
        <AnimateSharedLayout>
          <div id="portal-layer" style={{ zIndex: 1000 }} />
          {getLayout(<Component {...pageProps} />)}
        </AnimateSharedLayout>
      </SessionProvider>
    </ApolloProvider>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}

export default MyApp;
