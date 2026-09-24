"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center px-5">
      <form onSubmit={submit} className="w-full max-w-[380px] bg-card border border-border rounded-[22px] p-8">
        <span className="w-11 h-11 rounded-xl bg-purple-wash border border-purple-line grid place-items-center text-purple mb-5">
          <Lock size={20} />
        </span>
        <h1 className="font-heading font-bold text-[1.5rem] mb-1">Admin</h1>
        <p className="text-text-soft text-[0.92rem] mb-6">Sign in to manage the site.</p>
        <input
          type="password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          aria-label="Password"
          className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-[0.95rem] text-foreground placeholder:text-text-faint focus:outline-none focus:border-purple-line"
        />
        {error && <p role="alert" className="text-red-300 text-[0.9rem] mt-3">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-purple px-6 py-3 font-heading font-semibold text-[0.95rem] text-white disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Sign in
        </button>
      </form>
    </main>
  );
}
