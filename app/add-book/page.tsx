"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookPlus, Loader2, Upload, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getClientAuthHeaders } from "@/lib/client-auth";
import { toast } from "sonner";

// Uploads the selected file to imgbb and returns the hosted URL.
async function uploadToImgbb(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey || apiKey === "your_imgbb_api_key_here") {
    throw new Error("Image upload is not configured. Add NEXT_PUBLIC_IMGBB_API_KEY to .env or paste an image URL instead.");
  }

  const body = new FormData();
  body.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body,
  });

  if (!res.ok) {
    throw new Error("Failed to upload image to imgbb.");
  }

  const json = await res.json();
  return json?.data?.url as string;
}

export default function AddBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      e.target.value = "";
      return;
    }
    // Local preview; the imgbb upload happens on submit.
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setPreviewUrl("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const file = fileInputRef.current?.files?.[0];

    try {
      let imageUrl = (formData.get("imageUrl") as string) || "";

      // A chosen file takes precedence over a manually typed URL.
      if (file) {
        setUploading(true);
        toast.info("Uploading image to imgbb...");
        imageUrl = await uploadToImgbb(file);
        setUploading(false);
      }

      if (!imageUrl) {
        throw new Error("Please upload a cover image or provide an image URL.");
      }

      // Attach the logged-in user so "My Books" can filter by owner.
      const { data: sessionData } = await authClient.getSession();
      const userEmail = sessionData?.user?.email || "";

      const bookData = {
        title: formData.get("title"),
        author: formData.get("author"),
        category: formData.get("category"),
        imageUrl,
        totalCopies: Number(formData.get("totalCopies")),
        description: formData.get("description"),
        userEmail,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        method: "POST",
        headers: await getClientAuthHeaders(),
        body: JSON.stringify(bookData),
      });

      if (!res.ok) {
        throw new Error("Failed to add book. Please try again.");
      }

      toast.success("Book added to the library!");
      router.push("/books");
      router.refresh();
    } catch (err: unknown) {
      setUploading(false);
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#00A8E8]">Contribute</span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-1">Add a New Book</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Share a book with the community by adding it to the library catalog.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-border/60 shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Book Title</label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g. Atomic Habits"
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Author Name</label>
            <input
              type="text"
              name="author"
              required
              placeholder="e.g. James Clear"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <select
              name="category"
              required
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8] bg-white"
            >
              <option value="Fiction">Fiction</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Kids">Kids</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Cover Image (upload to imgbb)</label>
          <div className="flex items-center gap-3">
            <label className="flex-1 cursor-pointer rounded-md border border-dashed border-border px-3 py-2.5 text-sm text-muted-foreground hover:border-[#00A8E8] hover:text-[#00A8E8] transition-colors flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {previewUrl ? "Replace image" : "Choose an image file"}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                name="imageFile"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {previewUrl && (
              <button
                type="button"
                onClick={clearFile}
                className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-red-600 hover:border-red-200"
                aria-label="Remove selected image"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {previewUrl && (
            <div className="mt-2 aspect-[4/3] w-40 overflow-hidden rounded-md border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Cover preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Image URL <span className="text-muted-foreground font-normal">(optional, if not uploading a file)</span>
          </label>
          <input
            type="url"
            name="imageUrl"
            placeholder="https://image-link.com"
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Total Copies</label>
          <input
            type="number"
            name="totalCopies"
            min="1"
            required
            placeholder="e.g. 5"
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Description</label>
          <textarea
            name="description"
            rows={4}
            required
            placeholder="Write a brief summary of the book..."
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-[#00A8E8] text-white hover:bg-[#0095d1]"
        >
          {loading || uploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <BookPlus className="mr-2 h-4 w-4" />
          )}
          {uploading ? "Uploading image..." : "Add Book to Library"}
        </Button>
      </form>
    </div>
  );
}
