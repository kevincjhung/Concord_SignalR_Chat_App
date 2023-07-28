import React from "react";
import Avatar from "@mui/material/Avatar";

// import typescript types
import { Message } from "common";


type OtherUserMessageBubbleProps = {
	message: Message;
};


const OtherUserMessageBubble: React.FC<OtherUserMessageBubbleProps> = ({ message }) => {
	return (
		<div className="chat-bubble-current bg-gray-200 p-2 rounded-lg max-w-[387px] mr-auto p-4">
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

export default OtherUserMessageBubble;



