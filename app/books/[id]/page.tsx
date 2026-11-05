import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server"; // ১. এটি ইমপোর্ট করুন
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { BorrowButton } from "./BorrowButton";

async function getBookDetails(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

// Cached so generateMetadata can prerender the title into the static shell
// without tripping the uncached-data blocking error.
async function getBookTitle(id: string): Promise<string> {
  "use cache";
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`);
    if (!res.ok) return "Book Details";
    const book = await res.json();
    return book?.title || book?.bookTitle || "Book Details";
  } catch (error) {
    return "Book Details";
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: await getBookTitle(id) };
}

async function BookDetailsContent({ params }: { params: Promise<{ id: string }> }) {
  await connection(); // ২. রিকোয়েস্ট টাইমে ডেটা লোড নিশ্চিত করতে এটি কল করুন
  
  const resolvedParams = await params;
  const book = await getBookDetails(resolvedParams.id);

  if (!book) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Back Button */}
      <div className="mb-8">
        <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
          <Link href="/books">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Books
          </Link>
        </Button>
      </div>

      <div className="grid gap-10 md:grid-cols-2 items-start bg-white p-8 rounded-xl border border-border/60 shadow-sm">
        {/* Book Image */}
        <div className="aspect-[4/3] md:aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted border border-border/40">
          <img
            src={book.imageUrl || book.bookImage}
            alt={book.title || book.bookTitle}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Book Info */}
        <div className="flex flex-col justify-between h-full space-y-6">
          <div className="space-y-4">
            <span className="inline-block rounded-full bg-[#00A8E8]/10 text-[#00A8E8] px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              {book.category}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {book.title || book.bookTitle}
            </h1>
            <p className="text-base text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-[#00A8E8]" /> By <span className="font-medium text-foreground">{book.author || book.authorName}</span>
            </p>
            <div className="pt-2 border-t border-border/50">
              <h3 className="text-sm font-semibold text-foreground mb-1">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {book.description || "No description provided for this book."}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Available Copies:</span>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${book.totalCopies > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                {book.totalCopies > 0 ? `${book.totalCopies} Copies Available` : 'Out of Stock'}
              </span>
            </div>

            {session ? (
              book.totalCopies > 0 ? (
                <BorrowButton book={book} userEmail={session.user?.email || ""} />
              ) : (
                <Button disabled className="w-full bg-muted text-muted-foreground">
                  Currently Unavailable
                </Button>
              )
            ) : (
              <div className="space-y-2">
                <Button asChild className="w-full bg-[#00A8E8] text-white hover:bg-[#0095d1]">
                  <Link href="/login">Login to Borrow</Link>
                </Button>
                <p className="text-xs text-center text-muted-foreground">You must be logged in to borrow books.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[60vh] text-muted-foreground animate-pulse">Loading book details...</div>}>
      <BookDetailsContent params={params} />
    </Suspense>
  );
}