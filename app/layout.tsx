import HeaderNav from "@/components/HeaderNav";
import "./globals.css";
import React from "react";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="flex min-h-screen flex-col bg-gray-50 text-gray-800">
                {/* Header */}
                <header className="border-b bg-white">
                    <HeaderNav />
                </header>

                {/* Main content — grows to fill available space */}
                <main className="flex-grow mx-auto w-full max-w-6xl p-4">
                    {children}
                </main>

                {/* Sticky footer at bottom */}
                {/* ⚙️ Sticky Auto Parts Footer */}
                <footer className="mt-auto border-t border-gray-200 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row">
                        {/* Brand / Copyright */}
                        <p className="text-sm">
                            © {new Date().getFullYear()}{" "}
                            <span className="font-semibold text-yellow-400">
                                Auto Parts
                            </span>
                            . All rights reserved.
                        </p>

                        {/* Footer links */}
                        <div className="flex items-center gap-5 text-sm">
                            <a
                                href="#"
                                className="hover:text-yellow-400 transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="hover:text-yellow-400 transition-colors"
                            >
                                Terms
                            </a>
                            <a
                                href="mailto:support@autoparts.com"
                                className="hover:text-yellow-400 transition-colors"
                            >
                                Contact
                            </a>
                        </div>
                    </div>

                    {/* Bottom accent line */}
                    <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-blue-500 to-yellow-400" />
                </footer>
            </body>
        </html>
    );
}
