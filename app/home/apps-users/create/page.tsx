import CreateAppUserForm from "@/app/home/apps-users/create/components/create-app-user-form/CreateAppUserForm";

export default function CreateAppUserPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6">
        <CreateAppUserForm />
      </div>
    </div>
  );
}
