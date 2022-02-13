import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserIcon from "./UserIcon";
import { signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LogoutIcon,
  UserCircleIcon as UserCircleIconOutline,
} from "@heroicons/react/outline";
import { useClickOutside } from "../util/hooks";

function ProfileWidget(props) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const router = useRouter();

  useClickOutside(ref, () => open && toggleMenu());

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div ref={ref} onClick={() => toggleMenu()} className="relative">
      <UserIcon
        {...props}
        showLabel={true}
        linkTitle={""}
        user={session?.user}
        widgetTitle={session?.user ? session.user.displayName : "my profile"}
      />
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="profileWidgetArrow"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              style={{
                top: "calc(100% + 0.4rem)",
              }}
              className="absolute transform -rotate-45 right-4 h-3 w-3 bg-slate-100 rounded-tr-md"
            />
            <motion.ul
              key="profileWidgetUl"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="mt-4 overflow-hidden absolute right-0 min-w-max w-full top-[100%] rounded-lg shadow-lg shadow-slate-300 bg-white ring ring-slate-100 px-5 py-3"
            >
              <motion.li
                key="profileWidgetLi1"
                className="my-2"
                initial={{
                  x: "-100%",
                  opacity: 0,
                }}
                animate={{
                  x: "0%",
                  opacity: 1,
                }}
                exit={{
                  x: "-10%",
                  opacity: 0,
                }}
              >
                <Link
                  href={{
                    pathname: "/user/[userhandle]",
                    query: {
                      userhandle: session.user.userHandle,
                    },
                  }}
                >
                  <a className="text-sm flex justify-start items-center mx-1">
                    <UserCircleIconOutline className="grow-0 shrink-0 basis-5 h-5 w-5 stroke-2 mr-1 text-slate-900" />
                    <span className="text-slate-900">your profile</span>
                  </a>
                </Link>
              </motion.li>
              <motion.li
                key="profileWidgetLi3"
                className="my-2"
                initial={{
                  x: "-100%",
                  opacity: 0,
                }}
                animate={{
                  x: "0%",
                  opacity: 1,
                }}
                exit={{
                  x: "-10%",
                  opacity: 0,
                }}
              >
                <div>
                  <hr className="my-3" />
                  <button
                    onClick={signOut}
                    className="text-sm flex justify-start items-center mx-1"
                  >
                    <LogoutIcon className="grow-0 shrink-0 basis-5 h-5 w-5 stroke-2 mr-1 text-slate-900" />
                    <span className="text-slate-900">log out</span>
                  </button>
                </div>
              </motion.li>
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfileWidget;
