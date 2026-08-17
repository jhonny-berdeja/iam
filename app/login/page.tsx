import LoginForm from "@/app/login/components/login-form/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Iniciar sesión
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Ingresá las credenciales de tu aplicación cliente.
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
