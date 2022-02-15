import ReactTimeAgo from "react-time-ago";
import { zonedTimeToUtc } from "date-fns-tz";
import Image from "next/image";
function ChatMessage({ user, currentUser, date, msg }) {
  const isSelf = user.id === currentUser.id;
  return (
    <div
      className={`flex my-2 items-center ${
        user.id === currentUser.id
          ? "justify-end pl-20"
          : "justify-start pr-20 z-10"
      }`}
    >
      {!isSelf && (
        <div
          title={user.displayName}
          className="mr-1 relative h-7 w-7 rounded-full overflow-hidden border-2 border-slate-200"
        >
          <Image src={user.photoUrl} layout="fill" objectFit="cover" />
        </div>
      )}
      <div
        className={`${
          isSelf ? "bg-blue-600" : "bg-slate-200"
        } px-3 py-1 bg-blue-600 min-w-[8rem] rounded-xl inline-flex justify-between items-end relative`}
      >
        <p
          className={`${
            isSelf ? "text-slate-50 text-right" : "text-slate-900 text-left"
          } w-full tracking-wide font-medium mb-[0.8rem]`}
        >
          {msg}
        </p>
        <ReactTimeAgo
          className={`${
            isSelf
              ? "text-slate-300 right-[0.9rem] text-right"
              : "text-slate-500 left-[0.9rem] text-left"
          } absolute text-[0.65rem] font-medium whitespace-nowrap`}
          date={zonedTimeToUtc(date, "Europe/Berlin")}
          timeStyle="round-minute"
        />
      </div>
    </div>
  );
}

export default ChatMessage;
