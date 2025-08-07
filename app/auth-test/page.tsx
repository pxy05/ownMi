"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, LogOut, User } from "lucide-react";
import { useAppUser } from "@/lib/app-user-context";
import CreateUserCard from "@/components/ui-support/CreateUserCard";

export default function AuthTestPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const {
    appUser,
    loading: appUserLoading,
    exists,
    error: appUserError,
  } = useAppUser();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Error signing in with GitHub:", error);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              Supabase Auth Test
            </CardTitle>
            <CardDescription>
              Test GitHub OAuth authentication with Supabase
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!user ? (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You are not signed in. Click the button below to sign in with
                  GitHub.
                </p>
                <Button onClick={signInWithGithub} className="w-full">
                  <Github className="mr-2 h-4 w-4" />
                  Sign in with GitHub
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {user.user_metadata?.full_name || user.email}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">
                        {user.app_metadata?.provider}
                      </Badge>
                      <Badge variant="outline">
                        {user.email_confirmed_at ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">User Details:</h4>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <pre className="whitespace-pre-wrap overflow-auto">
                      {JSON.stringify(user, null, 2)}
                    </pre>
                  </div>
                </div>

                <Button
                  onClick={signOut}
                  variant="destructive"
                  className="w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AppUser Context Test */}
        <Card>
          <CardHeader>
            <CardTitle>AppUser Context Test</CardTitle>
            <CardDescription>
              Test the custom AppUser context for application user data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {appUserLoading && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Loading app user data...
                </p>
              </div>
            )}

            {appUserError && (
              <div className="text-center text-red-500">
                <p>Error: {appUserError}</p>
              </div>
            )}

            {!appUserLoading && exists === false && (
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  No app user profile found. Create one below:
                </p>
                <CreateUserCard />
              </div>
            )}

            {!appUserLoading && exists === true && appUser && (
              <div className="space-y-2">
                <h4 className="font-medium">App User Profile:</h4>
                <div className="bg-muted p-3 rounded-md text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <strong>Username:</strong> {appUser.username}
                    </div>
                    <div>
                      <strong>Email:</strong> {appUser.email}
                    </div>
                    <div>
                      <strong>Balance:</strong> ${appUser.total_currency}
                    </div>
                    <div>
                      <strong>Current Salary:</strong> ${appUser.current_salary}
                    </div>
                    <div>
                      <strong>Show in Leaderboards:</strong>{" "}
                      {appUser.show_in_leaderboards ? "Yes" : "No"}
                    </div>
                    <div>
                      <strong>Show Focus Stats:</strong>{" "}
                      {appUser.show_focus_stats ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>
              Make sure these environment variables are set in your .env.local
              file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{" "}
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                  <Badge variant="secondary">Set</Badge>
                ) : (
                  <Badge variant="destructive">Missing</Badge>
                )}
              </div>
              <div>
                <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{" "}
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                  <Badge variant="secondary">Set</Badge>
                ) : (
                  <Badge variant="destructive">Missing</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
