import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, RotateCcw, LogIn } from "lucide-react";
import { ReturnToast } from "./ReturnToast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface BorrowItem {
  _id: string;
  bookTitle?: string;
  title?: string;
  authorName?: string;
  author?: string;
  bookImage?: string;
  borrowDate?: string;
  returnDate?: string;
}

async function getMyBorrows(email: string, token: string): Promise<BorrowItem[]> {
  try {
    const params = new URLSearchParams({ email });
    const res = await fetch(`${API_URL}/borrows?${params.toString()}`, {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

async function BorrowsTable() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-border/60 shadow-sm max-w-xl mx-auto">
        <LogIn className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Please log in</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-6">
          Log in to see the books you have borrowed.
        </p>
        <Button asChild className="bg-[#00A8E8] text-white hover:bg-[#0095d1]">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  
  const token = await getTokenFromServer();
  const borrows = await getMyBorrows(session.user?.email || "", token);

  if (borrows.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-border/60 shadow-sm max-w-xl mx-auto">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold text-foreground">No books borrowed yet</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-6">Explore our library and borrow your first book today.</p>
        <Button asChild className="bg-[#00A8E8] text-white hover:bg-[#0095d1]">
          <Link href="/books">Browse Books</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-border/60 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60 bg-muted/40">
          <tr>
            <th className="px-6 py-4 font-semibold">#</th>
            <th className="px-6 py-4 font-semibold">Book</th>
            <th className="px-6 py-4 font-semibold">Borrowed On</th>
            <th className="px-6 py-4 font-semibold">Return By</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {borrows.map((item: BorrowItem, index: number) => {
            
            const borrowedDate = item.borrowDate
              ? new Date(item.borrowDate).toLocaleDateString()
              : "Recently";
            const returnDate = item.returnDate && item.returnDate !== "N/A"
              ? new Date(item.returnDate).toLocaleDateString()
              : "—";

            return (
              <tr key={item._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 text-muted-foreground">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-9 shrink-0 overflow-hidden rounded border border-border/50 bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.bookImage || "https://placehold.co/72x108?text=No+Cover"}
                        alt={item.bookTitle || item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground line-clamp-1">
                        {item.bookTitle || item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        By {item.authorName || item.author || "Unknown"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> {borrowedDate}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{returnDate}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    Borrowed
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <form action={`/api/return-book`} method="POST">
                    <input type="hidden" name="borrowId" value={item._id} />
                    <Button
                      type="submit"
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Return
                    </Button>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export const metadata: Metadata = {
  title: "My Borrows",
};

export default function MyBorrowsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Suspense fallback={null}>
        <ReturnToast />
      </Suspense>

      <div className="mb-10 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#00A8E8]">Dashboard</span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-1">My Borrowed Books</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Track your active book borrowings, return dates, and history seamlessly.
        </p>
      </div>

      <Suspense fallback={
        <div className="flex justify-center items-center py-20">
          <div className="h-8 w-8 rounded-full border-4 border-[#00A8E8]/20 border-t-[#00A8E8] animate-spin" />
        </div>
      }>
        <BorrowsTable />
      </Suspense>
    </div>
  );
}
