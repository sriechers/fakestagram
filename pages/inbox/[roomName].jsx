import Head from "next/head";
import { LayoutOnlyNav } from "../../components/Layout";
import { getSession } from "next-auth/react";
import ChatWindow from "../../components/chat/ChatWindow";
import { apolloClient } from "../../db";
import {
  GET_USER_BY_HANDLE,
  GET_CHAT_ROOM,
  CREATE_CHAT_ROOM,
} from "../../db/queries";
import { hasuraRequest } from "../../util/HasuraAdapter";
function ChatRoom({ session, chatPartner, roomId, roomName }) {
  return (
    <>
      <Head>
        <title>Chat with {chatPartner.displayName}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=" h-screen flex flex-col">
        <ChatWindow
          roomId={roomId}
          user={session?.user}
          session={session}
          chatPartner={chatPartner}
        />
      </div>
    </>
  );
}

ChatRoom.getLayout = function getLayout(page) {
  return <LayoutOnlyNav>{page}</LayoutOnlyNav>;
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { data: userData, error: userError } = await apolloClient.query({
    query: GET_USER_BY_HANDLE,
    context: {
      headers: {
        authorization: session.hasuraToken
          ? `Bearer ${session.hasuraToken}`
          : "",
      },
    },
    variables: {
      userHandle: context.query.roomName,
    },
  });

  if (userError) {
    return {
      notFound: true,
    };
  }

  // try to get the chat room with the name specified as the path (roomName)
  const { data: chatRoomData, error: chatRoomNameError } = await hasuraRequest({
    query: GET_CHAT_ROOM,
    variables: {
      roomName: context.query.roomName,
    },
  });

  if (chatRoomNameError) {
    console.error("[ERROR GETTING CHAT ROOM]", chatRoomNameError);
    return {
      notFound: true,
    };
  }

  // If room does not exist, create one
  let newChatRoomData = null;
  if (chatRoomData?.chat_rooms.length <= 0) {
    const { data: _newChatRoomData, error: chatRoomCreateError } =
      await hasuraRequest({
        query: CREATE_CHAT_ROOM,
        variables: {
          roomName: context.query.roomName,
        },
      });

    if (chatRoomCreateError) {
      console.error("[ERROR CREATING CHAT ROOM]", chatRoomCreateError);
      return {
        notFound: true,
      };
    }

    newChatRoomData = _newChatRoomData;
  }

  return {
    props: {
      chatPartner: userData.users[0],
      roomName:
        chatRoomData?.chat_rooms[0].name || newChatRoomData?.chat_rooms[0].name,
      roomId:
        chatRoomData?.chat_rooms[0].id || newChatRoomData?.chat_rooms[0].id,
      session,
    },
  };
}

export default ChatRoom;
