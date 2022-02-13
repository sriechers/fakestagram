import { useState, useEffect } from "react";
import UserIcon from "../UserIcon";
import Image from "next/image";
import ReactTimeAgo from "react-time-ago";
import { zonedTimeToUtc } from "date-fns-tz";
import {
  HeartIcon as HeartIconOutline,
  ChatAlt2Icon as ChatAltIconOutline,
  PhotographIcon as PhotographIconOutline,
} from "@heroicons/react/outline";
import { HeartIcon, ChatAlt2Icon as ChatAltIcon } from "@heroicons/react/solid";
import truncateString from "../../util/truncateString";
import CommentsList from "./CommentsList";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useMutation, gql } from "@apollo/client";
import {
  INSERT_POST_LIKE,
  DELETE_POST_LIKE,
  INSERT_POST_COMMENT,
  GET_POSTS,
} from "../../db/queries";

function Post({
  id,
  media,
  user,
  description,
  created_at,
  post_likes_aggregate,
  refetchPosts,
  comments = [],
}) {
  const { data: session } = useSession();
  const postIsLikedByUser = post_likes_aggregate?.nodes?.some(
    (node) => node.userId == session?.user?.id
  );

  const [liked, setLiked] = useState(false);
  const [postLikes, setPostLikes] = useState(
    post_likes_aggregate?.aggregate?.count || 0
  );
  const [descOpen, setDescOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  // if media is JSON we need to parse it
  if (typeof media === "string") {
    media = JSON.parse(media);
  }

  const [addPostLike, { error: likeDBError }] = useMutation(
    gql`
      ${INSERT_POST_LIKE}
    `,
    {
      variables: {
        postId: id,
        userId: session?.user?.id,
      },
      context: {
        headers: {
          authorization: session?.hasuraToken
            ? `Bearer ${session.hasuraToken}`
            : "",
        },
      },
    }
  );

  const [delPostLike, { error: dislikeDBError }] = useMutation(
    gql`
      ${DELETE_POST_LIKE}
    `,
    {
      variables: {
        postId: id,
        userId: session?.user?.id,
      },
      context: {
        headers: {
          authorization: session?.hasuraToken
            ? `Bearer ${session.hasuraToken}`
            : "",
        },
      },
    }
  );

  useEffect(() => {
    setLiked(postIsLikedByUser);
  }, [session?.user]);

  useEffect(() => {
    if (likeDBError || dislikeDBError) {
      console.error("[MUTATION ERROR]", {
        likeDBError,
        dislikeDBError,
      });
    }
  }, [likeDBError, dislikeDBError]);

  const handlePostLikes = () => {
    if (liked) {
      setPostLikes((prev) => prev - 1);
      delPostLike();
    } else {
      setPostLikes((prev) => prev + 1);
      addPostLike();
    }
    setLiked((prev) => !prev);
  };

  // ANCHOR COMMENTS
  const [
    insertComment,
    { error: insertCommentDBError, loading: loadingAfterInsertComment },
  ] = useMutation(INSERT_POST_COMMENT, {
    variables: {
      postId: id,
      userId: session?.user?.id,
    },
    refetchQueries: [GET_POSTS],
    context: {
      headers: {
        authorization: session?.hasuraToken
          ? `Bearer ${session.hasuraToken}`
          : "",
      },
    },
  });

  const handleCommentUpdate = (type, content) => {
    switch (type) {
      case "insert":
        insertComment({
          variables: {
            text: content,
          },
        });
        break;
    }
  };

  return (
    <motion.article
      initial={{
        scale: 0.95,
      }}
      animate={{
        scale: 1,
      }}
      exit={{
        scale: 0.95,
      }}
      className="bg-white rounded-lg shadow-lg shadow-slate-200 border-2 border-b-slate-200 border-t-slate-50 border-l-slate-50 border-r-slate-50"
    >
      <Link
        href={{
          pathname: "/user/[userhandle]",
          query: {
            userhandle: user.userHandle,
          },
        }}
      >
        <a className="px-3 flex items-center py-4">
          <UserIcon user={user} />
          <p className="ml-2 font-medium">{user.displayName}</p>
        </a>
      </Link>
      <div className="relative md:h-80 h-60">
        {media[0]?.src && (
          <Image
            className="z-20"
            src={media[0].src}
            alt={media[0].alt || ""}
            layout="fill"
            objectFit="cover"
          />
        )}
        <button
          type="button"
          className="bg-gray-200 h-full w-full absolute overflow-hidden z-10 flex justify-center items-center"
        >
          <div>
            <PhotographIconOutline className="h-14 w-14 text-slate-500 mx-auto" />
            <span className="text-center text-sm font-bold tracking-wide text-slate-500">
              no image available
            </span>
          </div>
        </button>
      </div>
      <div className="px-3 pt-4 flex items-center gap-3">
        {!liked ? (
          <button aria-label="dislike post" onClick={handlePostLikes}>
            <HeartIconOutline className="md:h-8 md:w-8 h-7 w-7 text-slate-600" />
          </button>
        ) : (
          <button aria-label="like post" onClick={handlePostLikes}>
            <HeartIcon className="md:h-8 md:w-8 h-7 w-7 text-rose-500" />
          </button>
        )}
        <button
          disabled={comments.length === 0}
          aria-label="open comments"
          className={comments.length === 0 ? "opacity-40" : ""}
          onClick={() => setCommentsOpen((prev) => !prev)}
        >
          {commentsOpen ? (
            <ChatAltIcon className="md:h-7 md:w-7 h-6 w-6 text-blue-500" />
          ) : (
            <ChatAltIconOutline className="md:h-7 md:w-7 h-6 w-6 text-slate-600" />
          )}
        </button>
      </div>
      <div className="px-3 pt-2 flex items-center text-slate-800">
        {postLikes > 0 ? (
          <>
            <span className="font-bold mr-1 text-slate-700 text-sm">
              {postLikes}
            </span>
            <span className="text-sm text-slate-500">
              {postLikes > 1 ? "people" : "person"} like{postLikes < 2 && "s"}{" "}
              this
            </span>
          </>
        ) : (
          <span className="text-sm text-slate-500">
            be the first to like this
          </span>
        )}
      </div>
      <div className="px-3 pb-4">
        {!description ? (
          <div className=" py-4 grid grid-cols-3 gap-4 mt-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 col-span-2 bg-gray-200 rounded animate-pulse"></div>
            <div className=" h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="col-span-2"></div>
          </div>
        ) : (
          <p className="pt-2 pb-1">
            <span className="font-medium text-[0.9rem]">
              {user.displayName}
            </span>{" "}
            <span className="text-sm text-slate-700">
              {descOpen ? (
                description
              ) : (
                <>
                  {truncateString(description, 150)}

                  {description.length > 150 && (
                    <button
                      aria-label="expand description"
                      className="text-slate-400 ml-1"
                      onClick={() => setDescOpen(true)}
                    >
                      more
                    </button>
                  )}
                </>
              )}
            </span>
          </p>
        )}
        {comments.length > 0 && (
          <button
            className="block text-slate-800 mb-3 mt-1 text-sm font-medium"
            onClick={() => setCommentsOpen((prev) => !prev)}
          >
            {comments.length > 1
              ? `view all ${comments.length} comments`
              : "view comment"}
          </button>
        )}
        <ReactTimeAgo
          className={`uppercase text-xs font-normal tracking-wide text-slate-500`}
          date={zonedTimeToUtc(created_at, "Europe/Berlin")}
          timeStyle="round-minute"
        />
        <CommentsList
          id={id}
          loadingAfterSubmit={loadingAfterInsertComment}
          onCommentsUpdate={(type, content) =>
            handleCommentUpdate(type, content)
          }
          open={commentsOpen}
          comments={comments}
        />
      </div>
    </motion.article>
  );
}

export default Post;
