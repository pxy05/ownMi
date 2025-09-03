"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/ui/sidebar";
import { useTheme } from "next-themes";

const log = false; // Set to true for debugging

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

const page = () => {
  const { theme } = useTheme();
  const [zenMode, setZenMode] = useState(true);
  const [colorMode, setColorMode] = useState("green");
  const colours: Record<string, string> = {
    purple: "#5B00C0",
    green: "#4ade80",
    blue: "#3b82f6",
    red: "#ef4444",
    orange: "#f97316",
  };

  // websocket logic -------------
  const [socketConnected, setSocketConnected] = useState(false);
  const [sessionConnected, setSessionConnected] = useState(false);
  const sessionConnectedRef = useRef(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

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

  // refresh sidebar logic -------
  const [sidebarKey, setSidebarKey] = useState(0);

  const handleEndSession = () => {
    // ...existing end session logic...
    setSidebarKey((prev) => prev + 1); // Increment to force Sidebar re-mount
  };

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
      if (log) console.log("Starting session for user:", user?.id);
      wsRef.current.send(JSON.stringify({ type: "start-session" }));
    }
  };

  const handleEnd = () => {
    setTimerActive(false);
    setFinalTime(clock);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      if (log) console.log("Ending session for user:", user?.id);
      wsRef.current.send(JSON.stringify({ type: "end-session" }));
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
      if (log) console.log("Received WebSocket message:", data.type);
      switch (data.type) {
        case "sessionExists":
          if (log) console.log("Session exists for user:", user?.id);
          setSessionConnected(true);
          break;

        case "noSessionExists":
          if (log) console.log("No active session for user:", user?.id);
          setSessionConnected(false);
          if (
            ws.readyState === WebSocket.OPEN &&
            !sessionConnectedRef.current
          ) {
            if (log) console.log("Sending Session Request...");
            ws.send(JSON.stringify({ type: "create-session" }));
          }
          break;

        case "sessionCreated":
          if (log) console.log("Session created for user:", user?.id);
          setSessionConnected(true);
          break;

        case "sessionStarted":
          if (log) console.log("Session started for user:", user?.id);
          setSessionEnded(false);
          setSessionStarted(true);
          setTimerActive(true);
          setCleared(false);
          break;

        case "sessionEnded":
          if (log) console.log("Session ended for user:", user?.id);
          setSessionEnded(true);
          setSessionConnected(false);

          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            if (log) console.log("Starting new session for user:", user?.id);
            wsRef.current.send(JSON.stringify({ type: "create-session" }));
          }
          break;

        default:
          break;
      }
    };

    const heartbeat = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN && sessionConnectedRef.current) {
        if (log) console.log("Sending heartbeat...");
        ws.send(JSON.stringify({ type: "heartbeat" }));
      }
    }, 10000);

    const sessionCheck = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN && !sessionConnectedRef.current) {
        if (log) console.log("Checking session status...");
        ws.send(JSON.stringify({ type: "session-check" }));
      }
    }, 500);

    return () => {
      clearInterval(sessionCheck);
      clearInterval(heartbeat);
      if (ws.readyState === WebSocket.OPEN && sessionConnectedRef.current) {
        if (log) console.log("Ending session...");
        ws.send(JSON.stringify({ type: "end-session" }));
      }
      ws.close();
    };
  }, [token]);

  return (
    <div className="flex flex-col items-center gap-8 mt-8">
      {!zenMode && (
        <>
          <Sidebar
            key={sidebarKey}
            items={["Stat 1", "Stat 2", "Stat 3"]}
            theme={String(theme)}
            reset={sidebarKey}
          />
          <Card className="text-center w-full max-w-md">
            <CardHeader>Time Tracker</CardHeader>
            <CardContent>
              <div className="mb-4 text-4xl font-mono">
                {finalTime !== null
                  ? formatClock(finalTime)
                  : formatClock(clock)}
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
        </>
      )}
      {zenMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 w-[200vmax] h-[200vmax] -top-[50vmax] -left-[50vmax] animate-spin"
            style={
              {
                "--color-primary": colours[colorMode],
                background: `linear-gradient(#4b5563,var(--color-primary), #6b7280)`,
                animationDuration: "10s",
                animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 0.5)",
              } as React.CSSProperties
            }
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/60 to-black" />
          <Card className="text-center w-full max-w-md relative z-10 bg-background/20  backdrop-blur-3xl border-none text-gray-500/70">
            <CardHeader></CardHeader>
            <CardContent>
              <div className="mb-4 text-4xl font-mono">
                {finalTime !== null
                  ? formatClock(finalTime)
                  : formatClock(clock)}
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  className="bg-white/40 hover:bg-white/60"
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
                  className="bg-black/40 hover:bg-green-950/40"
                  onClick={handleClear}
                  disabled={timerActive}
                  variant="secondary"
                >
                  Clear
                </Button>
              </div>
              {finalTime !== null && (
                <div className="mt-2 text-sm text-gray-500/50">
                  Final time: {formatClock(finalTime)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-50 grid-cols-2 text-sm">
        <Button
          className="z-50 opacity-60 hover:opacity-100 hover:text-xl transition-all"
          variant="ghost"
          onClick={() =>
            setColorMode((colorMode) =>
              colorMode === "purple"
                ? "green"
                : colorMode === "green"
                ? "blue"
                : colorMode === "blue"
                ? "red"
                : colorMode === "red"
                ? "orange"
                : "purple"
            )
          }
        >
          colour
        </Button>
        <Button
          className="z-50 opacity-60 hover:opacity-100 hover:text-xl transition-all"
          variant="ghost"
          onClick={() => setZenMode(!zenMode)}
        >
          {zenMode ? "leave zen" : "zen"}
        </Button>
      </div>
    </div>
  );
};

export default page;
