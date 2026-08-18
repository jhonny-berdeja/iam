import Link from "next/link";

const NAV_LINK_CLASSES =
  "rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100";

/**
 * Persistent chrome for every page under /home: navigation to every
 * creation/assignment flow. Lives in home/layout.tsx, outside `children`,
 * so it stays mounted across the whole /home subtree -- same principle as
 * the header it replaces, just vertical. Plain links (no modal), per
 * "Rutas en vez de modales".
 */
export default function HomeSidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-1 border-r border-gray-200 bg-white p-4">
      <Link href="/home/applications/create" className={NAV_LINK_CLASSES}>
        Crear aplicación
      </Link>
      <Link href="/home/roles/create" className={NAV_LINK_CLASSES}>
        Crear rol
      </Link>
      <Link href="/home/apps-users/create" className={NAV_LINK_CLASSES}>
        Crear usuario de aplicación
      </Link>
      <Link href="/home/internal-users/create" className={NAV_LINK_CLASSES}>
        Crear usuario interno
      </Link>
      <Link
        href="/home/apps-users/assign-application"
        className={NAV_LINK_CLASSES}
      >
        Asignar app a usuario de aplicación
      </Link>
      <Link
        href="/home/internal-users/assign-application"
        className={NAV_LINK_CLASSES}
      >
        Asignar app a usuario interno
      </Link>
      <Link href="/home/apps-users/assign-role" className={NAV_LINK_CLASSES}>
        Asignar rol a usuario de aplicación
      </Link>
      <Link
        href="/home/internal-users/assign-role"
        className={NAV_LINK_CLASSES}
      >
        Asignar rol a usuario interno
      </Link>
    </aside>
  );
}
