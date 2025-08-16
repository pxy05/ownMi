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
  const [timerActive, setTimerActive] = useState(false);
  const [clock, setClock] = useState(0);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const [cleared, setCleared] = useState(true);
  const clockInterval = useRef<NodeJS.Timeout | null>(null);
  // Timer effect
  useEffect(() => {
    if (timerActive) {
      clockInterval.current = setInterval(() => {
        setClock((prev) => prev + 1);
      }, 1000);
    } else {
      if (clockInterval.current) clearInterval(clockInterval.current);
    }
    return () => {
      if (clockInterval.current) clearInterval(clockInterval.current);
    };
  }, [timerActive]);

  const handleStart = () => {
    // If not cleared, clear the timer before starting
    if (!cleared) {
      setClock(0);
      setFinalTime(null);
      setCleared(true);
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("Starting session for user:", user?.id);
      wsRef.current.send(JSON.stringify({ type: "start-session" }));
      setTimerActive(true);
      setCleared(false);
    }
  };

  const handleEnd = () => {
    setTimerActive(false);
    setFinalTime(clock);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("Ending session for user:", user?.id);
      wsRef.current.send(JSON.stringify({ type: "end-session" }));
    }
    setSessionConnected(false);
    if (
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN &&
      !sessionConnected
    ) {
      console.log("Starting new session for user:", user?.id);
      wsRef.current.send(JSON.stringify({ type: "create-session" }));
    }
  };

  const handleClear = () => {
    setClock(0);
    setFinalTime(null);
    setCleared(true);
  };

  const formatClock = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    sessionConnectedRef.current = sessionConnected;
  }, [sessionConnected]);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    wsRef.current = ws;

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
    <div className="flex flex-col items-center gap-8 mt-8">
      <div className="flex gap-8 w-full">
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
      <Card className="text-center w-full max-w-md">
        <CardHeader>Time Tracker</CardHeader>
        <CardContent>
          <div className="mb-4 text-4xl font-mono">
            {finalTime !== null ? formatClock(finalTime) : formatClock(clock)}
          </div>
          <div className="flex gap-2 justify-center">
            <Button
              onClick={handleStart}
              disabled={timerActive || !socketConnected}
            >
              Start
            </Button>
            <Button
              onClick={handleEnd}
              disabled={!timerActive || !socketConnected}
              variant="outline"
            >
              End
            </Button>
            <Button
              onClick={handleClear}
              disabled={timerActive}
              variant="secondary"
            >
              Clear
            </Button>
          </div>
          {finalTime !== null && (
            <div className="mt-2 text-sm text-gray-500">
              Final time: {formatClock(finalTime)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
