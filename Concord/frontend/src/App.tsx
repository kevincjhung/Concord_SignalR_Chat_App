import { useEffect, useState, useRef } from "react";
import useSignalR from "./useSignalR";
import "./App.css";
import Chat from "./Components/Chat";
import Sidebar from "./Components/Sidebar";




export default function App() {

  return (
    <>
      <Chat />
    </>
  );
}
