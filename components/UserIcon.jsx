import Image from "next/image";
import { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/outline";

function UserIcon(props) {
  const [loadingError, setLoadingError] = useState(false);
  return (
    <button
      className={`${
        props.className ? props.className : ""
      } relative bg-slate-900 scale-90 rounded-full p-1 cursor-pointer flex grow-0 shrink-0 basis-auto justify-between items-center`}
    >
      <>
        {props.showLabel && (
          <span className="text-gray-200 text-xs mr-2 ml-2 pl-2 hidden md:block">
            {props.widgetTitle}
          </span>
        )}

        <div
          className="relative"
          style={{
            height: props.height || "2rem",
            width: props.width || "2rem",
          }}
        >
          {props.user && props.user.photoUrl && !loadingError && (
            <Image
              className={`z-10 absolute h-full w-full rounded-full object-cover`}
              src={props.user.photoUrl}
              layout="fill"
              onError={() => setLoadingError(true)}
              alt={`Avatar ${props.user.displayName}`}
            />
          )}

          <div
            className="flex justify-center relative items-center rounded-full bg-slate-100 ring-2 ring-slate-900"
            style={{
              height: props.height || "2rem",
              width: props.width || "2rem",
            }}
          >
            <UserCircleIcon className="text-gray-800 h-full w-full rounded-full" />
            {/* Notification Symbol */}
            {props.showNotificationsIndicator && (
              <>
                <div className="absolute -bottom-[1px] left-[1px] border-2 border-white rounded-full bg-secondary h-[0.7rem] w-[0.7rem] z-10"></div>
                <div className="absolute -bottom-[1px] left-[1px] rounded-full bg-secondary h-[0.7rem] w-[0.7rem] animate-ping-slow z-0"></div>
              </>
            )}
          </div>
        </div>
      </>
    </button>
  );
}

export default UserIcon;
