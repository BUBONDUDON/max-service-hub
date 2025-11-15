import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F3] dark:bg-[#0D0D0D]">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
