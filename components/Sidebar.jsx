import UserIcon from "./UserIcon";
import Link from "next/link";
import FollowerList from "./FollowerList";
function Sidebar({ session }) {
  return (
    <aside className="min-w-[23rem] px-6 pb-4">
      {session?.user && (
        <>
          <div className="flex items-center mb-5">
            <UserIcon height="4rem" width="4rem" user={session.user} />
            <Link
              href={{
                pathname: "/user/[userhandle]",
                query: {
                  userhandle: session.user.userHandle,
                },
              }}
            >
              <a>
                <div className="ml-3">
                  <p className="text-slate-900 text-md font-bold leading-snug">
                    {session.user.userHandle}
                  </p>
                  <p className="text-slate-500 text-lg font-normal leading-snug">
                    {session.user.displayName}
                  </p>
                </div>
              </a>
            </Link>
          </div>
          <FollowerList session={session} />
        </>
      )}
      <p className="text-xs text-slate-400 mt-10 max-w-lg">
        DISCLAIMER: Since this project is a prototype, I have not optimized
        every little thing for speed and performance. In addition, the database
        and the hasura server run as a free tier and therefore the performance
        can vary greatly.
      </p>
    </aside>
  );
}

export default Sidebar;
