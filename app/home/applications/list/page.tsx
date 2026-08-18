import ApplicationsTable from "@/app/home/applications/list/components/applications-table/ApplicationsTable";

export default function ApplicationsListPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold text-gray-900">Aplicaciones</h1>
      <ApplicationsTable />
    </div>
  );
}
