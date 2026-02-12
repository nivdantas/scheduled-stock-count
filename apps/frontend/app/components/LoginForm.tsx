"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const getBaseUrl = () => {
  if (typeof window === "undefined") return "http://backend:3000";
  return window.location.origin.includes("localhost")
    ? "http://localhost:3000"
    : window.location.origin;
};

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const baseUrl = getBaseUrl();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkSession = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/verify`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.contagemAtivaId) {
            router.push(`/contagem/${data.contagemAtivaId}`);
          } else {
            router.push("/");
          }
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Erro de sessão:", err);
        setLoading(false);
      }
    };

    checkSession();
  }, [router, baseUrl]);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
       setError("Por favor, preencha todos os campos.");
       setLoading(false);
       return;
    }

    try {
      const res = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Falha ao autenticar");

      localStorage.setItem("stock_user", JSON.stringify(data.user));

      setTimeout(() => {
        if (data.contagemAtivaId) {
          router.push(`/contagem/${data.contagemAtivaId}`);
        } else {
          router.push("/");
        }
      }, 100);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro inesperado. Tente novamente.");
      }
      setLoading(false);
    }
  }

  if (loading && !error) {
    return (
      <div
        className="flex justify-center items-center p-10 min-h-[300px]"
        role="status"
        aria-label="Verificando sessão..."
      >
        <span className="w-10 h-10 border-4 border-gray-200 border-t-stock-red-1 rounded-full animate-spin" aria-hidden="true"></span>
        <span className="sr-only">Carregando...</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-sm mx-auto px-2 sm:px-0"
      noValidate
    >
      {error && (
        <div
          className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-sm md:text-base text-red-900 animate-in fade-in slide-in-from-top-1 shadow-sm"
          role="alert"
          aria-live="polite"
        >
          <svg className="w-5 h-5 text-red-700 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-base font-medium text-gray-700"
        >
          Email
        </label>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-stock-red-1 transition-colors">
            <Image
              src="/person_icon.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
              className="opacity-60"
            />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={!!error}
            placeholder="seu.nome@empresa.com"
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stock-red-1 focus:border-stock-red-1 outline-none transition-all text-black bg-white placeholder-gray-400 text-base"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-base font-medium text-gray-700"
        >
          Senha
        </label>
        <div className="relative group">
           <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-stock-red-1 transition-colors">
            <Image
              src="/lock_icon.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
              className="opacity-60"
            />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            aria-invalid={!!error}
            placeholder="Digite sua senha"
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stock-red-1 focus:border-stock-red-1 outline-none transition-all text-black bg-white placeholder-gray-400 text-base"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="w-full bg-stock-red-1 hover:bg-stock-red-2 text-white font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-md cursor-pointer mt-6 focus:ring-4 focus:ring-red-200 outline-none"
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
            <span>Entrando...</span>
          </>
        ) : (
          <>
            Acessar Sistema
          </>
        )}
      </button>
    </form>
  );
}
