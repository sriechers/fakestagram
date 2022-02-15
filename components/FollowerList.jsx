import UserIcon from "./UserIcon";
import Link from "next/link";
import { useQuery, gql } from "@apollo/client";
import { GET_FOLLOWERS_OF_USER } from "../db/queries";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
function FollowerList({ session, limit = 5 }) {
  const { data: followerData } = useQuery(GET_FOLLOWERS_OF_USER, {
    context: {
      headers: {
        authorization: session.hasuraToken
          ? `Bearer ${session.hasuraToken}`
          : "",
      },
    },
    variables: {
      userId: session?.user?.id,
    },
  });

  return followerData?.followers.length > 0 ? (
    <section className="bg-card">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-slate-400 mb-0 tracking-wide font-normal text-base">
          People that follow you
        </h2>
        {limit < followerData?.followers.length && (
          <Link href="/user/followers">
            <a className="text-blue-500 text-sm">show all</a>
          </Link>
        )}
      </div>
      <motion.ul
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        transition={{
          duration: 0.8,
          staggerChildren: 0.3,
        }}
        className="w-full mb-2"
      >
        {followerData?.followers?.map((follower, i) => {
          // only show first 5 followers
          return (
            i < limit && (
              <motion.li
                key={`follower-preview-${i}`}
                className={`border-t-2 border-t-slate-100 pt-3 mt-3`}
                initial={{
                  opacity: 0,
                  x: "1rem",
                }}
                animate={{
                  opacity: 1,
                  x: "0rem",
                }}
                exit={{
                  opacity: 0,
                  x: "1rem",
                }}
              >
                <Link
                  key={"sidebar-followers-" + follower.followerId}
                  href={{
                    pathname: "/user/[userhandle]",
                    query: {
                      userhandle: follower.user.userHandle,
                    },
                  }}
                >
                  <a key={follower.followerId} className="flex items-center">
                    <UserIcon user={follower.user} className="" />
                    <p className="text-slate-400 text-sm text-center font-medium tracking-wide ml-2">
                      {follower.user.displayName}
                    </p>
                  </a>
                </Link>
              </motion.li>
            )
          );
        })}
      </motion.ul>
    </section>
  ) : (
    <>
      {followerData?.followers.length < 0 && (
        <div className="relative h-16 rounded-md bg-white shadow-lg shadow-slate-200 border-y-2  border-t-slate-100 border-b-slate-200 px-5 py-3">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
}

export default FollowerList;
