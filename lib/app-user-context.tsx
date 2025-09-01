"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./auth-context";
import { createClient } from "./supabase/client";
import useSWR, { mutate } from "swr";

export interface AppUser {
  id: string;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
  show_in_leaderboards: boolean;
  show_focus_stats: boolean;
  show_earnings: boolean;
  show_job_stats: boolean;
  avatar_customization: any; // JSONB, can be typed more strictly if needed
  total_currency: string;
  current_job_id: string | null;
  current_location_id: string | null;
  current_salary: string;
  current_focus_session_id?: string | null;
}

export interface FocusSession {
  session_type: ReactNode;
  id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  manually_added: boolean;
  created_at: string;
  updated_at: string;
}

interface AppUserContextType {
  appUser: AppUser | null;
  loading: boolean;
  error: string | null;
  exists: boolean | null;
  createUser: (
    username: string
  ) => Promise<{ success: boolean; error?: string }>;
  updateUser: (
    updates: Partial<AppUser>
  ) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;

  focusSessions: FocusSession[] | null;
  focusSessionsLoading: boolean;
  focusSessionsError: string | null;

  addFocusSessionLocally: (
    session: Omit<FocusSession, "id" | "user_id">
  ) => Promise<string>;
  addManualFocusSession: (
    start_time: Date,
    end_time: Date
  ) => Promise<{ success: boolean; error?: string }>;
  editFocusSession: (
    sessionId: string,
    start_time: Date,
    end_time: Date
  ) => Promise<{ success: boolean; error?: string }>;
  deleteFocusSession: (
    sessionId: string
  ) => Promise<{ success: boolean; error?: string }>;
  refreshFocusSessions: () => Promise<void>;
}

const AppUserContext = createContext<AppUserContextType | undefined>(undefined);

