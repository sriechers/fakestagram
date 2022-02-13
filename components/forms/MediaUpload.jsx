import { useState, useEffect } from "react";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function MediaUpload({
  onFiles,
  onAfterUpload,
  onFormData,
  onAfterDelete,
  existingFiles,
}) {
  const [files, setFiles] = useState([]);
  // const [ref, setRef] = useState(null);

  useEffect(() => {
    if (files.length > 0) {
      typeof onFiles === "function" && onFiles(files);
    }
  }, [files]);

  const deleteFile = async (uniqueFileId, load, error) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/delete-media`,
      {
        method: "DELETE",
        body: JSON.stringify({
          id: uniqueFileId,
        }),
      }
    );
    if (!res.ok) return error();

    typeof onAfterDelete === "function" && onAfterDelete(uniqueFileId);

    load();
  };

  const defaultFiles = existingFiles.map((file) => {
    return {
      source: "/tmp/" + file.newFilename,
      options: {
        type: "limbo",
      },
    };
  });
  return (
    <FilePond
      files={files}
      onupdatefiles={setFiles}
      // ref={(ref) => {
      //   setRef(ref);
      // }}
      allowMultiple={false}
      maxParallelUploads={1}
      maxFiles={1}
      dropOnPage={true}
      instantUpload={true}
      allowReorder={true}
      credits={false}
      server={{
        process: {
          url: `${process.env.NEXT_PUBLIC_HOST}/api/upload-media`,
          onload: (response) => {
            const res = JSON.parse(response);
            typeof onAfterUpload === "function" && onAfterUpload(res);
            return res.newFilename;
          },
          ondata: (formData) => {
            typeof onFormData === "function" && onFormData(formData);
            return formData;
          },
        },
        revert: deleteFile,
        remove: deleteFile,
        restore: {
          method: "GET",
          url: `${process.env.NEXT_PUBLIC_HOST}/api/load-temp-media`,
        },
      }}
      name="uploadedFiles"
      labelIdle='Drag & Drop your files or <span class="filepond--label-action">browse</span>'
    />
  );
}

export default MediaUpload;
