"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import API_URLS from "../utils/apiConfig";
import { publicApi } from "@/lib/api";

const schema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const [serverError, setServerError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: FormValues) => {
        setServerError("");
        try {
            await publicApi.post(`${API_URLS.RegisterAPI}`, {
                name: data.name,
                email: data.email,
                password: data.password,
            });
            router.replace("/login?registered=1");
        } catch (e: any) {
            const msg =
                e?.response?.data?.error ||
                e?.response?.data?.message ||
                "Registration failed";
            setServerError(msg);
        }
    };

    return (
        <div className="mx-auto max-w-sm rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 shadow-md">
            {/* Header */}
            <div className="mb-5 flex items-center gap-2">
                <div className="rounded-md bg-yellow-100 p-2">
                    {/* wrench icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-600"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M22 19.07l-7.05-7.05a6.5 6.5 0 11-2.83-2.83L19.17 16.24l.71-.71a1 1 0 011.41 0l.71.71a1 1 0 010 1.41l-.71.71a1 1 0 01-1.41 0l-.71-.71zM9.5 14A4.5 4.5 0 109.5 5a4.5 4.5 0 000 9z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                        Register
                    </h1>
                    <p className="text-sm text-gray-500">
                        Create your account to manage auto parts
                    </p>
                </div>
            </div>

            {/* Server error */}
            {serverError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {serverError}
                </div>
            )}

            <form
                className="space-y-4"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                {/* Name */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        {...register("name")}
                        aria-invalid={!!errors.name}
                        className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition placeholder:text-gray-400 ${
                            errors.name
                                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                        }`}
                        placeholder="Jane Doe"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            {...register("email")}
                            aria-invalid={!!errors.email}
                            className={`w-full rounded-md border px-10 py-2 text-sm outline-none transition placeholder:text-gray-400 ${
                                errors.email
                                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                            }`}
                            placeholder="you@example.com"
                        />
                        {/* mail icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M20 4H4a2 2 0 00-2 2v.4l10 6.25L22 6.4V6a2 2 0 00-2-2z" />
                            <path d="M22 8.25l-10 6.25L2 8.25V18a2 2 0 002 2h16a2 2 0 002-2V8.25z" />
                        </svg>
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                            aria-invalid={!!errors.password}
                            className={`w-full rounded-md border px-10 py-2 pr-12 text-sm outline-none transition placeholder:text-gray-400 ${
                                errors.password
                                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                            }`}
                            placeholder="••••••••"
                        />
                        {/* lock icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z" />
                        </svg>
                        {/* toggle */}
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            {...register("confirmPassword")}
                            aria-invalid={!!errors.confirmPassword}
                            className={`w-full rounded-md border px-3 py-2 pr-12 text-sm outline-none transition placeholder:text-gray-400 ${
                                errors.confirmPassword
                                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                            }`}
                            placeholder="••••••••"
                        />
                        {/* toggle */}
                        <button
                            type="button"
                            onClick={() => setShowConfirm((s) => !s)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            aria-label={
                                showConfirm ? "Hide password" : "Show password"
                            }
                        >
                            {showConfirm ? "Hide" : "Show"}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <button
                    disabled={isSubmitting}
                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                    {isSubmitting ? "Registering…" : "Register"}
                </button>
            </form>

            {/* Login hint */}
            <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                    Login
                </Link>
            </p>
        </div>
    );
}
