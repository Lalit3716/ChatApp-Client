import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import authContext from "../../contexts/authContext";
import { friendsContext } from "../../contexts/friendsContext";
import useHttp from "../../hooks/useHttp";
import { Request } from "../../utils/request";
import ChatBox from "../Chats/ChatBox";
import MessageBox from "../Utils/InputBar";
import { User } from "../../interfaces/auth";
import { Chat } from "../../interfaces/chat";

const Room = () => {
  const { friendId } = useParams();
  const [friend, setFriend] = useState<User | undefined>();
  const { isLoading, sendRequest } = useHttp();
  const { user, socket } = useContext(authContext);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const { friends } = useContext(friendsContext);

  useEffect(() => {
    if (friends) {
      const friend = friends.find(f => f._id === friendId);
      setFriend(friend);
    }
  }, [friends, friendId]);

  useEffect(() => {
    if (!user || !socket) return;
    const roomId = [user._id, friendId].sort().join("-");

    socket!.emit("joinRoom", roomId);

    socket!.on("message", chat => {
      setChats(prevChats => [...prevChats, chat]);
    });
  }, [socket, friendId]);

  useEffect(() => {
    const roomId = [user!._id, friendId].sort().join("-");
    const url = `http://localhost:8000/chats/${roomId}`;
    sendRequest(
      () => Request.get(url),
      {},
      (data: Chat[]) => {
        setChats(data);
      }
    );

    return () => {
      socket?.off("message");
      socket?.emit("leaveRoom", roomId);
    };
  }, [friendId]);

  const sendMessage = () => {
    if (!message) return;

    const chat: Chat = {
      sender: user!._id,
      receiver: friendId!,
      message,
      createdAt: new Date(),
    };

    setMessage("");

    socket!.emit("message", chat);
  };

  return (
    <div className="h-full flex-1 flex flex-col">
      <div className="flex items-center p-2 bg-slate-100 dark:bg-gray-700">
        <img
          src={`https://avatars.dicebear.com/api/initials/${friend?.username}.svg`}
          alt="avatar"
          className="w-10 h-10 rounded-full mr-4"
        />
        <div className="text-sm">
          <h1 className="text-gray-800 dark:text-gray-100 font-semibold">
            {friend?.username}
          </h1>
          <p className="dark:text-gray-300 text-gray-500">{friend?.email}</p>
        </div>
      </div>
      <div className="overflow-auto p-4 dark:text-gray-200 flex-1">
        {!isLoading &&
          chats.map((chat, index) => (
            <ChatBox
              key={index}
              message={chat.message}
              isAuthor={chat.sender === user!._id}
              date={new Date(chat.createdAt)}
            />
          ))}
      </div>
      <div className="p-4">
        <MessageBox
          value={message}
          onChange={setMessage}
          icon="paper-plane"
          error={false}
          onSubmit={sendMessage}
        />
      </div>
    </div>
  );
};

export default Room;
