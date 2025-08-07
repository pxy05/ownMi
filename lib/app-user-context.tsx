"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import { createClient } from "./supabase/client";

// AppUser interface matching the users table
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
}

const AppUserContext = createContext<AppUserContextType | undefined>(undefined);

export function AppUserProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exists, setExists] = useState<boolean | null>(null);
  const supabase = createClient();

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

  // Fetch user data when auth user changes
  useEffect(() => {
    if (!authLoading) {
      fetchUser();
    }
  }, [user, authLoading]);

  // Reset state when auth user is cleared
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
