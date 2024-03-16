"use client";
import { useEffect, useState } from "react";

const VideoCall = () => {
  const [peerId, setPeerId] = useState("");
  const [peer, setPeer] = useState(null);
  const [call, setCall] = useState(null);

  useEffect(() => {
    import("peerjs").then(({ default: Peer }) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          const localVideo = document.getElementById("local-video");
          if (localVideo) {
            localVideo.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Error accessing media devices.", error);
        });

      const peerInstance = new Peer(undefined, {
        host: "150.95.82.125",
        // Specify the PeerJS server here; for development, you can use the cloud server
        path: "/",
        port: "9000",
      });
      setPeer(peerInstance);

      peerInstance.on("open", (id) => {
        console.log("My peer ID is: " + id);
        setPeerId(id);
      });

      peerInstance.on("connection", (conn) => {
        conn.on("data", (data) => {
          console.log("Received:", data);
        });
        conn.on("open", () => {
          conn.send("Hello!");
        });
      });

      peerInstance.on("call", (call) => {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            call.answer(stream); // Answer the call with your local video/audio stream.
            call.on("stream", (remoteStream) => {
              // Use the remote stream
              const remoteVideo = document.getElementById("remote-video");
              if (remoteVideo) {
                remoteVideo.srcObject = remoteStream;
              }
            });
            setCall(call);
          })
          .catch((err) => {
            console.error("Failed to get local stream", err);
          });
        document.getElementById("hangup-btn").addEventListener("click", () => {
          if (call) {
            call.close();
            console.log("Call ended.");
          }
        });
      });
    });
  }, []);

  const handleCall = () => {
    const remotePeerId = prompt("Enter the ID of the peer you want to call:");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const call = peer.call(remotePeerId, stream);
        call.on("stream", (remoteStream) => {
          // Use the remote stream
          const remoteVideo = document.getElementById("remote-video");
          if (remoteVideo) {
            remoteVideo.srcObject = remoteStream;
          }
        });
        setCall(call);
      });
  };

  const handleCallHangUp = () => {
    if (call) {
      call.close();
      console.log("Call ended.");
      setCall(null);
    }
  };

  return (
    <div className="video-call-container">
      <h1>{peerId}</h1>
      <video id="local-video" autoPlay muted></video>
      <video id="remote-video" autoPlay></video>
      <div className="call-actions">
        <button id="call-btn" onClick={handleCall}>
          Call
        </button>
        <button id="hangup-btn" onClick={handleCallHangUp}>
          Hang Up
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
