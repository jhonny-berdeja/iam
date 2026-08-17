import CreateRoleForm from "@/app/home/roles/create/components/create-role-form/CreateRoleForm";

export default function CreateRolePage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6">
        <CreateRoleForm />
      </div>
    </div>
  );
}
