import { hasuraRequest } from "../../util/HasuraAdapter";
import { CREATE_CHAT_ROOM } from "../../db/queries";
export default async (req, res) => {
  console.log("test", req);
  // const { data, error } = await hasuraRequest({
  //   query: CREATE_CHAT_ROOM,
  //   variables: {
  //     roomName: context.query.roomName,
  //   },
  // });

  // if (error) {
  //   console.error("[ERROR CREATING CHAT ROOM]", error);
  // }
  res.send("test");
};
