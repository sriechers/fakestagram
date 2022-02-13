import formidable from "formidable";
import path from "path";

const tmpUploadDir = path.resolve("./public/tmp", `./`);

const form = formidable({
  multiples: true,
  uploadDir: tmpUploadDir,
  keepExtensions: true,
});

export default async (req, res) => {
  if (req.method !== "POST") return res.status(501);
  const contentType = req.headers["content-type"];
  if (contentType && contentType.indexOf("multipart/form-data") !== -1) {
    form.parse(req, (err, fields, files) => {
      if (!err) {
        // Name of filepond name attribute / option
        const { uploadedFiles } = files;
        res.json({
          originalName: uploadedFiles.originalFilename,
          newFilename: uploadedFiles.newFilename,
        });
        return;
      } else {
        console.error("[UPLOADING FILE FAILED]", err);
        res.status(500);
        return;
      }
    });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
