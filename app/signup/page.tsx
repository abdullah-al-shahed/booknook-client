"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";


function validatePassword(password: string): string | null {
  if (password.length < 6) return "Password must be at least 6 characters long.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  return null;
}

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [passwordHint, setPasswordHint] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim();
    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const image = formData.get("image") as string;

    // Client-side password validations (run before any network request)
    const passwordError = validatePassword(password);
    if (passwordError) {
      setPasswordHint(passwordError);
      toast.error(passwordError);
      setLoading(false);
      return;
    }
    setPasswordHint("");

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
        image: image || "https://github.com/shadcn.png",
      });

      if (error) {
        throw new Error(error.message || "Failed to register");
      }

      toast.success("Account created! Welcome to BookNook.");
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Something went wrong during registration");
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
          <span className="text-xs font-semibold uppercase tracking-wider text-[#00A8E8]">Get Started</span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">Create an Account</h1>
          <p className="text-sm text-muted-foreground mt-1">Join BookNook and start exploring books.</p>
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
            <label className="text-sm font-medium text-foreground">Full Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="John Doe"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
            />
          </div>

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
            <label className="text-sm font-medium text-foreground">Profile Image URL (Optional)</label>
            <input
              type="url"
              name="image"
              placeholder="https://image-link.com"
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
            {passwordHint && (
              <p className="text-xs text-amber-600">{passwordHint}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Min 6 characters with at least one uppercase letter, one lowercase letter, and one number.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              placeholder="••••••••"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-[#00A8E8] text-white hover:bg-[#0095d1] mt-2">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
            Register
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#00A8E8] font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
