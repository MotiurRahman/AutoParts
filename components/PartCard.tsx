import Link from "next/link";
import { Part } from "@/types";

export default function PartCard({
    part,
    onEdit,
    onDelete,
    dashboard = false,
}: {
    part: Part;
    onEdit?: () => void;
    onDelete?: () => void;
    dashboard?: boolean;
}) {
    return (
        <div className="group flex h-full flex-col justify-between rounded-xl border border-gray-300 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            {/* Top section */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                    {part.name}
                </h3>
                <p className="text-sm text-gray-600">{part.brand}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
                    <p>
                        <span className="text-gray-500">Category:</span>{" "}
                        <span className="font-medium">{part.category}</span>
                    </p>
                    <p>
                        <span className="text-gray-500">Stock:</span>{" "}
                        <span className="font-medium">{part.stock}</span>
                    </p>
                    <p className="col-span-2">
                        <span className="text-gray-500">Price:</span>{" "}
                        <span className="font-semibold text-green-600">
                            ${Number(part.price).toFixed(2)}
                        </span>
                    </p>
                </div>
            </div>

            {/* Action section */}
            <div className="mt-5 flex items-center gap-4 text-sm">
                <Link
                    href={`/parts/${part.id}`}
                    className="inline-block rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700 transition-colors"
                >
                    View
                </Link>

                {dashboard && (
                    <>
                        <button
                            onClick={onEdit}
                            className="inline-block rounded-md bg-amber-500 px-3 py-1.5 text-white hover:bg-amber-600 transition-colors"
                        >
                            Edit
                        </button>

                        <button
                            onClick={onDelete}
                            className="inline-block rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-700 transition-colors"
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
