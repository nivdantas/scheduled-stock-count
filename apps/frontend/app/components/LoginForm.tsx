"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const baseUrl = typeof window === 'undefined'
  ? 'http://backend:3000'
  : 'http://localhost:3000';

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ email, password }),
        cache: 'no-store'
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Falha ao autenticar");

      localStorage.setItem("stock_token", data.token);
      localStorage.setItem("stock_user", JSON.stringify(data.user));
      if (data.contagemAtivaId) {
        router.push(`/contagem/${data.contagemAtivaId}`);
      } else {
        router.push("/");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-sm">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-900 animate-in fade-in slide-in-from-top-1 justify-center">
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Corporativo
        </label>
        <div className="relative">
        <Image src="/person_icon.svg" alt="person icon" width={24} height={24} className="absolute left-3 top-3"></Image>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="seu.nome@empresa.com"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stock-red-1 focus:border-stock-red-1 outline-none transition-all text-black"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Senha
        </label>
        <div className="relative">
        <Image src="/lock_icon.svg" alt="lock icon" width={24} height={24} className="absolute left-3 top-3"></Image>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="senha"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stock-red-1 focus:border-stock-red-1 outline-none transition-all text-black"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-stock-red-1 hover:bg-stock-red-2 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm cursor-pointer"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-neutral-400 border-t-white rounded-full animate-spin " />
        ) : (
          <>
            Acessar Sistema
          </>
        )}
      </button>
    </form>
  );
}
