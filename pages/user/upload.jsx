import Head from "next/head";
import Layout, { Scaffold, Measure } from "../../components/Layout";
import { getSession } from "next-auth/react";
import UploadPost from "../../components/posts/UploadPost";
function Upload({ session }) {
  return (
    <>
      <Head>
        <title>Upload a post</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Measure>
        <Scaffold>
          <h1>Upload</h1>
          <UploadPost />
        </Scaffold>
      </Measure>
    </>
  );
}

Upload.getLayout = function getLayout(page) {
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

export default Upload;
