"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/app/home/components/home-header/home-header.api";

export default function HomeHeader() {
  const router = useRouter();

  // No error handling on the fetch: even if it fails, the cookie can't
  // be cleared client-side (httpOnly), so redirecting to /login
  // regardless still gets the user out of any protected page.
  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-6 py-4">
      <div />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Cerrar sesión
        </button>

        <button
          type="button"
          className="h-10 w-10 rounded-full bg-gray-300"
          aria-label="Perfil de usuario"
        />
      </div>
    </header>
  );
}
