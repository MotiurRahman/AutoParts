import Link from "next/link";
import React from "react";

export default function NotFound() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-10 overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Background grid effect */}
            <div className="absolute inset-0 bg-grid-slate-200/40 dark:bg-grid-slate-700/40 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />

            <div className="relative z-10 w-full max-w-md text-center">
                <h1 className="text-6xl font-extrabold text-gray-800 dark:text-white/90 mb-4">
                    404
                </h1>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-8">
                    Page Not Found
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
                    Sorry, we couldn’t find the page you’re looking for. It
                    might have been removed or the link is broken.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
                >
                    Back to Home Page
                </Link>
            </div>

            {/* Footer */}
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} - TailAdmin
            </p>
        </div>
    );
}
