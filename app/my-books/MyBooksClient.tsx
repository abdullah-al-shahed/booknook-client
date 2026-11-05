"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { BookPlus, Loader2, Pencil, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { getClientAuthHeaders } from "@/lib/client-auth";

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
}

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

export function MyBooksClient({ books }: { books: MyBook[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<MyBook | null>(null);
  const [deleting, setDeleting] = useState<MyBook | null>(null);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      title: formData.get("title"),
      author: formData.get("author"),
      category: formData.get("category"),
      imageUrl: formData.get("imageUrl"),
      totalCopies: Number(formData.get("totalCopies")),
      description: formData.get("description"),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${editing._id}`, {
        method: "PATCH",
        headers: await getClientAuthHeaders(),
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        throw new Error("Failed to update the book.");
      }

      toast.success("Book updated successfully.");
      setEditing(null);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleting) return;
    setRemoving(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${deleting._id}`, {
        method: "DELETE",
        headers: await getClientAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error("Failed to delete the book.");
      }

      toast.success(`"${deleting.title || deleting.bookTitle}" was removed from the catalog.`);
      setDeleting(null);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setRemoving(false);
    }
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-border/60 shadow-sm max-w-xl mx-auto">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold text-foreground">You haven&apos;t added any books yet</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-6">
          Contribute your first book to see it listed here.
        </p>
        <Button asChild className="bg-[#00A8E8] text-white hover:bg-[#0095d1]">
          <Link href="/add-book">
            <BookPlus className="mr-2 h-4 w-4" /> Add a Book
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <div
            key={book._id}
            className="flex flex-col overflow-hidden rounded-lg border border-border/60 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={book.imageUrl || book.bookImage}
                alt={book.title || book.bookTitle}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <span className="inline-block rounded bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground mb-2">
                  {book.category}
                </span>
                <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                  {book.title || book.bookTitle}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  By {book.author || book.authorName} · Copies: {book.totalCopies}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing(book)}
                  className="flex-1 text-[#00A8E8] border-[#00A8E8]/30 hover:bg-[#00A8E8]/5"
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleting(book)}
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Book Modal */}
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title="Edit Book"
      >
        {editing && (
          <form onSubmit={handleEditSubmit} className="space-y-3">
            <input
              type="text"
              name="title"
              defaultValue={editing.title || editing.bookTitle}
              required
              placeholder="Book Title"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
            />
            <input
              type="text"
              name="author"
              defaultValue={editing.author || editing.authorName}
              required
              placeholder="Author Name"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
            />
            <select
              name="category"
              defaultValue={editing.category}
              className="w-full rounded-md border border-border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="url"
              name="imageUrl"
              defaultValue={editing.imageUrl || editing.bookImage}
              required
              placeholder="Image URL"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
            />
            <input
              type="number"
              name="totalCopies"
              min="1"
              defaultValue={editing.totalCopies}
              required
              placeholder="Total Copies"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
            />
            <textarea
              name="description"
              rows={3}
              defaultValue={editing.description}
              required
              placeholder="Description"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
            />
            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(null)}
                disabled={saving}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#00A8E8] text-white hover:bg-[#0095d1]"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Model */}
      <Modal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Delete Book?"
      >
        {deleting && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{deleting.title || deleting.bookTitle}&rdquo;
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleting(null)}
                disabled={removing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                disabled={removing}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                {removing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Yes, Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
