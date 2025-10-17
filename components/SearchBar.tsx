"use client";
import { useMemo, useState } from "react";
import { Part } from "@/types";

type Props = {
    items: Part[];
    render: (filteredParts: Part[]) => React.ReactNode;
};

export default function SearchBar({ items, render }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    // Extract unique categories
    const uniqueCategories = useMemo(
        () => Array.from(new Set(items.map((part) => part.category))).sort(),
        [items]
    );

    // Filter logic
    const filteredParts = useMemo(() => {
        const normalizedQuery = searchQuery.toLowerCase();

        return items.filter((part) => {
            const matchesQuery =
                !normalizedQuery ||
                [part.name, part.brand, part.category].some((fieldValue) =>
                    fieldValue.toLowerCase().includes(normalizedQuery)
                );

            const matchesCategory =
                !selectedCategory || part.category === selectedCategory;

            return matchesQuery && matchesCategory;
        });
    }, [items, searchQuery, selectedCategory]);

    return (
        <div className="space-y-5">
            {/* Filter Panel */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 shadow-sm">
                {/* Search box */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 bg-white px-10 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                        placeholder="Search by name, brand, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
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

                {/* Category dropdown */}
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

                    {/* Dropdown icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-400"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>

            {/* Filtered results */}
            {render(filteredParts)}
        </div>
    );
}