export function AppUserProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exists, setExists] = useState<boolean | null>(null);
  const supabase = createClient();

  const focusSessionsFetcher = async (key: string) => {
    if (!user?.id) return null;

    console.log("Fetching focus sessions from database...");
    const { data, error } = await supabase
      .from("focus_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("start_time", { ascending: false });

    if (error) {
      console.error("Error fetching focus sessions:", error);
      throw error;
    }

    console.log(`Fetched ${data?.length || 0} focus sessions`);
    return data as FocusSession[];
  };

  const swrKey = user?.id ? `focus-sessions-${user.id}` : null;
  const {
    data: focusSessions,
    error: focusSessionsError,
    isLoading: focusSessionsLoading,
    mutate: mutateFocusSessions,
  } = useSWR(swrKey, focusSessionsFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    dedupingInterval: 600000,
    refreshInterval: 0, // ion need to refresh everything is added both locally and on db whenever theres an update
    keepPreviousData: true,
  });

  const fetchUser = async () => {
    if (!user?.email) {
      setAppUser(null);
      setExists(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single<AppUser>();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "not found"
        throw error;
      }

      if (data) {
        setAppUser(data);
        setExists(true);
      } else {
        setAppUser(null);
        setExists(false);
      }
    } catch (err: any) {
      setError(err.message);
      setAppUser(null);
      setExists(false);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (
    username: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user?.email) {
      return { success: false, error: "No authenticated user" };
    }

    if (!username || username.length < 3) {
      return {
        success: false,
        error: "Username must be at least 3 characters",
      };
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("users")
        .insert({
          id: user.id,
          email: user.email,
          username,
        })
        .select()
        .single<AppUser>();

      if (error) {
        throw error;
      }

      if (data) {
        setAppUser(data);
        setExists(true);
        return { success: true };
      }

      return { success: false, error: "Failed to create user" };
    } catch (err: any) {
      const errorMessage = err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (
    updates: Partial<AppUser>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!appUser?.id) {
      return { success: false, error: "No user to update" };
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", appUser.id)
        .select()
        .single<AppUser>();

      if (error) {
        throw error;
      }

      if (data) {
        setAppUser(data);
        return { success: true };
      }

      return { success: false, error: "Failed to update user" };
    } catch (err: any) {
      const errorMessage = err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  // add session locally only (for tracker-generated sessions)
  const addFocusSessionLocally = async (
    session: Omit<FocusSession, "id" | "user_id">
  ): Promise<string> => {
    if (!user?.id) throw new Error("No authenticated user");

    const tempId = Date.now().toString();
    const newSession: FocusSession = {
      ...session,
      id: tempId,
      user_id: user.id,
    };

    const updatedSessions = [newSession, ...(focusSessions || [])];
    await mutateFocusSessions(updatedSessions, false);

    console.log("Focus session added locally");
    return tempId;
  };

  // manual focus session inserts | they also get reflected in the database
  const addManualFocusSession = async (
    start_time: Date,
    end_time: Date
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user?.id) {
      return { success: false, error: "No authenticated user" };
    }

    const durationSeconds = (end_time.getTime() - start_time.getTime()) / 1000;

    if (durationSeconds <= 0 || durationSeconds > 36000) {
      return {
        success: false,
        error: "Duration must be between 0 and 10 hours",
      };
    }

    const now = new Date();
    const startTime = new Date(now.getTime() - durationSeconds * 1000);

    try {
      const { data, error } = await supabase
        .from("focus_sessions")
        .insert({
          user_id: user.id,
          start_time: startTime.toISOString(),
          end_time: end_time.toISOString(),
          duration_seconds: durationSeconds,
          manually_added: true,
        })
        .select()
        .single<FocusSession>();

      if (error) throw error;

      if (data) {
        const updatedSessions = [data, ...(focusSessions || [])];
        await mutateFocusSessions(updatedSessions, false);

        console.log("Manual focus session added successfully");
        return { success: true };
      }

      return { success: false, error: "Failed to add manual session" };
    } catch (err: any) {
      console.error("Error adding manual focus session:", err);
      return { success: false, error: err.message };
    }
  };

  // edit focus sessions
  const editFocusSession = async (
    sessionId: string,
    start_time: Date,
    end_time: Date
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user?.id) {
      return { success: false, error: "No authenticated user" };
    }

    const sessionToEdit = focusSessions?.find((s) => s.id === sessionId);
    if (!sessionToEdit) {
      return { success: false, error: "Session not found" };
    }

    if (!sessionToEdit.manually_added) {
      return {
        success: false,
        error: "Only manually added sessions can be edited",
      };
    }

    const duration = (end_time.getTime() - start_time.getTime()) / 1000;

    try {
      const { data, error } = await supabase
        .from("focus_sessions")
        .update({
          start_time: start_time.toISOString(),
          end_time: end_time.toISOString(),
          duration_seconds: duration,
        })
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .select()
        .single<FocusSession>();

      if (error) throw error;

      if (data) {
        const updatedSessions =
          focusSessions?.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  start_time: start_time.toISOString(),
                  end_time: end_time.toISOString(),
                  duration_seconds: duration,
                }
              : session
          ) || [];
        await mutateFocusSessions(updatedSessions, false);

        console.log("Focus session updated successfully");
        return { success: true };
      }

      return { success: false, error: "Failed to update session" };
    } catch (err: any) {
      console.error("Error updating focus session:", err);
      return { success: false, error: err.message };
    }
  };

  // user local cache deletion reflected on db as well
  const deleteFocusSession = async (
    sessionId: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user?.id) {
      return { success: false, error: "No authenticated user" };
    }

    try {
      const { error } = await supabase
        .from("focus_sessions")
        .delete()
        .eq("id", sessionId)
        .eq("user_id", user.id);

      if (error) throw error;

      const updatedSessions =
        focusSessions?.filter((session) => session.id !== sessionId) || [];
      await mutateFocusSessions(updatedSessions, false);

      console.log("Focus session deleted successfully");
      return { success: true };
    } catch (err: any) {
      console.error("Error deleting focus session:", err);
      return { success: false, error: err.message };
    }
  };

  // refresh sessions from db
  const refreshFocusSessions = async () => {
    if (swrKey) {
      await mutateFocusSessions();
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchUser();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) {
      setAppUser(null);
      setExists(null);
      setError(null);
    }
  }, [user]);

  return (
    <AppUserContext.Provider
      value={{
        appUser,
        loading,
        error,
        exists,
        createUser,
        updateUser,
        refreshUser,

        focusSessions: focusSessions ?? null,
        focusSessionsLoading,
        focusSessionsError: focusSessionsError?.message || null,

        addFocusSessionLocally,
        addManualFocusSession,
        editFocusSession,
        deleteFocusSession,
        refreshFocusSessions,
      }}
    >
      {children}
    </AppUserContext.Provider>
  );
}

export function useAppUser() {
  const context = useContext(AppUserContext);
  if (context === undefined) {
    throw new Error("useAppUser must be used within an AppUserProvider");
  }
  return context;
}
