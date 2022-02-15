import { motion, AnimateSharedLayout } from "framer-motion";
import { useState, useCallback, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Portal from "../HOC/Portal";
import { useMatchMedia } from "../util/hooks";
// import { useSession } from "next-auth/react";
import {
  HomeIcon as HomeIconOutline,
  SearchIcon as SearchIconOutline,
  PaperAirplaneIcon as PaperAirplaneIconOutline,
  CogIcon as CogIconOutline,
  // UserCircleIcon as UserCircleIconOutline,
} from "@heroicons/react/outline";
import {
  HomeIcon,
  SearchIcon,
  PaperAirplaneIcon,
  CogIcon,
  // UserCircleIcon,
} from "@heroicons/react/solid";

const ListItem = memo(
  ({ children, onSelected, href = "/", horizontalSpacing = 0 }) => {
    const { pathname } = useRouter();
    return (
      <motion.li
        // animate
        onClick={() => typeof onSelected === "function" && onSelected(href)}
        className="relative"
        style={{
          marginLeft: horizontalSpacing,
          marginRight: horizontalSpacing,
        }}
      >
        <Link href={href}>
          <a>{children}</a>
        </Link>
        {pathname === href && (
          <div className="absolute w-full mt-1">
            <motion.div
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25.5,
              }}
              layoutId="indicator"
              className="bg-rose-500 rounded-full mx-auto block h-[0.35rem] w-[0.35rem]"
            />
          </div>
        )}
      </motion.li>
    );
  }
);

const NavBarContent = ({
  className,
  horizontalSpacing = 0,
  isMobileView = false,
}) => {
  const { pathname } = useRouter();
  const [selected, setSelected] = useState(pathname);

  const select = useCallback(
    (href) => {
      setSelected(href);
    },
    [selected]
  );

  return (
    <>
      <nav
        className={`${
          className ? className : ""
        } bottom-0 bg-white rounded-t-3xl border-2 border-t-slate-100 z-50`}
      >
        <div className="z-10 lg:px-0 px-8">
          <AnimateSharedLayout>
            <ol className="flex justify-between items-center lg:my-0 mb-5 mt-4">
              <ListItem
                href="/"
                horizontalSpacing={horizontalSpacing}
                selected={selected}
                onSelected={select}
              >
                {pathname === "/" ? (
                  <HomeIcon className="text-slate-900 h-6 w-6" />
                ) : (
                  <HomeIconOutline className="text-slate-500 h-6 w-6" />
                )}
              </ListItem>

              {isMobileView && (
                <ListItem
                  href="/search"
                  horizontalSpacing={horizontalSpacing}
                  selected={selected}
                  onSelected={select}
                >
                  {pathname === "/search" ? (
                    <SearchIcon className="text-slate-900 h-6 w-6" />
                  ) : (
                    <SearchIconOutline className="text-slate-500 h-6 w-6" />
                  )}
                </ListItem>
              )}

              {/* {session && (
                <ListItem
                  href={`/user/[userhandle]`}
                  horizontalSpacing={horizontalSpacing}
                  selected={selected}
                  onSelected={select}
                  pathParams={{
                    userhandle: session.user.userHandle
                  }}
                >
                  {pathname === `/user/[userhandle]` ? (
                    <UserCircleIcon className="text-slate-900 h-6 w-6" />
                  ) : (
                    <UserCircleIconOutline className="text-slate-500 h-6 w-6" />
                  )}
                </ListItem>
              )} */}

              <ListItem
                href="/inbox"
                horizontalSpacing={horizontalSpacing}
                selected={selected}
                onSelected={select}
              >
                {pathname === "/inbox" ? (
                  <PaperAirplaneIcon className="text-slate-900 -mr-[2px] mb-[2px] rotate-45 h-[1.4rem] w-[1.4rem]" />
                ) : (
                  <PaperAirplaneIconOutline className="text-slate-500 -mr-[2px] mb-[2px] rotate-45 h-[1.4rem] w-[1.4rem]" />
                )}
              </ListItem>

              {/* <ListItem
                href="/#upload-post"
                horizontalSpacing={horizontalSpacing}
                selected={selected}
                onSelected={select}
              >
                {pathname === "/#upload-post" ? (
                  <PlusCircleIcon className="text-slate-900 h-6 w-6" />
                ) : (
                  <PlusCircleIconOutline className="text-slate-500 h-6 w-6" />
                )}
              </ListItem> */}

              <ListItem
                href="/user/settings"
                horizontalSpacing={horizontalSpacing}
                selected={selected}
                onSelected={select}
              >
                {pathname === "/user/settings" ? (
                  <CogIcon className="text-slate-900 h-6 w-6" />
                ) : (
                  <CogIconOutline className="text-slate-500 h-6 w-6" />
                )}
              </ListItem>
            </ol>
          </AnimateSharedLayout>
        </div>
      </nav>
    </>
  );
};

function NavBar() {
  const [mobile, desktop] = useMatchMedia();
  return (
    <>
      {desktop ? (
        <Portal to="#app-bar-nav-slot">
          <NavBarContent
            className="border-none w-auto mr-2"
            horizontalSpacing="0.3rem"
          />
        </Portal>
      ) : (
        <NavBarContent isMobileView={true} className="fixed w-full" />
      )}
    </>
  );
}

export default NavBar;
