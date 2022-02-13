import { readFileSync } from "fs";

export default async (req, res) => {
  if (req.method !== "GET") return res.status(501);
  console.log(req.query);

  try {
    const data = readFileSync(req.query, "utf8");
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
