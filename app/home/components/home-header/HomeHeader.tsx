import Link from "next/link";

const NAV_LINK_CLASSES =
  "rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100";

/**
 * Persistent chrome for every page under /home: navigation to the three
 * creation flows. Lives in home/layout.tsx, outside `children`, so it
 * stays mounted across the whole /home subtree. Plain links (no modal),
 * per "Rutas en vez de modales".
 */
export default function HomeHeader() {
  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-gray-200 bg-white px-6 py-4">
      <Link href="/home/applications/create" className={NAV_LINK_CLASSES}>
        Crear Aplicación
      </Link>
      <Link href="/home/roles/create" className={NAV_LINK_CLASSES}>
        Crear Rol
      </Link>
      <Link href="/home/apps-users/create" className={NAV_LINK_CLASSES}>
        Crear Usuario de aplicación
      </Link>
    </header>
  );
}
