import { chmod, rename } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";

const tmpUploadDir = path.resolve("./public/tmp", `./`);

export default async (req, res) => {
  if (req.method !== "POST") return res.status(501);
  const media = JSON.parse(req.body);

  media.forEach(async (file) => {
    const uploadId = `${Date.now()}`;
    const uploadDir = `./public/uploads/${uploadId}`;
    const newPath = path.resolve(`${uploadDir}/${file.src}`, `./`);

    try {
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir);
        await chmod(uploadDir, 0o775);
      }

      await rename(tmpUploadDir + "/" + file.src, newPath);
      res.status(200).json({
        filePath: `/uploads/${uploadId}/${file.src}`,
      });
    } catch (error) {
      console.error("[UNLINK FILE ERROR]", error.message);
      res.status(500);
    }
  });
};
