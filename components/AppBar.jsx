import { ChevronLeftIcon, XIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import ProfileWidget from "./ProfileWidget";
import { Scaffold } from "./Layout";
import Searchbar from "./Searchbar";
function AppBar({ onCancel, backIconType = "arrow", redirectBack = true }) {
  const router = useRouter();
  let title = "";

  switch (router.pathname) {
    case "/user/upload":
      title = "Upload a Post";
      break;

    case "/user/settings":
      title = "Update your Settings";
      break;

    case "/user/[userhandle]":
      title = "Profile";
      break;

    case "/user/followers":
      title = "Your Followers";
      break;

    case "/inbox":
      title = "Your Messages";
      break;

    // case "/profile":
    //   title = "Profile"
    //   break;
    default:
      title = "";
      break;
  }

  return (
    <div className="bg-white sticky top-0 left-0 w-full z-50 border-b-2 border-b-slate-100">
      <Scaffold>
        <header className="flex justify-between items-center sticky top-0 left-0 z-40 w-full py-4">
          {router.pathname === "/" ? (
            <div className="uppercase font-bold">Fakestagram</div>
          ) : (
            <button
              className="group hover:ring-offset-white hover:ring-2 ring-slate-300 ring-offset-2 rounded-full bg-slate-900 p-1 transition all duration-150 ease-out felx justify-center items-center"
              onClick={() => {
                redirectBack
                  ? router.back()
                  : typeof onCancel === "function" && onCancel();
              }}
            >
              {backIconType === "arrow" ? (
                <ChevronLeftIcon
                  className={`text-gray-100 h-3 w-3 stroke-path-4`}
                />
              ) : (
                <XIcon className={`text-gray-100 h-3 w-3 stroke-2`} />
              )}
            </button>
          )}
          <div className="grow">
            {router.pathname === "/" ? (
              <Searchbar
                className={`md:flex hidden transform lg:-translate-x-3 lg:max-w-md md:max-w-xs max-w-10 mx-auto`}
                placeholderText="search…"
              />
            ) : (
              <p className="ml-[3%] px-4 text-center w-full md:text-xl text-base tracking-wide font-bold text-slate-900 box-border">
                {title}
              </p>
            )}
          </div>
          <div className="flex justify-between items-center">
            <div id="app-bar-nav-slot"></div>
            <ProfileWidget />
          </div>
        </header>
      </Scaffold>
    </div>
  );
}

export default AppBar;
