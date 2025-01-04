"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white">
      <div className="w-full max-w-md bg-gray-700 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Welcome</h1>
        <p className="mb-4">Please log in to access the dashboard.</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full p-2 mb-4 bg-red-500 rounded-lg hover:bg-red-600"
        >
          Sign in with Google
        </button>
        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="w-full p-2 bg-gray-900 rounded-lg hover:bg-gray-700"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
