import { Suspense } from "react";
import type { Metadata } from "next";
import { Banner } from "@/components/home/Banner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, Layers } from "lucide-react";

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

async function getNewArrivals(): Promise<Book[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/new-arrivals`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

async function NewArrivalsList() {
  const books = await getNewArrivals();

  if (books.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No new arrivals found.
      </div>
    );
  }

  return (
    <div>
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
                <p className="text-sm text-muted-foreground mt-1">
                  By {book.author || book.authorName}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
                  Copies: {book.totalCopies}
                </span>
                <Button
                  asChild
                  size="sm"
                  className="bg-[#00A8E8] text-white hover:bg-[#0095d1]"
                >
                  <Link href={`/books/${book._id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Link href="/books">
          <Button className="bg-[#00A8E8] px-8 py-3 text-base font-semibold text-white shadow-md hover:bg-[#0095d1]">
            See All Books <ArrowRight className="ml-2 h-5 w-5"/>
          </Button>
        </Link>
      </div>
    </div>


  );
}

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Banner />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#00A8E8]">
              Fresh Additions
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-1">
              New Arrivals
            </h2>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-[#00A8E8]/30 hover:bg-[#00A8E8]/5 text-[#00A8E8]"
          >
            <Link href="/books">
              See All Books <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Suspense
          fallback={
            <div className="text-center py-20 text-muted-foreground">
              Loading new arrivals...
            </div>
          }
        >
          <NewArrivalsList />
        </Suspense>
      </section>

      <section className="bg-muted/40 py-20 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#00A8E8]">
              Simple Process
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-1">
              How Borrowing Works
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Get your favorite book in just 3 easy steps without any hassle.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg border border-border/60 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-[#00A8E8]/10 text-[#00A8E8] flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Browse & Select
              </h3>
              <p className="text-sm text-muted-foreground">
                Explore our extensive library catalog and choose the book you
                want to read.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg border border-border/60 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-[#00A8E8]/10 text-[#00A8E8] flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Confirm Borrow
              </h3>
              <p className="text-sm text-muted-foreground">
                Click on borrow, verify your details, and instantly secure your
                book copy.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg border border-border/60 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-[#00A8E8]/10 text-[#00A8E8] flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Read & Return
              </h3>
              <p className="text-sm text-muted-foreground">
                Enjoy reading for a few days and easily return it from your
                dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#00A8E8]">
            Explore Genres
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-1">
            Popular Categories
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {["Fiction", "Science", "History", "Kids", "Others"].map(
            (cat, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-lg border border-border bg-white text-center shadow-sm hover:border-[#00A8E8] hover:shadow-md transition-all"
              >
                <div className="h-10 w-10 mx-auto rounded-full bg-muted flex items-center justify-center text-[#00A8E8] mb-3 group-hover:bg-[#00A8E8] group-hover:text-white transition-colors">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground">{cat}</h3>
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
