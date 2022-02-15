import Head from "next/head";
import Layout, { Scaffold, Measure } from "../../components/Layout";
import { getSession } from "next-auth/react";
import ChatList from "../../components/chat/ChatList";
function Inbox({ session }) {
  return (
    <>
      <Head>
        <title>Your Inbox</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Measure>
        <Scaffold>
          <h1>Chats</h1>
          <ChatList />
        </Scaffold>
      </Measure>
    </>
  );
}

Inbox.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default Inbox;
