// Libraries
import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import "../App.css";

// MaterialUI
import { List, ListItem, TextField } from '@mui/material';

// Components
import PersistentDrawer from "./PersistentDrawer";
import CurrentUserMessageBubble from './CurrentUserMessageBubble';
import OtherUserMessageBubble from './OtherUserMessageBubble';

// Custom Hook
import useSignalR from "../useSignalR";

// Import Types
import { Message } from "common";


export default function Chat() {

  // Establish SignalR connection
  const { connection } = useSignalR("/r/chat");

  // useState
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newChannelName, setNewChannelName] = useState("");
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState("4");

  // TODO: Current user is hardcoded for now, will be replaced with authentication
  const [currentUser, setCurrentUser] = useState("Ahmed Khan");

  // Scroll to the bottom of messages
  const messageEndRef = useRef<HTMLDivElement>(null);

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
        console.log("App.tsx: getting all the messages from backend, the messages are:")
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

    // send message to the server over REST
    const result = await fetch(`/api/Message/channel/${currentChannel}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "Text": input,
        "UserId": 1 
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      return data
    })
    .catch((error) => {
      console.error(error);
  });

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


  const handleChannelClick = (channelId: string) => {
    setCurrentChannel(channelId.toString());
  };


  return (
    <div className='flex flex-col items-center'>
      <PersistentDrawer channels={channels} currentChannel={currentChannel} onChannelClick={handleChannelClick} />
      <div className="w-full max-w-[927px] min-w-[600px] p-4">
        <List
          sx={{
            overflowY: 'scroll',
            height: 'calc(100vh - 200px)',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
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
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 mx-4 ">
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
