"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { clear } from "console";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

const page = () => {
  // websocket logic -------------
  const [socketConnected, setSocketConnected] = useState(false);
  const [sessionConnected, setSessionConnected] = useState(false);
  const sessionConnectedRef = useRef(false);

  const wsRef = useRef<WebSocket | null>(null);
  const ws = wsRef.current;
  // user logic -----------------
  const { user, session } = useAuth();
  const token = session?.access_token || "";
  // timer logic -----------------

  useEffect(() => {
    sessionConnectedRef.current = sessionConnected;
  }, [sessionConnected]);

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
      const data = JSON.parse(event.data);
      console.log("Received WebSocket message:", data.type);
      switch (data.type) {
        case "sessionExists":
          console.log("Session exists for user:", user?.id);
          setSessionConnected(true);
          break;
        case "noSessionExists":
          console.log("No active session for user:", user?.id);
          setSessionConnected(false);
          if (ws.readyState === WebSocket.OPEN && !sessionConnected) {
            console.log("Sending Session Request...");
            ws.send(JSON.stringify({ type: "create-session" }));
          }
          break;
        default:
          break;
      }
    };

    const heartbeat = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN && sessionConnectedRef.current) {
        console.log("Sending heartbeat...");
        ws.send(JSON.stringify({ type: "heartbeat" }));
      }
    }, 10000);

    const sessionCheck = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN && !sessionConnectedRef.current) {
        console.log("Checking session status...");
        ws.send(JSON.stringify({ type: "sessionCheck" }));
      }
    }, 500);

    return () => {
      clearInterval(sessionCheck);
      clearInterval(heartbeat);
      if (ws.readyState === WebSocket.OPEN && sessionConnectedRef.current) {
        console.log("Ending session...");
        ws.send(JSON.stringify({ type: "end-session" }));
      }
      ws.close();
    };
  }, [token]);

  return (
    <div className="flex">
      <div className="flex-1">
        <Card className="text-center">
          <CardHeader>WebSocket Status</CardHeader>
          <CardContent
            className={socketConnected ? "text-green-500" : "text-red-500"}
          >
            {socketConnected ? "Connected" : "Disconnected"}
          </CardContent>
        </Card>
      </div>
      <div className="flex-1">
        <Card className="text-center">
          <CardHeader>Session Status</CardHeader>
          <CardContent
            className={sessionConnected ? "text-green-500" : "text-red-500"}
          >
            {sessionConnected ? "Session Active" : "No Active Session"}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
