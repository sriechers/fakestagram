import { useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/solid";
import ChatMessage from "./ChatMessage";
import { v4 as uuidv4 } from "uuid";
import { useSubscription, useMutation } from "@apollo/client";
import { SUBSCRIPTION_CHAT_MESSAGES, ADD_CHAT_MESSAGE } from "../../db/queries";
import LoadingSpinner from "../LoadingSpinner";
function ChatWindow({ user, chatPartner, roomId, session }) {
  const messageInput = useRef();
  const chatContainerRef = useRef();

  const {
    data: messages,
    loading,
    error,
  } = useSubscription(SUBSCRIPTION_CHAT_MESSAGES, {
    variables: {
      roomId: roomId,
    },
    context: {
      headers: {
        authorization: session?.hasuraToken
          ? `Bearer ${session.hasuraToken}`
          : "",
      },
    },
  });

  const [addMessage, { error: addMessageError, loading: loadingMessage }] =
    useMutation(ADD_CHAT_MESSAGE, {
      context: {
        headers: {
          authorization: session?.hasuraToken
            ? `Bearer ${session.hasuraToken}`
            : "",
        },
      },
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = messageInput.current.innerHTML;
    console.log("input", input);
    if (input === "") return;

    // TODO sanitize text
    addMessage({
      variables: {
        fromUserId: user.id,
        toUserId: chatPartner.id,
        message: input,
        roomId: roomId,
      },
    });
    messageInput.current.innerHTML = "";
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    console.error("[ERROR CONNECTING TO CHAT]", error);
    return (
      <p className="text-center tracking-wide text-rose-500">
        There was an error connecting to the chat.
      </p>
    );
  }

  return (
    <div className="flex flex-col justify-between grow">
      <div
        ref={chatContainerRef}
        className="w-full h-full bg-slate-100 px-5 pt-3"
      >
        {messages?.chat_messages.map((message) => {
          return (
            <ChatMessage
              key={message.id}
              msg={message.message}
              user={message.fromUser}
              currentUser={user}
              date={message.createdAt}
            />
          );
        })}
      </div>
      <form
        onSubmit={(e) => handleSubmit(e)}
        method="POST"
        className="sticky bottom-0 left-0 w-full flex justify-between items-center bg-white px-6 py-3 shadow-xl shadow-slate-500"
      >
        <div className="grow flex items-center resize-none border-2 border-slate-100 rounded-2xl mr-3 px-5 py-1">
          <p
            role="input"
            ref={messageInput}
            name="message"
            className="w-full max-h-80 overflow-y-scroll bg-transparent placeholder-slate-400 placeholder-shown:text-sm resize-none text-slate-900 overflow-hidden focus:outline-none"
            contentEditable={true}
          ></p>
        </div>
        <button
          type="submit"
          className="flex items-center justify-center p-3 bg-blue-700 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full"
        >
          <PaperAirplaneIcon className="-mr-1 -mt-1 rotate-45 basis-5 h-5 w-5 grow-0 shrink-0 text-slate-100" />
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
