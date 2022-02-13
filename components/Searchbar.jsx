import { useEffect, useState } from "react";
import { SearchIcon } from "@heroicons/react/outline";
import { useForm } from "react-hook-form";
import { useLazyQuery, gql } from "@apollo/client";
import { SEARCH } from "../db/queries";
import { useSession } from "next-auth/react";
import Image from "next/image";
import truncateString from "../util/truncateString";
import Link from "next/link";
import { debounce } from "lodash";
import LoadingSpinner from "./LoadingSpinner";
import UserIcon from "./UserIcon";

export function SearchResults({ searchResult, loading, className }) {
  const parseMedia = (post) => {
    if (post?.media) {
      const media = JSON.parse(post.media);
      return media;
    }
    return [];
  };

  return (
    <>
      {searchResult && (
        <ul
          className={`${
            className ? className : ""
          } box-border bg-white rounded-b-md px-4 py-2`}
        >
          {loading && (
            <li key="searchlist-loader" className="relative">
              <LoadingSpinner className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </li>
          )}
          {searchResult.posts.map((post, i) => (
            <li
              key={"searchlist-post-" + post.id}
              className={`${
                i !== 0 ? "border-t-2 border-t-slate-100" : ""
              } py-3`}
            >
              <div className="flex justify-start items-center">
                {parseMedia(post).length > 0 && (
                  <Image
                    className="rounded-md"
                    src={parseMedia(post)[0].src}
                    layout="fixed"
                    objectFit="cover"
                    height={56}
                    width={85}
                  />
                )}
                <div className="ml-3">
                  <Link
                    href={{
                      pathname: "/user/[userhandle]",
                      query: {
                        userhandle: post.user.userHandle,
                      },
                    }}
                  >
                    <a className="text-slate-800 text-base">
                      {post.user.displayName}
                    </a>
                  </Link>
                  <p className="text-slate-600 text-sm">
                    {truncateString(post.description, 40)}
                  </p>
                </div>
              </div>
            </li>
          ))}
          {searchResult.users.map((user, i) => (
            <li
              key={"searchlist-user-" + user.id}
              className={`${
                i !== 0 ? "border-t-2 border-t-slate-100" : ""
              } py-3`}
            >
              <Link
                href={{
                  pathname: "/user/[userhandle]",
                  query: {
                    userhandle: user.userHandle,
                  },
                }}
              >
                <a className="flex items-center">
                  <UserIcon user={user} />
                  <div className="ml-3">
                    <p className="text-slate-800 text-base">
                      {user.displayName}
                    </p>

                    <p className="text-slate-600 text-sm">{user.userHandle}</p>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Searchbar({
  placeholderText,
  onSubmit,
  onSearch,
  className,
  showSuggestions = true,
}) {
  const { register, handleSubmit } = useForm();
  const { data: session } = useSession();
  const [showSuggestionsField, setShowSuggestionsField] = useState(false);

  const [startSearch, { data: searchResult, loading, error }] = useLazyQuery(
    gql`
      ${SEARCH}
    `,
    {
      context: {
        headers: {
          authorization: session?.hasuraToken
            ? `Bearer ${session.hasuraToken}`
            : "",
        },
      },
    }
  );
  const submit = (data) => {
    if (!data.search.length) return;
    startSearch({
      variables: {
        search: `%${data.search}%`,
      },
    });
    typeof onSubmit === "function" && onSubmit(data.search);
  };

  const search = debounce((query) => {
    if (!query.length) return;
    startSearch({
      variables: {
        search: `%${query}%`,
      },
    });
  }, 500);

  useEffect(() => {
    if (searchResult !== undefined) {
      setShowSuggestionsField(true);
      typeof onSearch === "function" && onSearch(searchResult);
    } else {
      setShowSuggestionsField(false);
    }
  }, [searchResult]);

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit(submit)}
        autoComplete="off"
        className={`${
          className ? className : ""
        } flex group ring-0 relative items-center py-1 px-2 rounded-full focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-50 focus-within:ring-blue-200 transition duration-50 ease-out`}
      >
        <div className="absolute left-0 top-0 h-full w-full bg-slate-100 rounded-full -z-10"></div>
        <SearchIcon className="h-5 w-5 basis-5 grow-0 shrink-0 ml-1 text-slate-900 stroke-2" />
        <div className="relative grow flex justify-between items-center">
          <input
            {...register("search")}
            type="search"
            onChange={(e) => search(e.target.value)}
            placeholder={placeholderText}
            className="placeholder:text-slate-400 focus:outline-none mb-[2px] grow bg-transparent py-1 px-2 placeholder:text-xs text-sm tracking-wide text-slate-800"
          />
        </div>
        {loading && (
          <div className="transform scale-75 absolute right-6 opacity-40">
            <LoadingSpinner className="absolute top-1/2 right-2 transform -translate-y-1/2" />
          </div>
        )}
      </form>
      {showSuggestions && (
        <SearchResults
          className="absolute min-w-[30rem] max-w-full shadow-lg border-b-2 border-b-slate-200 top-12 left-1/2 transform -translate-x-1/2"
          searchResult={searchResult}
          loading={loading}
        />
      )}
    </div>
  );
}

export default Searchbar;
