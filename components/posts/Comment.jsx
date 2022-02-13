import { motion } from "framer-motion";
import UserIcon from "../UserIcon";
import ReactTimeAgo from "react-time-ago";
import { zonedTimeToUtc } from "date-fns-tz";
import Link from "next/link";
import { useMutation, gql } from "@apollo/client";
import { DELETE_POST_COMMENT, GET_POSTS } from "../../db/queries";
import { useSession } from "next-auth/react";

function Comment({ user, text, id, created_at, onCommentsUpdate }) {
  const { data: session } = useSession();

  const [deleteComment, { data, error: deleteCommentDBError, loading }] =
    useMutation(
      gql`
        ${DELETE_POST_COMMENT}
      `,
      {
        variables: {
          id: id,
        },
        refetchQueries: [GET_POSTS],
        context: {
          headers: {
            authorization: session?.hasuraToken
              ? `Bearer ${session.hasuraToken}`
              : "",
          },
        },
      }
    );

  onCommentsUpdate("test", { tes: "test" });
  return (
    <motion.div
      key={"comment-id-" + id}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
    >
      {!user || !text ? (
        <div className="w-full ml-1">
          <div className="flex animate-pulse items-center h-full w-full space-x-5">
            <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
            <div className="flex flex-col space-y-3">
              <div className="w-44 bg-gray-300 h-2 rounded-md"></div>
              <div className="w-32 bg-gray-300 h-2 rounded-md"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {!loading && (
            <div className={`flex my-3`}>
              <Link
                href={{
                  pathname: "/user/[userhandle]",
                  query: {
                    userhandle: user.userHandle,
                  },
                }}
              >
                <a className="block">
                  <UserIcon user={user} height="1.8rem" width="1.8rem" />
                </a>
              </Link>
              <p className="ml-2 mr-1">
                <Link
                  href={{
                    pathname: "/user/[userhandle]",
                    query: {
                      userhandle: user.userHandle,
                    },
                  }}
                >
                  <a className="font-medium text-normal text-slate-900 mr-1">
                    {user.displayName}
                  </a>
                </Link>
                <span className="text-normal text-slate-700">{text}</span>
                <span className="block">
                  <ReactTimeAgo
                    className={`uppercase text-[0.65rem] mr-5 font-normal tracking-wide text-slate-400`}
                    date={zonedTimeToUtc(created_at, "Europe/Berlin")}
                    timeStyle="round-minute"
                  />
                  {user.id === session.user.id && (
                    <button
                      onClick={() => {
                        deleteComment();
                      }}
                      disabled={loading}
                      aria-label={`delete comment`}
                      className="text-sm font-normal mr-2 tracking-wide text-rose-500 leading-tight"
                    >
                      delete
                    </button>
                  )}
                  {/* <button
                    className="text-sm font-normal tracking-wide text-slate-500 leading-tight"
                    aria-label={`answer ${user.displayName}'s comment`}
                  >
                    answer
                  </button> */}
                </span>
              </p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

export default Comment;
