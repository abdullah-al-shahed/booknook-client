import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { User, Mail, LogIn } from "lucide-react";

export const metadata: Metadata = {
  title: "Profile",
};


async function ProfileCard() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-border/60 shadow-sm max-w-xl mx-auto">
        <LogIn className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Please log in</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-6">
          Log in to view your profile.
        </p>
        <Button asChild className="bg-[#00A8E8] text-white hover:bg-[#0095d1]">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl border border-border/60 shadow-sm text-center">
      <div className="h-20 w-20 mx-auto rounded-full overflow-hidden border-2 border-[#00A8E8]/30 bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={session.user?.image || "https://github.com/shadcn.png"}
          alt={session.user?.name || "Profile"}
          className="h-full w-full object-cover"
        />
      </div>
      <h2 className="text-xl font-bold text-foreground mt-4 flex items-center justify-center gap-2">
        <User className="h-5 w-5 text-[#00A8E8]" /> {session.user?.name}
      </h2>
      <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1.5">
        <Mail className="h-3.5 w-3.5" /> {session.user?.email}
      </p>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#00A8E8]">Account</span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-1">My Profile</h1>
      </div>

      <Suspense fallback={
        <div className="flex justify-center items-center py-20">
          <div className="h-8 w-8 rounded-full border-4 border-[#00A8E8]/20 border-t-[#00A8E8] animate-spin" />
        </div>
      }>
        <ProfileCard />
      </Suspense>
    </div>
  );
}
