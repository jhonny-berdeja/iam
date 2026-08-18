/** Landing de /home: solo composición, sin lógica ni fetching -- las acciones ya viven en HomeHeader. */
export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">Panel de IAM</h1>
      <p className="max-w-md text-sm text-gray-500">
        Usá las acciones de arriba para crear aplicaciones, roles y usuarios
        de aplicación
      </p>
    </div>
  );
}
