"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogIn, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || "Failed to login");
      }

      toast.success("Logged in successfully. Welcome back!");
      // Honor ?redirect= set by the proxy guard when bouncing to /login.
      const redirect = new URLSearchParams(window.location.search).get("redirect") || "/";
      router.push(redirect);
      router.refresh();
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
    if (error) {
      toast.error(error.message || "Google sign-in failed");
      setGoogleLoading(false);
    }
    // On success the browser redirects to Google, then back to callbackURL.
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-xl border border-border/60 shadow-sm">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#00A8E8]">Welcome Back</span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">Login to BookNook</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your details to access your account.</p>
        </div>

        <Button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          variant="outline"
          className="w-full mb-4 border-border"
        >
          {googleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z"/>
            </svg>
          )}
          Continue with Google
        </Button>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-[#00A8E8] text-white hover:bg-[#0095d1] mt-2">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#00A8E8] font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
