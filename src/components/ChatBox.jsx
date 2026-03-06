
import React,{useState,useEffect} from "react";
import socket from "../services/socket";

export default function ChatBox(){

 const[msg,setMsg]=useState("");
 const[messages,setMessages]=useState([]);

 useEffect(()=>{
   socket.on("chat",(m)=>{
     setMessages(prev=>[...prev,"Stranger: "+m]);
   });
 },[]);

 const send=()=>{
   socket.emit("chat",msg);
   setMessages(prev=>[...prev,"You: "+msg]);
   setMsg("");
 };

 return (
  <div style={{marginTop:20}}>
   <h3>Chat</h3>
   <div style={{height:150,overflow:"auto",border:"1px solid gray"}}>
    {messages.map((m,i)=><div key={i}>{m}</div>)}
   </div>
   <input value={msg} onChange={e=>setMsg(e.target.value)}/>
   <button onClick={send}>Send</button>
  </div>
 )
}
