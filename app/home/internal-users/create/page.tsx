import CreateInternalUserForm from "@/app/home/internal-users/create/components/create-internal-user-form/CreateInternalUserForm";

export default function CreateInternalUserPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6">
        <CreateInternalUserForm />
      </div>
    </div>
  );
}
