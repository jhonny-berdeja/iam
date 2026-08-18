import { type ReactNode } from "react";
import HomeSidebar from "@/app/home/components/home-sidebar/HomeSidebar";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full">
      <HomeSidebar />
      <main className="flex flex-1 flex-col p-6">{children}</main>
    </div>
  );
}
