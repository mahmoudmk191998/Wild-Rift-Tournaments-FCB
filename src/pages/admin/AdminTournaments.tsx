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
import { useAllSiteContent } from "@/hooks/useSiteContent";
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
    prize_pool: 0,
    platform_fee_percentage: 10,
    tournament_type: "group_knockout" as "group_knockout" | "single_elimination",
    match_type: "bo1" as "bo1" | "bo3" | "bo5",
    num_groups: 4,
    teams_per_group_qualify: 2,
  });

  const [payoutPlaces, setPayoutPlaces] = useState<number>(3);

  const { data: siteContent } = useAllSiteContent();
  const [prizePercents, setPrizePercents] = useState({ first: 50, second: 30, third: 20 });
  const [computedPrizes, setComputedPrizes] = useState({ first: 0, second: 0, third: 0 });

  const { data: tournaments, isLoading } = useTournaments();
  const createTournament = useCreateTournament();
  const updateTournament = useUpdateTournament();
  const deleteTournament = useDeleteTournament();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (siteContent) {
      const settings = siteContent.find((c: any) => c.key === "settings");
      if (settings && settings.metadata) {
        const meta = settings.metadata as any;
        const f = parseInt(meta.firstPlace || "60");
        const s = parseInt(meta.secondPlace || "25");
        const t = parseInt(meta.thirdPlace || "15");
        setPrizePercents({ first: f, second: s, third: t });
        setPayoutPlaces(meta.payoutPlaces ? Number(meta.payoutPlaces) : 3);
      }
    }
  }, [siteContent]);

  useEffect(() => {
    const total = Number(formData.prize_pool) || 0;
    setComputedPrizes({
      first: payoutPlaces >= 1 ? Math.round(total * (prizePercents.first || 0) / 100) : 0,
      second: payoutPlaces >= 2 ? Math.round(total * (prizePercents.second || 0) / 100) : 0,
      third: payoutPlaces >= 3 ? Math.round(total * (prizePercents.third || 0) / 100) : 0,
    });
  }, [formData.prize_pool, prizePercents]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      start_date: "",
      max_teams: 16,
      team_size: 5,
      entry_fee: 150,
      prize_pool: 0,
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

    const percentSum = (payoutPlaces >= 1 ? prizePercents.first : 0) + (payoutPlaces >= 2 ? prizePercents.second : 0) + (payoutPlaces >= 3 ? prizePercents.third : 0);
    if (percentSum !== 100) {
      toast.error("مجموع نسب توزيع الجوائز يجب أن يساوي 100% للخيارات المحددة");
      return;
    }

    const prizeDistribution: any = {};
    if (payoutPlaces >= 1) prizeDistribution.first = prizePercents.first;
    if (payoutPlaces >= 2) prizeDistribution.second = prizePercents.second;
    if (payoutPlaces >= 3) prizeDistribution.third = prizePercents.third;

    const tournamentData = {
      ...formData,
      status: "registration_open" as const,
      prize_pool: Number(formData.prize_pool) || 0,
      prize_distribution: prizeDistribution,
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
      prize_pool: tournament.prize_pool || 0,
      platform_fee_percentage: tournament.platform_fee_percentage,
      tournament_type: tournament.tournament_type,
      match_type: tournament.match_type,
      num_groups: tournament.num_groups || 4,
      teams_per_group_qualify: tournament.teams_per_group_qualify || 2,
    });
    // If this tournament has its own prize_distribution, use it
    if ((tournament as any).prize_distribution) {
      const pd = (tournament as any).prize_distribution as any;
      const places = pd.third !== undefined ? 3 : pd.second !== undefined ? 2 : 1;
      const f = pd.first !== undefined ? Number(pd.first) : (places >= 1 ? prizePercents.first : 0);
      const s = pd.second !== undefined ? Number(pd.second) : (places >= 2 ? prizePercents.second : 0);
      const t = pd.third !== undefined ? Number(pd.third) : (places >= 3 ? prizePercents.third : 0);
      setPrizePercents({ first: f, second: s, third: t });
      setPayoutPlaces(places);
    }
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
                    <Label>مجموع الجوائز (ج.م)</Label>
                    <Input type="number" value={formData.prize_pool} onChange={(e) => setFormData({ ...formData, prize_pool: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div className="col-span-2">
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-muted/10 rounded-md text-center">
                        <div className="text-xs text-muted-foreground">عدد المراكز الموزعة</div>
                        <div className="mt-2 flex items-center justify-center gap-2">
                          <Button variant={payoutPlaces===1?"primary":"ghost"} size="sm" onClick={() => setPayoutPlaces(1)}>1</Button>
                          <Button variant={payoutPlaces===2?"primary":"ghost"} size="sm" onClick={() => setPayoutPlaces(2)}>2</Button>
                          <Button variant={payoutPlaces===3?"primary":"ghost"} size="sm" onClick={() => setPayoutPlaces(3)}>3</Button>
                        </div>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-md text-center">
                        <div className="text-xs text-muted-foreground">المركز الأول (%)</div>
                        <Input type="number" value={String(prizePercents.first)} onChange={(e) => setPrizePercents({ ...prizePercents, first: parseInt(e.target.value || '0') })} className="mt-2 text-center" />
                        <div className="font-gaming text-gold text-lg mt-2">{computedPrizes.first.toLocaleString()} ج.م</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-md text-center">
                        <div className="text-xs text-muted-foreground">المركز الثاني (%)</div>
                        <Input type="number" value={String(prizePercents.second)} onChange={(e) => setPrizePercents({ ...prizePercents, second: parseInt(e.target.value || '0') })} className="mt-2 text-center" disabled={payoutPlaces < 2} />
                        <div className="font-gaming text-lg mt-2">{computedPrizes.second.toLocaleString()} ج.م</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-md text-center">
                        <div className="text-xs text-muted-foreground">المركز الثالث (%)</div>
                        <Input type="number" value={String(prizePercents.third)} onChange={(e) => setPrizePercents({ ...prizePercents, third: parseInt(e.target.value || '0') })} className="mt-2 text-center" disabled={payoutPlaces < 3} />
                        <div className="font-gaming text-lg mt-2">{computedPrizes.third.toLocaleString()} ج.م</div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm">
                      <span className="text-muted-foreground">المجموع: </span>
                      <span className={( ( (payoutPlaces>=1?prizePercents.first:0) + (payoutPlaces>=2?prizePercents.second:0) + (payoutPlaces>=3?prizePercents.third:0) ) === 100) ? "text-success" : "text-destructive"}>
                        { (payoutPlaces>=1?prizePercents.first:0) + (payoutPlaces>=2?prizePercents.second:0) + (payoutPlaces>=3?prizePercents.third:0) }%
                      </span>
                    </div>
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
