"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Loader2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { getClientAuthHeaders } from "@/lib/client-auth";

interface BorrowBook {
  _id: string;
  title?: string;
  bookTitle?: string;
  imageUrl?: string;
  bookImage?: string;
}

export function BorrowButton({ book, userEmail }: { book: BorrowBook; userEmail: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // Computed in the click handler (event context), not during render.
  const [defaultReturnDate, setDefaultReturnDate] = useState("");

  const openModal = () => {
    // Default return period: 14 days from today.
    setDefaultReturnDate(
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    );
    setOpen(true);
  };

  const handleConfirmBorrow = async (returnDate: string) => {
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrows`, {
        method: "POST",
        headers: await getClientAuthHeaders(),
        body: JSON.stringify({
          bookId: book._id,
          userEmail,
          bookTitle: book.title || book.bookTitle,
          bookImage: book.imageUrl || book.bookImage,
          returnDate,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const detail = data?.error || data?.msg;
        throw new Error(
          detail || `Failed to borrow book. Please try again. (${res.status})`
        );
      }

      setOpen(false);
      toast.success(`"${book.title || book.bookTitle}" borrowed successfully!`);
      // Revalidate server data so /my-borrows shows the new record immediately.
      router.push("/my-borrows");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={openModal}
        className="w-full bg-[#00A8E8] text-white hover:bg-[#0095d1]"
      >
        Borrow This Book
      </Button>

      <BorrowModal
        key={defaultReturnDate}
        open={open}
        loading={loading}
        book={book}
        defaultReturnDate={defaultReturnDate}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmBorrow}
      />
    </>
  );
}

function BorrowModal({
  open,
  loading,
  book,
  defaultReturnDate,
  onClose,
  onConfirm,
}: {
  open: boolean;
  loading: boolean;
  book: BorrowBook;
  defaultReturnDate: string;
  onClose: () => void;
  onConfirm: (returnDate: string) => void;
}) {
  // Seeded from the parent's click handler; remounted via key when it changes.
  const [returnDate, setReturnDate] = useState(defaultReturnDate);

  return (
    <Modal open={open} onClose={onClose} title="Confirm Borrow">
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/40 p-3">
          <div className="h-14 w-10 shrink-0 overflow-hidden rounded border border-border/50 bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={book.imageUrl || book.bookImage || "https://placehold.co/80x120?text=No+Cover"}
              alt={book.title || book.bookTitle}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground line-clamp-1 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-[#00A8E8] shrink-0" />
              {book.title || book.bookTitle}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">1 copy will be reserved for you</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Return By</label>
          <input
            type="date"
            value={returnDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(returnDate)}
            disabled={loading || !returnDate}
            className="flex-1 bg-[#00A8E8] text-white hover:bg-[#0095d1]"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Confirm Borrow
          </Button>
        </div>
      </div>
    </Modal>
  );
}
