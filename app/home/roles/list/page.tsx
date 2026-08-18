import RolesTable from "@/app/home/roles/list/components/roles-table/RolesTable";

export default function RolesListPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold text-gray-900">
        Roles de aplicaciones
      </h1>
      <RolesTable />
    </div>
  );
}
