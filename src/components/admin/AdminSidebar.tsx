import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Trophy, Users, Wallet, 
  FileText, Settings, Shield, Layers, 
  MessageSquare, Bell, LogOut, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { 
    label: "لوحة التحكم", 
    icon: LayoutDashboard, 
    path: "/admin" 
  },
  { 
    label: "البطولات", 
    icon: Trophy, 
    path: "/admin/tournaments" 
  },
  { 
    label: "المجموعات", 
    icon: Layers, 
    path: "/admin/groups" 
  },
  { 
    label: "الفرق", 
    icon: Shield, 
    path: "/admin/teams" 
  },
  { 
    label: "اللاعبين", 
    icon: Users, 
    path: "/admin/players" 
  },
  { 
    label: "المدفوعات", 
    icon: Wallet, 
    path: "/admin/payments" 
  },
  { 
    label: "المحتوى", 
    icon: FileText, 
    path: "/admin/content" 
  },
  { 
    label: "الإعدادات", 
    icon: Settings, 
    path: "/admin/settings" 
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  
  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-card border-l border-border/50 z-40 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-gaming text-lg font-bold text-primary">لوحة الإدارة</h1>
            <p className="text-xs text-muted-foreground">WR Arena</p>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== "/admin" && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                isActive 
                  ? "bg-primary/20 text-primary border border-primary/30" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-border/50 space-y-2">
        <Link 
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>العودة للموقع</span>
        </Link>
        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
          <LogOut className="w-5 h-5 ml-3" />
          تسجيل الخروج
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
