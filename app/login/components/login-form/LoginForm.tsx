"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

/**
 * Auth here is client-credentials style (clientId/clientSecret against
 * an application user), not human email/password -- see
 * auth-api/src/modules/auth/dto/login.dto.ts. No `.api.ts` yet: the
 * submit just navigates, since there's nothing to request.
 */
export default function LoginForm() {
  const router = useRouter();
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  // TODO: conectar con POST /auth/login (a través de una Route Handler
  // propia, /api/login) en una próxima iteración. Por ahora el submit
  // no autentica de verdad, solo navega a /home.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/home");
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="client-id"
          className="text-sm font-medium text-gray-700"
        >
          ID de cliente
        </label>
        <input
          id="client-id"
          type="text"
          required
          value={clientId}
          onChange={(event) => setClientId(event.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="client-secret"
          className="text-sm font-medium text-gray-700"
        >
          Secreto de cliente
        </label>
        <input
          id="client-secret"
          type="password"
          required
          value={clientSecret}
          onChange={(event) => setClientSecret(event.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <button
        type="submit"
        className="mt-2 rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        Ingresar
      </button>
    </form>
  );
}
