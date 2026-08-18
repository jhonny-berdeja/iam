import AssignApplicationToInternalUserForm from "@/app/home/internal-users/assign-application/components/assign-application-to-internal-user-form/AssignApplicationToInternalUserForm";

export default function AssignApplicationToInternalUserPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6">
        <AssignApplicationToInternalUserForm />
      </div>
    </div>
  );
}
