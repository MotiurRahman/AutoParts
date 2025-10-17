"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { clearToken, isAuthed } from "@/lib/auth";
import { Part } from "@/types";
import SearchBar from "@/components/SearchBar";
import PartCard from "@/components/PartCard";
import PartForm from "@/components/PartForm";
import API_URLS from "../utils/apiConfig";

export default function DashboardPage() {
    const router = useRouter();
    const [parts, setParts] = useState<Part[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Part | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isAuthed()) {
            router.replace("/login");
            return;
        }
        (async () => {
            try {
                setLoading(true);
                const res = await api.get(`${API_URLS.PartsAPI}`);
                setParts(res.data);
            } catch (e: any) {
                setError(e?.response?.data?.message || "Failed to load parts");
            } finally {
                setLoading(false);
            }
        })();
    }, [router]);

    const totals = useMemo(() => {
        const categories = new Set(parts.map((p) => p.category));
        return {
            totalParts: parts.length,
            categoriesCount: categories.size,
        };
    }, [parts]);

    const onCreate = () => {
        setEditing(null);
        setShowForm(true);
    };

    const onEdit = (p: Part) => {
        setEditing(p);
        setShowForm(true);
    };

    const onDelete = async (id: number) => {
        if (!confirm("Delete this part?")) return;
        await api.delete(`${API_URLS.PartsAPI}/${id}`);
        setParts((prev) => prev.filter((p) => p.id !== id));
    };

    const onSubmitForm = async (
        data: Omit<Part, "id" | "created_at"> & { id?: number }
    ) => {
        if (editing) {
            const res = await api.put(
                `${API_URLS.PartsAPI}/${editing.id}`,
                data
            );
            setParts((prev) =>
                prev.map((p) => (p.id === editing.id ? res.data : p))
            );
        } else {
            const res = await api.post(`${API_URLS.PartsAPI}`, data);
            setParts((prev) => [res.data, ...prev]);
        }
        setShowForm(false);
        setEditing(null);
    };

    if (!isAuthed()) return null; // prevents flicker

    return (
        <section className="space-y-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <p className="text-sm text-gray-500">
                        Manage parts (client-side rendering)
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onCreate}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        + Add Part
                    </button>
                </div>
            </div>

            {/* Analytics */}
            <div className="grid gap-6 sm:grid-cols-2">
                {/* Total Parts */}
                <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-600">
                            Total Parts
                        </p>
                        <div className="rounded-full bg-yellow-100 p-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-5 w-5 text-yellow-600"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9.75 17L8 21l4-2 4 2-1.75-4M12 3v9m0 0l-3-3m3 3l3-3"
                                />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-gray-900 tracking-tight">
                        {totals.totalParts}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 uppercase">
                        Available in stock
                    </p>
                </div>

                {/* Categories */}
                <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-600">
                            Categories
                        </p>
                        <div className="rounded-full bg-blue-100 p-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-5 w-5 text-blue-600"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-gray-900 tracking-tight">
                        {totals.categoriesCount}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 uppercase">
                        Unique part types
                    </p>
                </div>
            </div>

            {/* Search + list */}
            {loading ? (
                <p>Loading…</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : (
                <SearchBar
                    items={parts}
                    render={(filtered) => (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {filtered.map((p) => (
                                <PartCard
                                    key={p.id}
                                    part={p}
                                    onEdit={() => onEdit(p)}
                                    onDelete={() => onDelete(p.id)}
                                    dashboard
                                />
                            ))}
                            {filtered.length === 0 && (
                                <p className="col-span-full text-center text-gray-500">
                                    No parts match your search.
                                </p>
                            )}
                        </div>
                    )}
                />
            )}

            {/* Modal form */}
            {showForm && (
                <PartForm
                    initial={editing ?? undefined}
                    onCancel={() => {
                        setShowForm(false);
                        setEditing(null);
                    }}
                    onSubmit={onSubmitForm}
                />
            )}
        </section>
    );
}
