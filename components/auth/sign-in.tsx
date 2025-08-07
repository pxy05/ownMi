import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  return (
    <form
      className="bg-card border border-border p-6 rounded-lg shadow-sm max-w-sm mx-auto"
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Sign In</h2>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>
        <Button type="submit" className="w-full">
          <div className="flex items-center gap-2">
            <img src="/github-mark.svg" alt="GitHub" className="w-5 h-5 dark:invert" />
            Sign in with GitHub
          </div>
        </Button>
      </div>
    </form>
  );
}
