import CreateApplicationForm from "@/app/home/applications/create/components/create-application-form/CreateApplicationForm";

export default function CreateApplicationPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6">
        <CreateApplicationForm />
      </div>
    </div>
  );
}
