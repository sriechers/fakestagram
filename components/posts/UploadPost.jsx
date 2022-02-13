import { useState, useEffect } from "react";
import MediaUpload from "../forms/MediaUpload";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import UserIcon from "../UserIcon";
import Button from "../Button";
import { useMutation } from "@apollo/client";
import { UPLOAD_POST, GET_POSTS } from "../../db/queries";
import LoadingSpinner from "../LoadingSpinner";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { CameraIcon as CameraIconOutline } from "@heroicons/react/outline";
import Modal from "../Modal";
import Image from "next/image";

function UploadPost(props) {
  const { register, handleSubmit, reset, control } = useForm();
  const [empty, setEmpty] = useState(true);
  const [files, setFiles] = useState([]);
  const { data: session } = useSession();
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const router = useRouter();

  const [uploadPost, { data, loading, error }] = useMutation(UPLOAD_POST, {
    refetchQueries: [GET_POSTS],
    context: {
      headers: {
        Authorization: session ? `Bearer ${session.hasuraToken}` : null,
      },
    },
  });

  const submit = async (formData) => {
    const media = files.map((file) => ({
      src: file.newFilename,
    }));
    const resMedia = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/move-temp-media`,
      {
        method: "POST",
        body: JSON.stringify(media),
      }
    );

    if (!resMedia.ok) return console.error("[MOVE TEMPORARY FILE]", resMedia);
    const { filePath } = await resMedia.json();
    uploadPost({
      variables: {
        userId: session.user.id,
        description: formData.description,
        media: JSON.stringify([
          {
            src: filePath,
          },
        ]),
      },
    });
  };

  useEffect(() => {
    if (!data) return;
    reset();
    setFiles([]);
    // router.push("/");
  }, [data]);

  return (
    <motion.form
      onSubmit={handleSubmit(submit)}
      {...props}
      onViewportEnter={({ target }) => {
        target.querySelector("textarea").focus();
      }}
    >
      <div className="relative overflow-hidden bg-card">
        {loading && !error && (
          <div className="absolute top-0 left-0 h-full w-full z-30 bg-white bg-opacity-90">
            <LoadingSpinner />
          </div>
        )}
        <Modal open={showMediaUpload} onClose={() => setShowMediaUpload(false)}>
          <div className="min-w-md w-[60vw] max-w-xl flex justify-center items-center">
            <div className="w-full">
              <h3 className="text-slate-900 text-center">Upload Media</h3>
              <hr className="my-4" />
              <MediaUpload
                existingFiles={files}
                onAfterUpload={(fileData) => {
                  setFiles((prev) => [...prev, fileData]);
                }}
                onAfterDelete={(id) => {
                  setFiles((prev) =>
                    prev.filter((file) => file.newFilename !== id)
                  );
                }}
              />
              <hr className="my-4" />
            </div>
          </div>
        </Modal>

        <div className="flex">
          <div className="mr-4">
            <UserIcon user={session?.user} height="3rem" width="3rem" />
          </div>
          <div className="grow flex flex-col relative">
            <textarea
              autoFocus={true}
              name="comment"
              className="placeholder:text-slate-400 bg-transparent resize-none h-32 w-full pr-3 pb-2 pt-3 outline-none text-slate-700 rounded-md"
              placeholder="write something…"
              type="text"
              {...register("description", {
                required: true,
                maxLength: 1200,
                onChange: (e) => {
                  setEmpty(!(e.target.value.length > 0));
                },
              })}
            />
            {files.length > 0 && (
              <>
                <span className="text-slate-400 tracking-wide text-sm">
                  Files:
                </span>
                <div className="flex justify-start flex-wrap mb-3 mt-1 gap-5">
                  {files.map((file) => (
                    <Image
                      key={"filepreview-" + file.newFilename}
                      src={`/tmp/${file.newFilename}`}
                      alt="a uploaded file"
                      layout="fixed"
                      className="rounded-md"
                      height="64px"
                      width="80px"
                      quality={30}
                      objectFit="cover"
                    />
                  ))}
                </div>
              </>
            )}
            <div className="flex justify-between items-center gap-4">
              <button
                onClick={() => setShowMediaUpload(true)}
                className="bg-slate-200 rounded-xl p-2 hover:bg-slate-300 transition duration-50 ease-out"
              >
                <CameraIconOutline className="h-7 w-7 text-slate-600" />
              </button>
              <Button
                type="submit"
                disabled={empty}
                className={`${
                  empty ? "text-blue-500 opacity-60" : "text-white"
                } placeholder-slate-300 tracking-wide font-medium grow`}
              >
                post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.form>
  );
}

export default UploadPost;
