import InternalUsersTable from "@/app/home/internal-users/list/components/internal-users-table/InternalUsersTable";

export default function InternalUsersListPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold text-gray-900">
        Usuarios internos
      </h1>
      <InternalUsersTable />
    </div>
  );
}
