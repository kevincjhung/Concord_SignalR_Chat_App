import React from "react";

import Avatar from "@mui/material/Avatar";

// import typescript types
import { Message } from "common";


type CurrentUserMessageBubbleProps = {
  message: Message;
};

const CurrentUserMessageBubble: React.FC<CurrentUserMessageBubbleProps> = ({ message }) => {
    return (
      <div className="chat-bubble-current bg-blue-500 text-white p-4 rounded-lg max-w-[387px] ml-auto ">
        <div className="flex flex-col items-start"> 
          <div className="flex items-center space-x-2 mb-4">
            <Avatar alt="" src="" />
            <p className="font-bold">{message.userName}</p>
          </div>
        </div>
        <p>{message.text}</p>
        <p className="text-xs mt-4">{message.created.toLocaleString()}</p>
      </div>
    );
  };

export default CurrentUserMessageBubble;
