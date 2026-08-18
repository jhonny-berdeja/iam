import AppUsersTable from "@/app/home/apps-users/list/components/app-users-table/AppUsersTable";

export default function AppUsersListPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold text-gray-900">
        Usuarios de aplicación
      </h1>
      <AppUsersTable />
    </div>
  );
}
