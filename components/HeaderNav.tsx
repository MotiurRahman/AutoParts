"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { getToken, clearToken } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";

export default function HeaderNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // auth state on load + custom event
  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);
  useEffect(() => {
    const update = () => setIsLoggedIn(!!getToken());
    window.addEventListener("auth-change", update);
    return () => window.removeEventListener("auth-change", update);
  }, []);

  // close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // close on ESC and outside click (while open)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!open) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-md border-b border-gray-700">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-wide text-yellow-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.5l9-9 9 9M4.5 12h15M12 3v18"
            />
          </svg>
          <span>Auto Parts</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-yellow-400 transition-colors">
            Home
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-yellow-400 transition-colors"
          >
            Dashboard
          </Link>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-400 font-semibold transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-yellow-400 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="hover:text-yellow-400 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-pressed={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle menu</span>

          {/* Icon container is non-interactive so clicks hit the button */}
          <div className="relative h-6 w-6 pointer-events-none">
            {/* Top bar */}
            <span
              className={`absolute left-0 right-0 top-1.5 h-[2.5px] rounded-full transition-all duration-300 ease-in-out
        ${open ? "top-3 rotate-45 bg-yellow-300" : "bg-yellow-400"}`}
              style={{ transformOrigin: "center" }}
            />
            {/* Middle bar */}
            <span
              className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2.5px] rounded-full transition-all duration-300 ease-in-out
        ${
          open
            ? "opacity-0 scale-x-0 bg-yellow-300"
            : "opacity-100 scale-x-100 bg-yellow-400"
        }`}
              style={{ transformOrigin: "center" }}
            />
            {/* Bottom bar */}
            <span
              className={`absolute left-0 right-0 bottom-1.5 h-[2.5px] rounded-full transition-all duration-300 ease-in-out
        ${open ? "bottom-3 -rotate-45 bg-yellow-300" : "bg-yellow-400"}`}
              style={{ transformOrigin: "center" }}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`md:hidden origin-top transition-all ${
          open
            ? "max-h-[400px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        } overflow-hidden`}
      >
        <div className="px-4 pb-4 pt-2 space-y-2 text-sm font-medium border-t border-gray-700 bg-gray-900/90 backdrop-blur">
          <Link
            href="/"
            className="block rounded px-3 py-2 hover:bg-white/10"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="block rounded px-3 py-2 hover:bg-white/10"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>

          {isLoggedIn ? (
            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="block w-full text-left rounded px-3 py-2 text-red-400 hover:bg-white/10"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="block rounded px-3 py-2 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block rounded px-3 py-2 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
