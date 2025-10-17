import { notFound } from "next/navigation";
import API_URLS from "@/app/utils/apiConfig";
import { Part } from "@/types";
import Link from "next/link";

export const revalidate = 60; // ISR

async function getAllParts(): Promise<Part[]> {
    const res = await fetch(`${API_URLS.PartsAPI}`, {
        next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
}

export async function generateStaticParams() {
    const parts = await getAllParts();
    return parts.slice(0, 50).map((p) => ({ id: String(p.id) }));
}

async function getPart(id: string): Promise<Part | null> {
    const res = await fetch(`${API_URLS.PartsAPI}/${id}`, {
        next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function PartDetailPage({
    params,
}: {
    // params can be a Promise in RSC
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const part = await getPart(id);
    if (!part) notFound();

    const price = `$${Number(part.price).toFixed(2)}`;
    const inStock = Number(part.stock) > 0;

    return (
        <section className="mx-auto max-w-3xl px-4 py-6 space-y-6">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500">
                <ol className="flex items-center gap-2">
                    <li>
                        <Link
                            href="/"
                            className="hover:text-yellow-600 transition-colors"
                        >
                            Home
                        </Link>
                    </li>
                    <li className="opacity-60">/</li>
                    <li>
                        <Link
                            href="/"
                            className="hover:text-yellow-600 transition-colors"
                        >
                            Parts
                        </Link>
                    </li>
                    <li className="opacity-60">/</li>
                    <li className="text-gray-800">{part.name}</li>
                </ol>
            </nav>

            {/* Header */}
            <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                        {part.name}
                    </h1>
                    <p className="text-sm text-gray-600">{part.brand}</p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 border">
                        {part.category}
                    </span>
                    <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                            inStock
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                        }`}
                    >
                        {inStock ? `In Stock: ${part.stock}` : "Out of Stock"}
                    </span>
                </div>
            </header>

            {/* Detail Card */}
            <article className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 shadow-sm">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <dt className="text-xs uppercase tracking-wide text-gray-500">
                            Brand
                        </dt>
                        <dd className="mt-1 text-base font-medium text-gray-900">
                            {part.brand}
                        </dd>
                    </div>

                    <div>
                        <dt className="text-xs uppercase tracking-wide text-gray-500">
                            Category
                        </dt>
                        <dd className="mt-1 text-base font-medium text-gray-900">
                            {part.category}
                        </dd>
                    </div>

                    <div>
                        <dt className="text-xs uppercase tracking-wide text-gray-500">
                            Price
                        </dt>
                        <dd className="mt-1 text-xl font-semibold text-green-600">
                            {price}
                        </dd>
                    </div>

                    <div>
                        <dt className="text-xs uppercase tracking-wide text-gray-500">
                            Stock
                        </dt>
                        <dd className="mt-1 text-base font-medium text-gray-900">
                            {part.stock}
                        </dd>
                    </div>
                </dl>
            </article>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <Link
                    href="/"
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    ← Back to list
                </Link>
                {/* (Optional) primary action placeholder for future: add to cart, quote, etc. */}
                {/* <button className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          Request Quote
        </button> */}
            </div>
        </section>
    );
}
