import { useState } from "react";
import UserIcon from "../UserIcon";
import { GET_USERS_FOLLOWED } from "../../db/queries";
import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import LoadingSpinner from "../LoadingSpinner";
import Link from "next/link";
function ChatList() {
  const { data: session } = useSession();
  const { data, error, loading } = useQuery(GET_USERS_FOLLOWED, {
    context: {
      headers: {
        authorization: session?.hasuraToken
          ? `Bearer ${session.hasuraToken}`
          : "",
      },
    },
    variables: {
      userId: session?.user?.id || null,
    },
  });

  if (error) {
    console.error("[ERROR FETCHING FOLLOWERS]", error);
    return (
      <p className="text-slate-700 tracking-wide">
        There was an error creating your Chat List.
      </p>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ul className="bg-card">
      {data?.followers.map((follower, i) => (
        <li
          key={`chat-message-u${follower.id}`}
          className={`${
            i !== data.followers.length - 1
              ? "border-b-slate-100 border-b-2 mb-3 pb-3"
              : ""
          }`}
        >
          <Link
            href={{
              pathname: "/inbox/[roomId]",
              query: {
                roomId: follower.userByUserid.userHandle,
              },
            }}
          >
            <a className="flex items-center">
              <div>
                <UserIcon
                  user={follower.userByUserid}
                  height="3rem"
                  width="3rem"
                />
              </div>
              <div className="ml-3 flex justify-between grow">
                <div>
                  <p className="text-slate-900 font-medium text-lg">
                    {follower.userByUserid.displayName}
                  </p>
                  {/* <p className="text-slate-400 text-base tracking-wide">
                    start chatting
                  </p> */}
                </div>
              </div>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default ChatList;
