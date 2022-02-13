import UserIcon from "../UserIcon";
// import { GET_FOLLOWERS_FROM_USER_ID } from "../../db/queries";
import { useQuery, gql } from "@apollo/client";
import { useSession } from "next-auth/react";
import LoadingSpinner from "../LoadingSpinner";
function ChatList() {
  const { data: session } = useSession();

  // TODO change to global follower query
  const GET_FOLLOWERS_FROM_USER = gql`
    query GetFollowers($followerId: Int!) {
      followers(where: { followerId: { _eq: $followerId } }) {
        id
        user {
          displayName
          photoUrl
          id
          userHandle
          username
        }
      }
    }
  `;

  const { data, error, loading } = useQuery(GET_FOLLOWERS_FROM_USER, {
    context: {
      headers: {
        authorization: session?.hasuraToken
          ? `Bearer ${session.hasuraToken}`
          : "",
      },
    },
    variables: {
      followerId: session?.user?.id || null,
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

  console.log(data);

  return (
    <ul className="bg-card">
      {data?.followers.map((follower, i) => (
        <li
          key={`chat-message-u${follower.id}`}
          className={`${
            i !== data.followers.length - 1
              ? "border-b-slate-100 border-b-2 mb-3 pb-3"
              : ""
          } flex items-center`}
        >
          <div>
            <UserIcon user={follower.user} height="3rem" width="3rem" />
          </div>
          <div className="ml-3 flex justify-between grow">
            <div>
              <p className="text-slate-900 font-medium text-lg">
                {follower.user.displayName}
              </p>
              <p className="text-slate-400 text-base tracking-wide">
                last chat message
              </p>
            </div>
            <time>9:00</time>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ChatList;
