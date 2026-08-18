import { type ReactNode } from "react";
import HomeHeader from "@/app/home/components/home-header/HomeHeader";
import HomeSidebar from "@/app/home/components/home-sidebar/HomeSidebar";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <HomeHeader />
      <div className="flex flex-1">
        <HomeSidebar />
        <main className="flex flex-1 flex-col p-6">{children}</main>
      </div>
    </div>
  );
}
