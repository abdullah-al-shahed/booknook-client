import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Book {
  _id: string;
  title?: string;
  bookTitle?: string;
  author?: string;
  authorName?: string;
  category?: string;
  imageUrl?: string;
  bookImage?: string;
  totalCopies?: number;
}

async function getAllBooks(): Promise<Book[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

// The uncached fetch lives inside this component so the page shell can be
// prerendered and the catalog streams in via the Suspense boundary below.
async function BooksGrid() {
  const books = await getAllBooks();

  if (books.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-border/60 shadow-sm max-w-xl mx-auto">
        <h3 className="text-lg font-semibold text-foreground">No books in the catalog yet</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-6">
          Be the first to contribute a book to the library.
        </p>
        <Button asChild className="bg-[#00A8E8] text-white hover:bg-[#0095d1]">
          <Link href="/add-book">Add a Book</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book: Book) => (
        <div
          key={book._id}
          className="group relative flex flex-col overflow-hidden rounded-lg border border-border/60 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
            <img
              src={book.imageUrl || book.bookImage}
              alt={book.title || book.bookTitle}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between p-6">
            <div>
              <span className="inline-block rounded bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground mb-3">
                {book.category}
              </span>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-[#00A8E8] transition-colors line-clamp-1">
                {book.title || book.bookTitle}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">By {book.author || book.authorName}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded ${
                  book.totalCopies && book.totalCopies > 0
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-red-600 bg-red-50"
                }`}
              >
                {book.totalCopies && book.totalCopies > 0
                  ? `Copies: ${book.totalCopies}`
                  : "Out of Stock"}
              </span>
              <Button asChild size="sm" className="bg-[#00A8E8] text-white hover:bg-[#0095d1]">
                <Link href={`/books/${book._id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export const metadata: Metadata = {
  title: "All Books",
};

export default function BooksPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#00A8E8]">Library</span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-1">All Books</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Browse the full BookNook catalog and see what is available to borrow.
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-20 text-muted-foreground">Loading books...</div>}>
        <BooksGrid />
      </Suspense>
    </div>
  );
}
