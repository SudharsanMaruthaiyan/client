
import React,{useEffect,useRef,useState} from "react";
import socket from "../services/socket";
import useWebRTC from "../hooks/useWebRTC";
import ChatBox from "./ChatBox";

export default function VideoChat(){

 const localVideo=useRef();
 const remoteVideo=useRef();
 const {peer,createPeer}=useWebRTC(socket);

 const[users,setUsers]=useState(0);

 useEffect(()=>{

  startCamera();

  socket.on("matched",createOffer);
  socket.on("offer",handleOffer);
  socket.on("answer",handleAnswer);
  socket.on("ice-candidate",handleCandidate);

  socket.on("user-count",(c)=>setUsers(c));

 },[]);

 const startCamera=async()=>{

  const stream=await navigator.mediaDevices.getUserMedia({
   video:true,
   audio:true
  });

  localVideo.current.srcObject=stream;

  const pc=createPeer(stream);

  pc.ontrack=(e)=>{
    remoteVideo.current.srcObject=e.streams[0];
  };
 };

 const createOffer=async()=>{

   const offer=await peer.current.createOffer();
   await peer.current.setLocalDescription(offer);

   socket.emit("offer",offer);
 };

 const handleOffer=async(offer)=>{

   await peer.current.setRemoteDescription(offer);

   const answer=await peer.current.createAnswer();

   await peer.current.setLocalDescription(answer);

   socket.emit("answer",answer);
 };

 const handleAnswer=async(answer)=>{
   await peer.current.setRemoteDescription(answer);
 };

 const handleCandidate=async(candidate)=>{
   await peer.current.addIceCandidate(candidate);
 };

 const next=()=>{
   socket.emit("next");
   window.location.reload();
 };

 return (
  <div>

   <p>Online Users: {users}</p>

   <video ref={localVideo} autoPlay muted width="300"/>
   <video ref={remoteVideo} autoPlay width="300"/>

   <br/>
   <button onClick={next}>Next Stranger</button>

   <ChatBox/>

  </div>
 )
}
