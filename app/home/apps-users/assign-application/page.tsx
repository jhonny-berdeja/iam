import AssignApplicationToAppUserForm from "@/app/home/apps-users/assign-application/components/assign-application-to-app-user-form/AssignApplicationToAppUserForm";

export default function AssignApplicationToAppUserPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6">
        <AssignApplicationToAppUserForm />
      </div>
    </div>
  );
}
