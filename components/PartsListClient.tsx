"use client";

import { useMemo, useState } from "react";
import { Part } from "@/types";
import PartCard from "./PartCard";

export default function PartsListClient({
    items = [] as Part[],
}: {
    items?: Part[];
}) {
    // Always work with a valid array
    const validParts = items ?? [];

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    // Unique, sorted categories
    const uniqueCategories = useMemo(
        () =>
            Array.from(new Set(validParts.map((part) => part.category))).sort(),
        [validParts]
    );

    // Filter logic
    const filteredParts = useMemo(() => {
        const normalizedQuery = searchQuery.toLowerCase();

        return validParts.filter((part) => {
            const matchesSearch =
                !normalizedQuery ||
                [part.name, part.brand, part.category].some((fieldValue) =>
                    fieldValue.toLowerCase().includes(normalizedQuery)
                );

            const matchesCategory =
                !selectedCategory || part.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [validParts, searchQuery, selectedCategory]);

    return (
        <div className="space-y-5">
            {/* Filter Panel */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 shadow-sm">
                {/* Search */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 bg-white px-10 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                        placeholder="Search by name, brand, or category…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {/* Search icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9 3.5a5.5 5.5 0 104.478 9.035l3.496 3.496a.75.75 0 101.06-1.06l-3.496-3.497A5.5 5.5 0 009 3.5zM5 9a4 4 0 118 0A4 4 0 015 9z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>

                {/* Category */}
                <div className="relative sm:w-64">
                    <select
                        className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {uniqueCategories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    {/* Caret */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-400"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        fill="none"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>

                {/* Reset (optional but handy) */}
                <button
                    onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("");
                    }}
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                    Reset
                </button>
            </div>

            {/* Parts Grid / Empty State */}
            {validParts.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 text-sm text-gray-700 shadow-sm">
                    <p className="font-medium">No parts to show.</p>
                    <p className="mt-2 text-xs text-gray-500">
                        Check{" "}
                        <code className="rounded bg-gray-100 px-1">
                            NEXT_PUBLIC_API_BASE_URL
                        </code>
                        , CORS, and ensure your backend’s{" "}
                        <code className="rounded bg-gray-100 px-1">
                            /api/parts
                        </code>{" "}
                        returns an array.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredParts.map((part) => (
                        <PartCard key={part.id} part={part} />
                    ))}

                    {filteredParts.length === 0 && (
                        <p className="col-span-full text-center text-gray-500">
                            No parts match your search.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
