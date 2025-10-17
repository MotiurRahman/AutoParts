"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken, clearToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function HeaderNav() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsLoggedIn(!!getToken());
    }, []);

    useEffect(() => {
        const update = () => setIsLoggedIn(!!getToken());
        window.addEventListener("auth-change", update);
        update();
        return () => window.removeEventListener("auth-change", update);
    }, []);

    const handleLogout = () => {
        clearToken();
        setIsLoggedIn(false);
        router.push("/login");
    };

    return (
        <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-md border-b border-gray-700">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                {/* Brand section */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-bold tracking-wide text-yellow-400"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
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

                {/* Navigation Links */}
                <div className="flex items-center gap-6 text-sm font-medium">
                    <Link
                        href="/"
                        className="hover:text-yellow-400 transition-colors"
                    >
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
                            className="text-red-500 hover:text-red-400 cursor-pointer font-semibold transition-colors"
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
            </div>
        </nav>
    );
}
