import Head from "next/head";
import Layout, { Scaffold, Measure } from "../../components/Layout";
import { getSession } from "next-auth/react";
import FollowerList from "../../components/FollowerList";
function Followers({ session }) {
  return (
    <>
      <Head>
        <title>Your Followers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Measure>
        <Scaffold>
          <h1>People that follow you</h1>
          <FollowerList session={session} limit={Infinity} />
        </Scaffold>
      </Measure>
    </>
  );
}

Followers.getLayout = function getLayout(page) {
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

export default Followers;
