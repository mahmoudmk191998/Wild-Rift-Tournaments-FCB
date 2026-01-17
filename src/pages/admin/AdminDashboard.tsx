import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import { Button } from "@/components/ui/button";
import {
  Trophy, Users, Wallet, Shield,
  TrendingUp, Calendar, Plus, Eye,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTournaments } from "@/hooks/useTournaments";
import { useTeams } from "@/hooks/useTeams";
import { usePayments } from "@/hooks/usePayments";
import { useProfiles } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";

const AdminDashboard = () => {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { data: tournaments, isLoading: tournamentsLoading } = useTournaments();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: payments, isLoading: paymentsLoading } = usePayments();
  const { data: profiles, isLoading: profilesLoading } = useProfiles();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, authLoading, navigate]);

  if (authLoading || !isAdmin) {
    return (
      <AdminLayout>
        <div className="p-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  const pendingPayments = payments?.filter(p => p.status === 'pending') || [];
  const activeTournaments = tournaments?.filter(t => ['registration_open', 'in_progress'].includes(t.status)) || [];

  const stats = [
    { label: "إجمالي اللاعبين", value: profiles?.length?.toString() || "0", icon: Users, color: "primary" as const },
    { label: "البطولات النشطة", value: activeTournaments.length.toString(), icon: Trophy, color: "gold" as const },
    { label: "الفرق المسجلة", value: teams?.length?.toString() || "0", icon: Shield, color: "success" as const },
    { label: "المدفوعات المعلقة", value: pendingPayments.length.toString(), icon: Wallet, color: "warning" as const },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-gaming text-3xl font-bold">
              <span className="text-primary text-glow-red">لوحة التحكم</span>
            </h1>
            <p className="text-muted-foreground">مرحباً بك في لوحة إدارة WR Arena</p>
          </div>
          <div className="flex gap-3">
            {pendingPayments.length > 0 && (
              <Button variant="outline" asChild>
                <Link to="/admin/payments">
                  <AlertCircle className="w-4 h-4 ml-2 text-warning" />
                  {pendingPayments.length} دفعة معلقة
                </Link>
              </Button>
            )}
            <Button variant="gaming" asChild>
              <Link to="/admin/tournaments">
                <Plus className="w-4 h-4 ml-2" />
                بطولة جديدة
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Tournaments */}
          <div className="lg:col-span-2">
            <div className="gaming-card">
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  البطولات الأخيرة
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/tournaments">عرض الكل</Link>
                </Button>
              </div>
              <div className="p-6">
                {tournamentsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : tournaments && tournaments.length > 0 ? (
                  <div className="space-y-4">
                    {tournaments.slice(0, 5).map((t) => (
                      <div key={t.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/30">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{t.name}</h4>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {t.max_teams} فريق
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(t.start_date).toLocaleDateString("ar-EG")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs",
                            t.status === "registration_open" && "badge-open",
                            t.status === "registration_closed" && "badge-full",
                            t.status === "in_progress" && "badge-live",
                            t.status === "completed" && "badge-finished"
                          )}>
                            {t.status === "registration_open" ? "مفتوحة" :
                              t.status === "in_progress" ? "جارية" :
                                t.status === "completed" ? "انتهت" : "مغلقة"}
                          </span>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/admin/tournaments`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    لا توجد بطولات بعد
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Payments */}
            <div className="gaming-card">
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="font-bold flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-warning" />
                  مدفوعات معلقة
                </h3>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/payments">عرض الكل</Link>
                </Button>
              </div>
              <div className="p-4">
                {paymentsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : pendingPayments.length > 0 ? (
                  <div className="space-y-3">
                    {pendingPayments.slice(0, 5).map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{p.amount} جنيه</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(p.created_at).toLocaleDateString("ar-EG")}
                          </p>
                        </div>
                        <span className="badge-pending px-2 py-1 rounded-full text-xs">معلقة</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    لا توجد مدفوعات معلقة
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="gaming-card">
              <div className="p-4 border-b border-border/50">
                <h3 className="font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  إحصائيات سريعة
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">إجمالي البطولات</span>
                  <span className="font-gaming text-primary">{tournaments?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">إجمالي الفرق</span>
                  <span className="font-gaming text-success">{teams?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">المدفوعات المقبولة</span>
                  <span className="font-gaming text-gold">
                    {payments?.filter(p => p.status === 'approved').length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
