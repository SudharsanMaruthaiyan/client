
import {useRef} from "react";
import {iceServers} from "../utils/iceServers";

export default function useWebRTC(socket){

 const peer=useRef(null);

 const createPeer=(stream)=>{

  peer.current=new RTCPeerConnection({iceServers});

  stream.getTracks().forEach(track=>{
    peer.current.addTrack(track,stream);
  });

  peer.current.onicecandidate=(e)=>{
    if(e.candidate){
      socket.emit("ice-candidate",e.candidate);
    }
  };

  return peer.current;
 };

 return {peer,createPeer};
}
