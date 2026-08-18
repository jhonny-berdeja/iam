import AssignRoleToInternalUserForm from "@/app/home/internal-users/assign-role/components/assign-role-to-internal-user-form/AssignRoleToInternalUserForm";

export default function AssignRoleToInternalUserPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6">
        <AssignRoleToInternalUserForm />
      </div>
    </div>
  );
}
