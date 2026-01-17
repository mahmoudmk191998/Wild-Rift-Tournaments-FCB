import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Trophy, Plus, Search, Eye, Edit, Trash2,
  Calendar, Users, Play, Pause, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTournaments, useCreateTournament, useUpdateTournament, useDeleteTournament, Tournament } from "@/hooks/useTournaments";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const AdminTournaments = () => {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    max_teams: 16,
    team_size: 5,
    entry_fee: 150,
    platform_fee_percentage: 10,
    tournament_type: "group_knockout" as "group_knockout" | "single_elimination",
    match_type: "bo1" as "bo1" | "bo3" | "bo5",
    num_groups: 4,
    teams_per_group_qualify: 2,
  });

  const { data: tournaments, isLoading } = useTournaments();
  const createTournament = useCreateTournament();
  const updateTournament = useUpdateTournament();
  const deleteTournament = useDeleteTournament();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, authLoading, navigate]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      start_date: "",
      max_teams: 16,
      team_size: 5,
      entry_fee: 150,
      platform_fee_percentage: 10,
      tournament_type: "group_knockout",
      match_type: "bo1",
      num_groups: 4,
      teams_per_group_qualify: 2,
    });
    setEditingTournament(null);
  };

  const handleCreateOrUpdate = async () => {
    if (!formData.name || !formData.start_date) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const tournamentData = {
      ...formData,
      status: "registration_open" as const,
      prize_pool: 0,
    };

    if (editingTournament) {
      await updateTournament.mutateAsync({ id: editingTournament.id, ...tournamentData });
    } else {
      await createTournament.mutateAsync(tournamentData as any);
    }

    setShowCreateDialog(false);
    resetForm();
  };

  const handleEdit = (tournament: Tournament) => {
    setEditingTournament(tournament);
    setFormData({
      name: tournament.name,
      description: tournament.description || "",
      start_date: tournament.start_date.split("T")[0],
      max_teams: tournament.max_teams,
      team_size: tournament.team_size,
      entry_fee: tournament.entry_fee,
      platform_fee_percentage: tournament.platform_fee_percentage,
      tournament_type: tournament.tournament_type,
      match_type: tournament.match_type,
      num_groups: tournament.num_groups || 4,
      teams_per_group_qualify: tournament.teams_per_group_qualify || 2,
    });
    setShowCreateDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه البطولة؟")) {
      await deleteTournament.mutateAsync(id);
    }
  };

  const handleStatusChange = async (tournament: Tournament, newStatus: string) => {
    await updateTournament.mutateAsync({ id: tournament.id, status: newStatus as any });
  };

  const filteredTournaments = tournaments?.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const statusConfig: Record<string, { label: string; className: string }> = {
    upcoming: { label: "قريباً", className: "badge-pending" },
    registration_open: { label: "مفتوحة", className: "badge-open" },
    registration_closed: { label: "مغلقة", className: "badge-full" },
    in_progress: { label: "جارية", className: "badge-live" },
    completed: { label: "انتهت", className: "badge-finished" },
    cancelled: { label: "ملغاة", className: "badge-rejected" },
  };

  const columns = [
    {
      key: "name",
      header: "البطولة",
      render: (t: Tournament) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{t.name}</p>
            <p className="text-xs text-muted-foreground">
              {t.tournament_type === "group_knockout" ? "مجموعات + خروج مباشر" : "خروج مباشر"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "teams",
      header: "الفرق",
      render: (t: Tournament) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>{t.max_teams} فريق</span>
        </div>
      ),
    },
    {
      key: "startDate",
      header: "التاريخ",
      render: (t: Tournament) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{new Date(t.start_date).toLocaleDateString("ar-EG")}</span>
        </div>
      ),
    },
    {
      key: "prizePool",
      header: "الجوائز",
      render: (t: Tournament) => (
        <span className="font-gaming text-gold">{(t.prize_pool || 0).toLocaleString()} ج.م</span>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      render: (t: Tournament) => (
        <span className={cn("px-3 py-1 rounded-full text-xs", statusConfig[t.status]?.className || "badge-pending")}>
          {statusConfig[t.status]?.label || t.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "إجراءات",
      render: (t: Tournament) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}>
            <Edit className="w-4 h-4" />
          </Button>
          {t.status === "registration_open" && (
            <Button variant="ghost" size="icon" className="text-success hover:text-success"
              onClick={() => handleStatusChange(t, "in_progress")}>
              <Play className="w-4 h-4" />
            </Button>
          )}
          {t.status === "in_progress" && (
            <Button variant="ghost" size="icon" className="text-warning hover:text-warning"
              onClick={() => handleStatusChange(t, "completed")}>
              <Pause className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
            onClick={() => handleDelete(t.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (authLoading || !isAdmin) {
    return (
      <AdminLayout>
        <div className="p-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-96 w-full" />
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
              <span className="text-primary text-glow-red">إدارة البطولات</span>
            </h1>
            <p className="text-muted-foreground">إنشاء وتعديل وإدارة جميع البطولات</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={(open) => { setShowCreateDialog(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button variant="gaming">
                <Plus className="w-4 h-4 ml-2" />
                بطولة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingTournament ? "تعديل البطولة" : "إنشاء بطولة جديدة"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>اسم البطولة *</Label>
                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="اسم البطولة" />
                  </div>
                  <div className="col-span-2">
                    <Label>الوصف</Label>
                    <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="وصف البطولة" />
                  </div>
                  <div>
                    <Label>تاريخ البداية *</Label>
                    <Input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
                  </div>
                  <div>
                    <Label>عدد الفرق الأقصى</Label>
                    <Input type="number" value={formData.max_teams} onChange={(e) => setFormData({ ...formData, max_teams: parseInt(e.target.value) })} />
                  </div>
                  <div>
                    <Label>حجم الفريق</Label>
                    <Input type="number" value={formData.team_size} onChange={(e) => setFormData({ ...formData, team_size: parseInt(e.target.value) })} />
                  </div>
                  <div>
                    <Label>رسوم الاشتراك (ج.م)</Label>
                    <Input type="number" value={formData.entry_fee} onChange={(e) => setFormData({ ...formData, entry_fee: parseFloat(e.target.value) })} />
                  </div>
                  <div>
                    <Label>نوع البطولة</Label>
                    <Select value={formData.tournament_type} onValueChange={(v) => setFormData({ ...formData, tournament_type: v as any })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="group_knockout">مجموعات + خروج مباشر</SelectItem>
                        <SelectItem value="single_elimination">خروج مباشر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>نوع المباريات</Label>
                    <Select value={formData.match_type} onValueChange={(v) => setFormData({ ...formData, match_type: v as any })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bo1">Best of 1</SelectItem>
                        <SelectItem value="bo3">Best of 3</SelectItem>
                        <SelectItem value="bo5">Best of 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.tournament_type === "group_knockout" && (
                    <>
                      <div>
                        <Label>عدد المجموعات</Label>
                        <Input type="number" value={formData.num_groups} onChange={(e) => setFormData({ ...formData, num_groups: parseInt(e.target.value) })} />
                      </div>
                      <div>
                        <Label>فرق تتأهل من كل مجموعة</Label>
                        <Input type="number" value={formData.teams_per_group_qualify} onChange={(e) => setFormData({ ...formData, teams_per_group_qualify: parseInt(e.target.value) })} />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setShowCreateDialog(false); resetForm(); }}>إلغاء</Button>
                <Button variant="gaming" onClick={handleCreateOrUpdate} disabled={createTournament.isPending || updateTournament.isPending}>
                  {(createTournament.isPending || updateTournament.isPending) && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                  {editingTournament ? "تحديث" : "إنشاء"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="gaming-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="بحث عن بطولة..." className="pr-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="الحالة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="registration_open">مفتوحة</SelectItem>
                <SelectItem value="in_progress">جارية</SelectItem>
                <SelectItem value="completed">انتهت</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="gaming-card">
          {isLoading ? (
            <div className="p-8">
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <DataTable data={filteredTournaments} columns={columns} />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTournaments;
