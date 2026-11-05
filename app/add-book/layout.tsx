import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add a New Book",
};

export default function AddBookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
