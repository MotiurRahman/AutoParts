"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Part } from "@/types";
import { useEffect } from "react";

const partSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    brand: z.string().min(1, "Brand is required"),
    price: z.number().min(0, "Price must be ≥ 0"),
    stock: z.number().int().min(0, "Stock must be an integer ≥ 0"),
    category: z.string().min(1, "Category is required"),
});

type PartFormValues = z.infer<typeof partSchema>;

export default function PartForm({
    initial,
    onCancel,
    onSubmit,
}: {
    initial?: Part;
    onCancel: () => void;
    onSubmit: (data: PartFormValues) => Promise<void> | void;
}) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<PartFormValues>({
        resolver: zodResolver(partSchema),
        defaultValues: {
            name: "",
            brand: "",
            price: 0,
            stock: 0,
            category: "",
        },
    });

    useEffect(() => {
        if (initial) {
            reset({
                name: initial.name,
                brand: initial.brand,
                price: initial.price,
                stock: initial.stock,
                category: initial.category,
            });
        } else {
            reset({
                name: "",
                brand: "",
                price: 0,
                stock: 0,
                category: "",
            });
        }
    }, [initial, reset]);

    const submit = async (data: PartFormValues) => {
        await onSubmit(data);
    };

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="part-form-title"
            onClick={onCancel} // click outside closes
        >
            <div
                className="w-full max-w-md rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()} // prevent overlay close on inner click
            >
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2
                        id="part-form-title"
                        className="text-lg font-semibold text-gray-900"
                    >
                        {initial ? "Edit Part" : "Add Part"}
                    </h2>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-md p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        aria-label="Close modal"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 
                1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 
                1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 
                10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form className="space-y-4" onSubmit={handleSubmit(submit)}>
                    {(["name", "brand", "category"] as const).map((field) => (
                        <div key={field}>
                            <label className="mb-1 block text-sm font-medium text-gray-700 capitalize">
                                {field}
                            </label>
                            <input
                                className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition
                  placeholder:text-gray-400
                  ${
                      errors[field]
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                  }
                `}
                                {...register(field)}
                                placeholder={`Enter ${field}`}
                            />
                            {errors[field] && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors[field]?.message}
                                </p>
                            )}
                        </div>
                    ))}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Price
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition
                  ${
                      errors.price
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                  }
                `}
                                {...register("price", { valueAsNumber: true })}
                                placeholder="0.00"
                            />
                            {errors.price && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.price.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Stock
                            </label>
                            <input
                                type="number"
                                className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition
                  ${
                      errors.stock
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                  }
                `}
                                {...register("stock", { valueAsNumber: true })}
                                placeholder="0"
                                min={0}
                            />
                            {errors.stock && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.stock.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isSubmitting}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            {isSubmitting ? "Saving…" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
