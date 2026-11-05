"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X, ChevronDown, User, Library, RotateCcw, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/books", label: "All Books" },
    { href: "/add-book", label: "Add Book" },
    { href: "/my-books", label: "My Books" },
    { href: "/my-borrows", label: "My Borrows" },
  ];

  
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await authClient.signOut();
    setDropdownOpen(false);
    setIsOpen(false);
    toast.success("Logged out successfully.");
    router.push("/");
    router.refresh();
  };

  const dropdownItems = [
    { href: "/profile", label: "Profile", icon: User },
    { href: "/my-books", label: "My Books", icon: Library },
    { href: "/my-borrows", label: "My Borrows", icon: RotateCcw },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
          <BookOpen className="h-6 w-6 text-[#00A8E8]" />
          <span>BookNook</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-[#00A8E8] ${
                pathname === link.href ? "text-[#00A8E8] font-semibold" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-border/60 py-1.5 pl-1.5 pr-3 hover:border-[#00A8E8]/40 transition-colors"
              >
                <span className="h-7 w-7 overflow-hidden rounded-full bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={session.user?.image || "https://github.com/shadcn.png"}
                    alt={session.user?.name || "Profile"}
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                  {session.user?.name}
                </span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border/60 bg-white shadow-lg py-1.5 z-50">
                  {dropdownItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-muted-foreground hover:text-[#00A8E8] hover:bg-muted/50 transition-colors"
                    >
                      <item.icon className="h-4 w-4" /> {item.label}
                    </Link>
                  ))}
                  <div className="my-1 h-px bg-border/60" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-[#00A8E8] text-white hover:bg-[#0095d1]">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-white px-6 py-4 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block text-sm font-medium transition-colors hover:text-[#00A8E8] ${
                pathname === link.href ? "text-[#00A8E8]" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className={`block text-sm font-medium transition-colors hover:text-[#00A8E8] ${
                pathname === "/profile" ? "text-[#00A8E8]" : "text-muted-foreground"
              }`}
            >
              Profile
            </Link>
          )}
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {session ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
                </Button>
                <Button asChild size="sm" className="w-full bg-[#00A8E8] text-white hover:bg-[#0095d1]">
                  <Link href="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
