import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <AdminSidebar />
      <main className="mr-64 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
