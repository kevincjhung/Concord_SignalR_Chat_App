// Libraries
import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import "../App.css";

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { List, ListItem, Avatar, TextField } from '@mui/material';

// Components
import PersistentDrawer from "./PersistentDrawer";

// Custom Hook
import useSignalR from "../useSignalR";

// Style for the modal
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type Message = {
  id: number;
  text: string;
  userName: string;
  created: Date;
  channelId: number;
}



export default function Chat() {

  // Establish SignalR connection
  const { connection } = useSignalR("/r/chat");

  // useState
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newChannelName, setNewChannelName] = useState("");


  // TODO: fetch the actual list of channels from backend
  const [channels, setChannels] = useState([]);

  // TODO: make this dynamic, fetch current list of channels from backend
  const [currentChannel, setCurrentChannel] = useState("3");

  // TODO: Current user is hardcoded for now. Make currernt user messages on the right, everyone else's on the left 
  const [currentUser, setCurrentUser] = useState("witty_wordsmith");

  // Scroll to the bottom of messages
  const messageEndRef = useRef<HTMLDivElement>(null);


  type CurrentUserMessageBubbleProps = {
    message: Message;
  };

  type OtherUserMessageBubbleProps = {
    message: Message;
  };

  // New component for the current user's message bubble
  const CurrentUserMessageBubble: React.FC<CurrentUserMessageBubbleProps> = ({ message }) => {
    return (
      <div className="chat-bubble-current flex flex-col items-start bg-blue-500 text-white p-2 rounded-lg max-w-[387px] ml-auto">
        <p>{message.text}</p>
        <div className="text-xs mt-4">{message.created.toLocaleString()}</div>
      </div>
    );
  };

  // New component for other users' message bubble
  const OtherUserMessageBubble: React.FC<OtherUserMessageBubbleProps> = ({ message }) => {
    return (
      <div className="chat-bubble-other flex flex-col items-start bg-gray-200 p-2 rounded-lg max-w-[387px]">
        <p>{message.text}</p>
        <p className="text-xs mt-4">
          {message.created.toLocaleString()}
        </p>
      </div>
    );
  };



  useEffect(() => {
    // If not connected yet, return
    if (!connection) {
      return
    }

    // Join room 1   
    connection.invoke("AddToGroup", currentChannel)
      .catch(function (err) {
        return console.error(err.toString());
      })

    // Get all the messages from backend for channel 1
    fetch(`/api/Message/channel/${currentChannel}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log("App.tsx: getting all the messages from backend, the messages are:")
        setMessages(data.map((m: Message) => ({ ...m, created: new Date(m.created) })));
      })
      .catch((error) => {
        console.error(error);
      });


    // this gets called whenever you receive a message from the backend
    connection.on("ReceiveMessage", (message: Message) => {
      // console.log("App.tsx: received message from backend")
      console.log(`received message from backend: \n ${message}`)
      message.created = new Date(message.created);
      setMessages(messages => [...messages, message]);
    })

    return () => {
      connection.invoke("LeaveRoom", currentChannel)
        .catch(function (err) {
          return console.error(err.toString());
        })

      connection.off("ReceiveMessage");
    }
  }, [connection, currentChannel]) // when currentChannel changes, fetch messages from new channel


  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  // use useEffect to fetch list of channels from backend
  useEffect(() => {
    fetch(`/api/Channels`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setChannels(data)
      })
      .catch((error) => {
        console.error(error);
      });
  }, [])



  /*   HANDLE FUNCTIONS  */

  // Send message to backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // This is how you send message to the server over signalR, currently using REST implementation
    // connection?.invoke("SendMessage", input); 

    // send message to the server over REST
    const result = await fetch(`/api/Message/channel/${currentChannel}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: input,
        userName: "witty_wordsmith"
      })
    })
      .then(res => res.json())


    console.log("App.tsx: sending message to backend, the message is:")
    console.log(result)
  }

  const handleDelete = async (channel: string) => {
    console.log('delete button clicked')

    // delete channel from backend
    await fetch(`/api/Channels/${channel}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    // delete the channel from the list of channels
    setChannels(channels.filter(c => c !== channel))

    // set current channel to the first channel in the list
    setCurrentChannel(channels[0])
  }

  const handleCreateChannel = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Create new channel in backend
    const newChannel = await fetch(`/api/Channels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newChannelName,
      }),
    }).then((res) => res.json());

    // TODO: Add the new channel to the list of channels
    // setChannels((channels) => [...channels, newChannel.name]);

    // Set the current channel to the new channel
    setCurrentChannel(newChannel.name);

    // Clear the  field
    setNewChannelName("");
  };

  // min 555 max 1047

  return (
    <div className='flex flex-col items-center'>
      <PersistentDrawer channels={channels} />
      <div className="w-full max-w-[927px] min-w-[600px]">
        <List
          sx={{
            overflowY: 'scroll',
            maxHeight: '850px',
            padding: '0',
            '&::-webkit-scrollbar': {
              display: 'none'},
            backgroundColor: '#fff',
            
          }}
        >
          {messages.map((message) => (
            <ListItem key={message.id}>
              {message.userName === currentUser ? (
                <CurrentUserMessageBubble message={message} />
              ) : (
                <OtherUserMessageBubble message={message} />
              )}
            </ListItem>
          ))}
        </List>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 m-4 ">
          <TextField
            id="outlined-basic"
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
            multiline
            maxRows={4}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Send
          </button>
        </form>
        </div>
    </div>
  )
}
