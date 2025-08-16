"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

const page = () => {
  // websocket logic -------------
  const [socketConnected, setSocketConnected] = useState(false);
  const [sessionConnected, setSessionConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  // user logic -----------------
  const { user, session } = useAuth();
  const token = session?.access_token || "";
  // timer logic -----------------

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setSocketConnected(true);
    };

    ws.onclose = () => {
      setSocketConnected(false);
      setSessionConnected(false);
    };

    ws.onerror = (e) => {
      console.log("WebSocket error:", e);
    };

    ws.onmessage = (event) => {
      switch (event.data.type) {
        case "sessionExists":
          setSessionConnected(true);
          break;
        default:
          break;
      }
    };

    const heartbeat = setInterval(() => {
      console.log("Sending heartbeat...");
      if (ws.readyState === WebSocket.OPEN && sessionConnected) {
        ws.send(JSON.stringify({ type: "heartbeat" }));
      }
    }, 10000);

    const sessionCheck = setInterval(() => {
      console.log("Checking session status...");
      if (ws.readyState === WebSocket.OPEN && !sessionConnected) {
        ws.send(JSON.stringify({ type: "sessionCheck" }));
      }
    }, 500);
  }, [token]);

  return (
    <div className="flex">
      <div className="flex-1">
        WebSocket Status: {socketConnected ? "Connected" : "Disconnected"}
      </div>
      <div className="flex-1">
        {sessionConnected ? "Session Active" : "No Active Session"}
      </div>
    </div>
  );
};

export default page;
