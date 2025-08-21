"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Mic,
  MicOff,
  VideoIcon,
  VideoOff,
  Phone,
  Send,
  Stethoscope,
} from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

export default function DoctorVideoConsultationPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [message, setMessage] = useState("");
  const [sessionData, setSessionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Dr. Smith",
      content: "Hello! How are you feeling today?",
      timestamp: new Date(new Date().setHours(10, 1)),
      isUser: false,
    },
    {
      id: "2",
      sender: "You",
      content:
        "Hi Dr. Smith! I've been having some symptoms I'd like to discuss.",
      timestamp: new Date(new Date().setHours(10, 2)),
      isUser: true,
    },
    {
      id: "3",
      sender: "Dr. Smith",
      content: "I understand. Let's go through your symptoms one by one.",
      timestamp: new Date(new Date().setHours(10, 3)),
      isUser: false,
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (sessionId) {
        try {
          const response = await fetch(
            `/api/doctor-video-session?sessionId=${sessionId}`
          );
          if (response.ok) {
            const data = await response.json();
            setSessionData(data.session);
          } else {
            console.error("Failed to fetch session data");
          }
        } catch (error) {
          console.error("Error fetching session data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  useEffect(() => {
    const getVideoStream = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    getVideoStream();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !isMicOn;
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOn;
      });
    }
  };

  const endCall = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    window.location.href = "/doctor-dash";
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "You",
        content: message,
        timestamp: new Date(),
        isUser: true,
      };
      setMessages([...messages, newMessage]);
      setMessage("");

      setTimeout(() => {
        const doctorResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: "Dr. Smith",
          content:
            "Thank you for sharing that information. Based on your symptoms, I recommend...",
          timestamp: new Date(),
          isUser: false,
        };
        setMessages((prev) => [...prev, doctorResponse]);
      }, 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const doctorName = sessionData?.appointment?.doctor || "Dr. Smith";
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-10 text-black">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex items-center mb-8">
          <Link href="/doctor-dash" className="mr-4">
            <button className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors border border-sky-600">
              Back to Appointments
            </button>
          </Link>
          <h1 className="text-3xl font-bold">Medical Consultation</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="bg-gray-100 p-2 h-[500px] relative rounded-lg shadow-sm">
              <div className="bg-black h-full rounded-md flex items-center justify-center">
                {isVideoOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full">
                    <img
                      src="/placeholder.svg?height=400&width=600"
                      alt="Video off"
                      className="opacity-50"
                    />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  Medical Consultation with {doctorName}
                </div>
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-md overflow-hidden border-2 border-sky-500">
                  <video
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    src="/placeholder.svg?height=100&width=150"
                  />
                </div>
              </div>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <button
                  onClick={toggleMic}
                  className={`rounded-full h-12 w-12 flex items-center justify-center ${
                    isMicOn
                      ? "bg-sky-500 hover:bg-sky-600"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white transition-colors`}
                >
                  {isMicOn ? <Mic /> : <MicOff />}
                </button>
                <button
                  onClick={toggleVideo}
                  className={`rounded-full h-12 w-12 flex items-center justify-center ${
                    isVideoOn
                      ? "bg-sky-500 hover:bg-sky-600"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white transition-colors`}
                >
                  {isVideoOn ? <VideoIcon /> : <VideoOff />}
                </button>
                <button
                  onClick={endCall}
                  className="rounded-full h-12 w-12 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  <Phone className="rotate-[135deg]" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 text-black">
            <div className="h-[500px] flex flex-col text-black bg-gray-100 rounded-lg shadow-sm">
              <div className="w-full h-full text-black">
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab("chat")}
                    className={`flex-1 py-2 font-medium ${
                      activeTab === "chat"
                        ? "bg-sky-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    } transition-colors`}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setActiveTab("participants")}
                    className={`flex-1 py-2 font-medium ${
                      activeTab === "participants"
                        ? "bg-sky-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    } transition-colors`}
                  >
                    Participants
                  </button>
                </div>

                {activeTab === "chat" && (
                  <div className="flex flex-col h-[calc(500px-40px)]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${
                            msg.isUser ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl p-3 ${
                              msg.isUser
                                ? "bg-sky-500 text-white"
                                : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            {!msg.isUser && (
                              <div className="font-semibold text-sm mb-1">
                                {msg.sender}
                              </div>
                            )}
                            <p>{msg.content}</p>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={sendMessage} className="p-4 border-t">
                      <div className="flex space-x-2">
                        <input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <button
                          type="submit"
                          className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md transition-colors"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === "participants" && (
                  <div className="h-[calc(500px-40px)] p-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-2 rounded-md bg-gray-200">
                        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                          <Stethoscope className="h-5 w-5 text-sky-500" />
                        </div>
                        <div>
                          <p className="font-medium">{doctorName}</p>
                          <p className="text-sm text-gray-500">Doctor (Host)</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-md bg-gray-200">
                        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                          <VideoIcon className="h-5 w-5 text-sky-500" />
                        </div>
                        <div>
                          <p className="font-medium">You</p>
                          <p className="text-sm text-gray-500">Patient</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
