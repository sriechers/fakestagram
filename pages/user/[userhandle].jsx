import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { useQuery, useMutation, gql } from "@apollo/client";
import Layout, { Measure, Scaffold } from "../../components/Layout";
import {
  GET_USER_BY_HANDLE,
  GET_POSTS_FROM_USER_ID,
  ADD_FOLLOWER,
  DELETE_FOLLOWER,
  GET_FOLLOWERS_FROM_USER_ID,
} from "../../db/queries";
import { apolloClient } from "../../db";
import Head from "next/head";
import UserIcon from "../../components/UserIcon";
import Feed from "../../components/posts/Feed";
import Button from "../../components/Button";
import Link from "next/link";

function Profile({ session, userData, userPosts, isOwnProfile, followers }) {
  const postCount = userPosts[0]?.user.posts_aggregate.aggregate.count;
  const { data: followerData, error: followersError } = useQuery(
    GET_FOLLOWERS_FROM_USER_ID,
    {
      context: {
        headers: {
          authorization: session.hasuraToken
            ? `Bearer ${session.hasuraToken}`
            : "",
        },
      },
      variables: {
        userId: userData.id,
      },
    }
  );

  const getFollowerStatus = () =>
    followerData?.followers.some(
      (follower) => follower.followerId === session.user.id
    );

  const [isFollower, setIsFollower] = useState(null);

  useEffect(() => {
    if (!followerData?.followers) return;
    setIsFollower(() => getFollowerStatus());
  }, [followerData]);

  const [
    addFollower,
    { error: addFollowerError, loading: loadingAddFollower },
  ] = useMutation(ADD_FOLLOWER, {
    variables: {
      userId: userData?.id,
      followerId: session?.user?.id,
    },
    refetchQueries: [GET_FOLLOWERS_FROM_USER_ID],
    context: {
      headers: {
        authorization: session?.hasuraToken
          ? `Bearer ${session.hasuraToken}`
          : "",
      },
    },
  });

  const [
    deleteFollower,
    { error: delFollowerError, loading: loadingDelFollower },
  ] = useMutation(DELETE_FOLLOWER, {
    variables: {
      userId: userData?.id,
      followerId: session?.user?.id,
    },
    refetchQueries: [GET_FOLLOWERS_FROM_USER_ID],
    context: {
      headers: {
        authorization: session?.hasuraToken
          ? `Bearer ${session.hasuraToken}`
          : "",
      },
    },
  });

  const handleFollow = () => {
    if (isFollower) {
      deleteFollower();
      setIsFollower(false);
      return;
    }

    addFollower();
    setIsFollower(true);
  };

  if (addFollowerError || delFollowerError) {
    console.error("[ERROR] updating Followers", {
      addFollowerError,
      delFollowerError,
    });
  }

  return (
    <>
      <Head>
        <title>Profile of {userData.displayName}</title>
      </Head>
      <Measure className="mx-auto max-w-screen-md">
        <Scaffold>
          <header>
            <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
              <div className="flex items-center grow">
                <div>
                  <UserIcon
                    height={"8.5rem"}
                    width={"8.5rem"}
                    showLabel={false}
                    showNotificationsIndicator={false}
                    linkTitle={"open story"}
                    user={userData}
                    widgetTitle={""}
                  />
                </div>
                <div className="flex sm:items-center sm:flex-row flex-col grow justify-between items-start ml-3">
                  <div>
                    <p className="font-medium text-xl text-slate-900">
                      {userData.displayName}
                    </p>
                    <span className="font-medium md:text-base text-sm text-slate-400">
                      @{userData.userHandle}
                    </span>
                  </div>
                  {!isOwnProfile && isFollower !== null && (
                    <div className="sm:mt-0 mt-2">
                      <Button
                        disabled={loadingAddFollower || loadingDelFollower}
                        onClick={() => handleFollow()}
                      >
                        {isFollower ? "unfollow" : "follow"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center border-y-2 border-y-slate-200 py-3">
              <ul className="flex items-center justify-between gap-4 w-64 mx-auto">
                <li>
                  <div className="text-center font-bold text-slate-900 text-xl">
                    {followerData?.followers?.length > 0
                      ? followerData.followers[0]?.user.followers_aggregate
                          .aggregate.count
                      : 0}
                  </div>
                  <div className="text-center font-medium text-slate-300 sm:text-sm text-xs mt-1 tracking-wide">
                    followers
                  </div>
                </li>
                <li>
                  <div className="text-center font-bold text-slate-900 text-xl">
                    0
                  </div>
                  <div className="text-center font-medium text-slate-300 sm:text-sm text-xs mt-1 tracking-wide">
                    following
                  </div>
                </li>
                <li>
                  <div className="text-center font-bold text-slate-900 text-xl">
                    {postCount || 0}
                  </div>
                  <div className="text-center font-medium text-slate-300 sm:text-sm text-xs mt-1 tracking-wide">
                    posts
                  </div>
                </li>
              </ul>
            </div>
          </header>

          <section className="w-full flex justify-center gap-8 mt-8">
            {/* <h2 className="text-slate-300 text-base">Posts</h2> */}
            <Feed className="max-w-xl max-auto" posts={userPosts} />
          </section>
        </Scaffold>
      </Measure>
    </>
  );
}

Profile.getLayout = function getLayout(page) {
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

  const { data: userData, error: userError } = await apolloClient.query({
    query: GET_USER_BY_HANDLE,
    context: {
      headers: {
        authorization: session.hasuraToken
          ? `Bearer ${session.hasuraToken}`
          : "",
      },
    },
    variables: {
      userHandle: context.query.userhandle,
    },
  });

  if (userError) {
    return {
      notFound: true,
    };
  }

  const { data: userPosts } = await apolloClient.query({
    query: GET_POSTS_FROM_USER_ID,
    context: {
      headers: {
        authorization: session.hasuraToken
          ? `Bearer ${session.hasuraToken}`
          : "",
      },
    },
    variables: {
      userId: userData.users[0].id,
      limit: 100,
    },
  });

  // const { data: followerData, error: followersError } =
  //   await apolloClient.query({
  //     query: GET_FOLLOWERS_FROM_USER_ID,
  //     context: {
  //       headers: {
  //         authorization: session.hasuraToken
  //           ? `Bearer ${session.hasuraToken}`
  //           : "",
  //       },
  //     },
  //     variables: {
  //       userId: userData.users[0].id,
  //     },
  //   });

  return {
    props: {
      session,
      userData: userData.users[0],
      // followers: followerData.followers,
      userPosts: userPosts.posts,
      isOwnProfile: userData.users[0].id == session.user.id,
    },
  };
}

export default Profile;
