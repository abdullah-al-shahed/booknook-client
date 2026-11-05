import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { MyBooksClient } from "./MyBooksClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface MyBook {
  _id: string;
  title?: string;
  bookTitle?: string;
  author?: string;
  authorName?: string;
  category?: string;
  imageUrl?: string;
  bookImage?: string;
  totalCopies?: number;
  description?: string;
  userEmail?: string;
}


async function MyBooksList() {
  const session = await auth.api.getSession({ headers: await headers() });
  const token = await getTokenFromServer();

  let myBooks: MyBook[] = [];
  let failed = false;

  try {
    const res = await fetch(`${API_URL}/books`, {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) throw new Error("Failed to fetch books");

    const allBooks: MyBook[] = await res.json();
    // Books added through Add Book carry the owner's email.
    myBooks = allBooks.filter(
      (book) => book.userEmail && book.userEmail === session?.user?.email
    );
  } catch {
    failed = true;
  }

  if (failed) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Could not load your books. Is the library server running?
      </div>
    );
  }

  return <MyBooksClient books={myBooks} />;
}

export const metadata: Metadata = {
  title: "My Books",
};

export default function MyBooksPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#00A8E8]">My Library</span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-1">My Books</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Manage the books you have contributed — edit details or remove them from the catalog.
        </p>
      </div>

      <Suspense fallback={
        <div className="flex justify-center items-center py-20">
          <div className="h-8 w-8 rounded-full border-4 border-[#00A8E8]/20 border-t-[#00A8E8] animate-spin" />
        </div>
      }>
        <MyBooksList />
      </Suspense>
    </div>
  );
}
