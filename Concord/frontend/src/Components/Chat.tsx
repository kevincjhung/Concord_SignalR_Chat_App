import { useEffect, useState, useRef } from "react";
import useSignalR from "../useSignalR";
import "../App.css";

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import PersistentDrawer from "./PersistentDrawer";

type Message = {
  id: number;
  text: string;
  userName: string;
  created: Date;
  channelId: number;
}

type MessageProps = {
  message: Message;
}



// const MessageBubble = ({ message }: MessageProps) => {
//   const { text, userName } = message;

//   return (
//     <div className="messageBubble">
//       <div className="messageUserName">{userName}</div>
//       <div className="messageText">{text}</div>
//     </div>
//   );
// };

export default function Chat({ }) {
  // Establish SignalR connection
  const { connection } = useSignalR("/r/chat");

  // useState
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newChannelName, setNewChannelName] = useState("");

  // TODO: fetch the actual list of channels from backend
  const [channels, setChannels] = useState(["3", "4"]);

  // Scroll to the bottom of messages
  const messageEndRef = useRef<HTMLDivElement>(null);

  // TODO: make this dynamic, fetch current list of channels from backend
  const [currentChannel, setCurrentChannel] = useState("3");


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

    // TODO: implement infinite scroll, so that when you scroll to the top, you get more messages

    // this gets called whenever you receive a message from the backend
    connection.on("ReceiveMessage", (message: Message) => {
      // console.log("App.tsx: received message from backend")
      // console.log(`received message from backend: \n ${message}`)
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
        console.log("App.tsx: getting all the channels from backend, the channels are:")
        console.log(data)
        // setChannels(data);
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

  const handleCreateChannel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
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
  
    // Add the new channel to the list of channels
    setChannels((channels) => [...channels, newChannel.name]);
  
    // Set the current channel to the new channel
    setCurrentChannel(newChannel.name);
  
    // Clear the input field
    setNewChannelName("");
  };

  

  return (
    <>
      <PersistentDrawer channels={channels}/>
    </> 
  )
}
