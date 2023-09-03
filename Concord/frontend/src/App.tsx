import { useEffect, useState, useRef } from "react";
import useSignalR from "./useSignalR";
import "./App.css";
import Chat from "./components/Chat";





export default function App() {

  return (
    <>
      <Chat />
    </>
  );
}
