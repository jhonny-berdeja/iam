"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { login, LoginApiError } from "@/app/login/components/login-form/login-form.api";

const GENERIC_ERROR_MESSAGE = "No se pudo iniciar sesión. Intentá de nuevo.";
const HOME_PATH = "/home";

/**
 * Human login (internal-users email/password), not client-credentials --
 * this is the admin console, opened by a person, not another app. See
 * auth-api/src/modules/internal-users/dto/login-internal-user.dto.ts.
 */
export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      router.push(HOME_PATH);
    } catch (submitError) {
      setError(
        submitError instanceof LoginApiError
          ? submitError.message
          : GENERIC_ERROR_MESSAGE,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          required
          maxLength={30}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-password" className="text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          id="login-password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-60"
      >
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
