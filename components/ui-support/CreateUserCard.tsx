"use client";
import { useState } from "react";
import { useAppUser } from "@/lib/app-user-context";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

export default function CreateUserCard() {
  const { user } = useAuth();

  const {
    appUser,
    exists,
    loading,
    createUser,
    error: contextError,
  } = useAppUser();
  const [username, setUsername] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    setSuccess(false);

    const result = await createUser(username);

    if (result.success) {
      setSuccess(true);
      setUsername("");
    } else {
      setError(result.error || "Failed to create user");
    }

    setCreating(false);
  };

  // Don't show if user exists or we're still loading
  if (loading || exists === null || exists === true) return null;

  return (
    <Card className="max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle>Create Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Welcome! Please create a username to get started.
        </CardDescription>
        <form onSubmit={handleCreate} className="mt-4 space-y-4">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            minLength={3}
            required
            disabled={creating}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {contextError && (
            <div className="text-red-500 text-sm">{contextError}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm">
              Profile created successfully!
            </div>
          )}
          <Button type="submit" disabled={creating || !username}>
            Create
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
