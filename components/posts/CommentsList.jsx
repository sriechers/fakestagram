import { useState, useEffect } from "react";
import Comment from "./Comment";
import { useForm } from "react-hook-form";
import LoadingSpinner from "../LoadingSpinner";
function CommentsList({
  loadingAfterSubmit = false,
  open = false,
  comments = [],
  onCommentsUpdate,
}) {
  const [empty, setEmpty] = useState(true);
  const { register, handleSubmit, reset } = useForm();

  const submit = ({ comment }) => {
    typeof onSubmit === "function" && onSubmit(comment);
    typeof onCommentsUpdate === "function" &&
      onCommentsUpdate("insert", comment);
  };

  // Empty Comment field after loading
  useEffect(() => {
    if (!loadingAfterSubmit) reset();
  }, [loadingAfterSubmit]);

  return (
    <div className="border-t-2 border-slate-200 mt-3">
      {comments.length > 0 && open && (
        <div className="border-b-2 border-slate-200 py-2">
          {comments.map((comment) => (
            <Comment
              key={`comment-${comment.id}`}
              user={comment.user}
              onCommentsUpdate={onCommentsUpdate}
              {...comment}
            />
          ))}
        </div>
      )}
      <form
        onSubmit={handleSubmit(submit)}
        className="relative flex justify-between items-center mt-1"
      >
        <textarea
          name="comment"
          rows="1"
          disabled={loadingAfterSubmit}
          className={`${
            loadingAfterSubmit ? "opacity-50" : ""
          } resize-none w-full py-2 outline-none text-slate-700 placeholder:text-[0.9rem] text-[0.95rem]`}
          placeholder="comment this post…"
          type="text"
          {...register("comment", {
            onChange: (e) => {
              setEmpty(!(e.target.value.length > 0));
            },
          })}
        />
        <button
          type="submit"
          disabled={empty || loadingAfterSubmit}
          className={`${
            empty ? "text-blue-200" : "text-blue-500"
          } placeholder-slate-300 tracking-wide font-medium`}
        >
          post
        </button>
        {loadingAfterSubmit && (
          <div className="w-full h-full absolute flex justify-center items-center transform scale-90 opacity-50">
            <LoadingSpinner />
          </div>
        )}
      </form>
    </div>
  );
}

export default CommentsList;
