import PartsListClient from "@/components/PartsListClient";
import { Part } from "@/types";
import API_URLS from "./utils/apiConfig";

async function getParts(): Promise<Part[]> {
    try {
        const res = await fetch(`${API_URLS.PartsAPI}`, {
            cache: "no-store",
            // next: { revalidate: 0 } // optional; `no-store` already disables caching
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
            console.error(
                "Failed to fetch parts:",
                res.status,
                await res.text()
            );
            return [];
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("Fetch error:", err);
        return [];
    }
}

export default async function HomePage() {
    const parts = await getParts();

    return (
        <section className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">All Parts</h1>
                <p className="text-sm text-gray-500">
                    Server-side rendered list
                </p>
            </div>

            <PartsListClient items={parts ?? []} />
        </section>
    );
}
