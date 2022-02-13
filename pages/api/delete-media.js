import { unlink } from "fs/promises";
import path from "path";

const tmpUploadDir = path.resolve("./public/tmp", `./`);

export default async (req, res) => {
  if (req.method !== "DELETE") return res.status(501);
  const body = JSON.parse(req.body);
  const fileId = body.id;

  try {
    await unlink(tmpUploadDir + "/" + fileId);
    res.status(200).send(fileId);
  } catch (error) {
    console.error("[UNLINK FILE ERROR]", error.message);
    res.status(500);
  }
};
