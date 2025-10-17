"use client";

import Link from "next/link";
import { setToken, getToken } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { publicApi } from "@/lib/api";
import API_URLS from "../utils/apiConfig";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { registered?: string };
}) {
  const justRegistered = searchParams?.registered === "1";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // If already logged in, go to dashboard
  useEffect(() => {
    if (getToken()) router.replace("/dashboard");
  }, [router]);

  const onSubmit = async (data: FormValues) => {
    setServerError("");
    try {
      const res = await publicApi.post(`${API_URLS.LoginAPI}`, data);
      setToken(res.data.token); // also dispatches 'auth-change'
      router.replace("/dashboard");
    } catch (e: any) {
      setServerError(e?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 shadow-md">
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <div className="rounded-md bg-yellow-100 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Login</h1>
          <p className="text-sm text-gray-500">Enter your credentials</p>
        </div>
      </div>

      {/* Success banner */}
      {justRegistered && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Account created successfully. Please log in.
        </div>
      )}

      {/* Server error */}
      {serverError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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
            />
            {/* Icon */}
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
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
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
              className={`w-full rounded-md border px-10 py-2 pr-10 text-sm outline-none transition placeholder:text-gray-400 ${
                errors.password
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              }`}
            />
            {/* Lock Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z" />
            </svg>

            {/* Show/Hide toggle */}
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
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

        {/* Submit */}
        <button
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          {isSubmitting ? "Logging in…" : "Login"}
        </button>
      </form>

      {/* Register + Forgot */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <p className="text-gray-600">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
        {/* <Link href="#" className="text-gray-600 hover:underline">
          Forgot password?
        </Link> */}
      </div>
    </div>
  );
}
