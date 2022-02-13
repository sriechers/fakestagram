import { useState } from "react";
import Head from "next/head";
import { getSession } from "next-auth/react";
import Layout, { Measure } from "../components/Layout";
import Feed from "../components/posts/Feed";
import Sidebar from "../components/Sidebar";
// import { hasuraRequest } from "../util/HasuraAdapter";
import { GET_POSTS } from "../db/queries";
import { gql, useQuery } from "@apollo/client";
import UploadPost from "../components/posts/UploadPost";
export default function Home({ session }) {
  const {
    data,
    error: postDBError,
    loading,
    refetch,
  } = useQuery(GET_POSTS, {
    variables: {
      limit: 10,
    },
    context: {
      headers: {
        authorization: session?.hasuraToken
          ? `Bearer ${session.hasuraToken}`
          : "",
      },
    },
  });

  console.log(data);

  return (
    <>
      <Head>
        <title>Instagram Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex md:flex-row flex-col mx-auto lg:max-w-screen-lg max-w-screen-md px-6 grow">
        <div className="grow">
          <UploadPost id="upload-post" className="mb-8" />
          <Feed posts={data?.posts} loading={loading} refetchPosts={refetch} />
          {postDBError && (
            <p className="text-slate-700">
              There was an error loading the posts
            </p>
          )}
        </div>
        <div className="min-w-[23rem]">
          <div className="fixed">
            <Sidebar session={session} />
          </div>
        </div>
      </div>
    </>
  );
}

Home.getLayout = function getLayout(page) {
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

  // const data = await hasuraRequest({
  //   query: GET_POSTS,
  //   variables: {
  //     limit: 10,
  //   },
  // });

  return {
    props: {
      session,
      // initialPosts: data,
    },
  };
}
