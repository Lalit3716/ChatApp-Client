import { FC } from "react";
import formatDate from "../../utils/formatDate";

interface Props {
  message: string;
  isAuthor: boolean;
  date: Date;
  seen: boolean;
}

const ChatBox: FC<Props> = props => {
  const { message, isAuthor } = props;
  const date = formatDate(props.date);

  return (
    <div
      className={`flex flex-col justify-center p-2 relative shadow-lg mb-2 rounded max-w-lg ${
        isAuthor
          ? "ml-auto dark:bg-green-700 bg-green-100"
          : "mr-auto dark:bg-slate-600 bg-blue-100"
      }`}
      style={{
        minWidth: "200px",
      }}
    >
      <div className="text-gray-800 dark:text-gray-200">{message}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{date}</div>
      {isAuthor && (
        <span
          className={`absolute text-xs ${
            props.seen ? "text-blue-400" : "dark:text-gray-300 text-gray-500"
          } bottom-1 right-1.5`}
        >
          <i className="fas fa-check" />
          {props.seen && (
            <i className="fas fa-check absolute right-1.5 bottom-0.5" />
          )}
        </span>
      )}
    </div>
  );
};

export default ChatBox;
