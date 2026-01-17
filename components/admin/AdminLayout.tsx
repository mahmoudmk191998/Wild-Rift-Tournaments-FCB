import { ReactNode, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Sidebar for large screens */}
      <AdminSidebar />

      {/* Mobile menu button */}
      <Button variant="ghost" className="lg:hidden fixed top-4 right-4 z-50" onClick={() => setIsDrawerOpen(true)}>
        <Menu className="w-5 h-5" />
      </Button>

      {/* Drawer for mobile sidebar */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-w-xs right-0">
          <div className="h-full">
            <AdminSidebar isDrawer />
          </div>
        </DrawerContent>
      </Drawer>

      <main className="lg:mr-64 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
