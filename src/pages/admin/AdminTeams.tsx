import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Shield, Search, Eye, Trash2, 
  Users, Lock, Unlock, Trophy
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { useTeams, useDeleteTeam, useUpdateTeam, useTeamMembers } from "@/hooks/useTeams";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Team {
  id: string;
  name: string;
  captain_id: string | null;
  tournament_id: string;
  status: string;
  is_locked: boolean | null;
  team_members?: { user_id: string }[];
  tournaments?: { name: string; team_size: number } | null;
}

const AdminTeams = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const { data: selectedMembers, isLoading: membersLoading } = useTeamMembers(selectedTeam?.id);

  const { data: teams, isLoading } = useTeams();
  const deleteTeam = useDeleteTeam();
  const updateTeam = useUpdateTeam();

  const filteredTeams = teams?.filter(t => {
    const matchesSearch = t.name.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleToggleLock = (team: Team) => {
    updateTeam.mutate({
      id: team.id,
      is_locked: !team.is_locked
    });
  };

  const handleOpen = (team: Team) => {
    setSelectedTeam(team);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTeam.mutate(id);
  };

  const statusConfig: Record<string, { label: string; className: string }> = {
    incomplete: { label: "غير مكتمل", className: "badge-pending" },
    pending_payment: { label: "في انتظار الدفع", className: "bg-warning/20 text-warning border border-warning/30" },
    registered: { label: "مسجل", className: "badge-approved" },
    qualified: { label: "متأهل", className: "bg-success/20 text-success border border-success/30" },
    eliminated: { label: "خرج", className: "bg-destructive/20 text-destructive border border-destructive/30" },
  };

  const columns = [
    {
      key: "name",
      header: "الفريق",
      render: (t: Team) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{t.name}</p>
              {t.is_locked && <Lock className="w-3 h-3 text-muted-foreground" />}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "players",
      header: "اللاعبين",
      render: (t: Team) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className={cn(
            (t.team_members?.length || 0) === (t.tournaments?.team_size || 5) ? "text-success" : "text-warning"
          )}>
            {t.team_members?.length || 0}/{t.tournaments?.team_size || 5}
          </span>
        </div>
      ),
    },
    {
      key: "tournament",
      header: "البطولة",
      render: (t: Team) => (
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{t.tournaments?.name || "غير محدد"}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      render: (t: Team) => (
        <span className={cn("px-3 py-1 rounded-full text-xs", statusConfig[t.status]?.className || "badge-pending")}>
          {statusConfig[t.status]?.label || t.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "إجراءات",
      render: (t: Team) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => handleOpen(t)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleToggleLock(t)}
            className={t.is_locked ? "text-warning hover:text-warning" : ""}
          >
            {t.is_locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>حذف الفريق</AlertDialogTitle>
                <AlertDialogDescription>
                  هل أنت متأكد من حذف فريق "{t.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(t.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  حذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-gaming text-3xl font-bold">
              <span className="text-primary text-glow-red">إدارة الفرق</span>
            </h1>
            <p className="text-muted-foreground">عرض وتعديل جميع الفرق المسجلة</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="gaming-card p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">إجمالي الفرق</p>
            <p className="font-gaming text-2xl text-primary">{teams?.length || 0}</p>
          </div>
          <div className="gaming-card p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">فرق مسجلة</p>
            <p className="font-gaming text-2xl text-success">{teams?.filter(t => t.status === "registered").length || 0}</p>
          </div>
          <div className="gaming-card p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">فرق مقفلة</p>
            <p className="font-gaming text-2xl">{teams?.filter(t => t.is_locked).length || 0}</p>
          </div>
          <div className="gaming-card p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">في انتظار الدفع</p>
            <p className="font-gaming text-2xl text-warning">{teams?.filter(t => t.status === "pending_payment").length || 0}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="gaming-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="بحث عن فريق..." 
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="حالة الفريق" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="incomplete">غير مكتمل</SelectItem>
                <SelectItem value="pending_payment">في انتظار الدفع</SelectItem>
                <SelectItem value="registered">مسجل</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="gaming-card">
          <DataTable data={filteredTeams} columns={columns} />
        </div>

        {/* Team Details Sheet */}
        <Sheet open={open} onOpenChange={(val) => { if (!val) setSelectedTeam(null); setOpen(val); }}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>تفاصيل الفريق</SheetTitle>
              <SheetDescription>عرض معلومات الفريق وإدارته</SheetDescription>
            </SheetHeader>

            <div className="space-y-4 mt-4">
              {selectedTeam ? (
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-muted/20 flex items-center justify-center text-2xl font-bold">
                        {selectedTeam.name?.[0]?.toUpperCase() || "T"}
                      </div>
                      <div>
                        <p className="font-medium text-lg">{selectedTeam.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedTeam.tournaments?.name || 'غير محدد'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("px-3 py-1 rounded-full text-sm", statusConfig[selectedTeam.status]?.className || "badge-pending")}>{statusConfig[selectedTeam.status]?.label || selectedTeam.status}</span>
                      <Button size="sm" variant="outline" onClick={() => handleToggleLock(selectedTeam)}>
                        {selectedTeam.is_locked ? 'إلغاء القفل' : 'قفل الفريق'}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">عدد اللاعبين</p>
                        <p className="font-medium">{selectedTeam.team_members?.length || 0} / {selectedTeam.tournaments?.team_size || 5}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">قائد الفريق</p>
                        <p className="font-medium">{selectedMembers?.find(m => m.user_id === selectedTeam.captain_id)?.profiles?.username || 'غير معلوم'}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">الأعضاء</p>
                      <div className="space-y-2 max-h-56 overflow-auto">
                        {membersLoading ? (
                          <p className="text-muted-foreground">جارٍ التحميل...</p>
                        ) : selectedMembers && selectedMembers.length > 0 ? (
                          selectedMembers.map((m) => (
                            <div key={m.id} className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-muted/10">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-medium text-sm">
                                  {m.profiles?.username?.[0]?.toUpperCase() || m.user_id?.[0] || '?'}
                                </div>
                                <div>
                                  <div className="font-medium">{m.profiles?.username || m.user_id}</div>
                                  <div className="text-xs text-muted-foreground">{m.profiles?.riot_id || m.riot_id || '—'} • {m.profiles?.rank || '—'}</div>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {m.user_id === selectedTeam.captain_id && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">قائد</span>}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground">لا يوجد أعضاء</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">لم يتم اختيار فريق</p>
              )}
            </div>

            <SheetFooter>
              <div className="flex items-center gap-2">
                <SheetClose className="btn">إغلاق</SheetClose>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </AdminLayout>
  );
};

export default AdminTeams;
