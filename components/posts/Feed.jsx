import Post from "./Post";
import LoadingSpinner from "../LoadingSpinner";
function Feed({ posts, loading, refetchPosts, className }) {
  return (
    <div
      className={`${className ? className : ""} ${
        loading || posts?.length === 0 ? "h-full" : ""
      } relative w-full flex flex-col gap-8`}
    >
      {loading && <LoadingSpinner />}
      {!posts ||
        (posts.length === 0 && (
          <>
            {/* <div className="relative h-[25.5rem]">
              <Image
                alt="no posts found"
                src="/img/not_found.svg"
                layout="fill"
                objectFit="cover"
              />
            </div> */}
            <p className="text-slate-400 text-center mt-4">
              there are no posts to display
            </p>
          </>
        ))}
      {posts?.map((post) => (
        <Post key={`post-${post.id}`} {...post} refetchPosts={refetchPosts} />
      ))}
    </div>
  );
}

export default Feed;
