import AssignRoleToAppUserForm from "@/app/home/apps-users/assign-role/components/assign-role-to-app-user-form/AssignRoleToAppUserForm";

export default function AssignRoleToAppUserPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6">
        <AssignRoleToAppUserForm />
      </div>
    </div>
  );
}
