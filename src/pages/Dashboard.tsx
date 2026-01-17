import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Trophy, Users, Wallet, Calendar,
  Settings, LogOut, Bell, ChevronLeft,
  Gamepad2, Medal, Clock, Upload, Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyTeams } from "@/hooks/useTeams";
import { useMyPayments } from "@/hooks/usePayments";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

const Dashboard = () => {
  const { user, profile, isLoading: authLoading, signOut, isAdmin } = useAuth();
  const { data: myTeams, isLoading: teamsLoading } = useMyTeams();
  const { data: myPayments, isLoading: paymentsLoading } = useMyPayments();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <Skeleton className="h-96 w-full rounded-2xl" />
              </div>
              <div className="lg:col-span-3 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-24 rounded-2xl" />
                  <Skeleton className="h-24 rounded-2xl" />
                  <Skeleton className="h-24 rounded-2xl" />
                </div>
                <Skeleton className="h-48 rounded-2xl" />
                <Skeleton className="h-48 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const stats = {
    tournaments: myTeams?.length || 0,
    wins: 0,
    earnings: 0,
  };

  const pendingPayments = myPayments?.filter(p => p.status === 'pending').length || 0;
  const approvedPayments = myPayments?.filter(p => p.status === 'approved').length || 0;

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl bg-card border border-border/50 p-6 sticky top-24">
                {/* Profile */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-gaming flex items-center justify-center mb-4">
                    <span className="font-gaming text-2xl text-primary-foreground">
                      {profile.username[0].toUpperCase()}
                    </span>
                  </div>
                  <h2 className="font-bold text-lg">{profile.username}</h2>
                  <p className="text-sm text-muted-foreground">{profile.riot_id || "لم يتم تحديد Riot ID"}</p>
                  {profile.rank && (
                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                      <Medal className="w-4 h-4" />
                      {profile.rank}
                    </div>
                  )}
                  {isAdmin && (
                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-sm">
                      <Trophy className="w-4 h-4" />
                      مدير
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/20 text-primary"
                  >
                    <Gamepad2 className="w-5 h-5" />
                    لوحة التحكم
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    الملف الشخصي
                  </Link>
                  <Link
                    to="/tournaments"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Trophy className="w-5 h-5" />
                    البطولات
                  </Link>
                  <Link
                    to="/teams"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Users className="w-5 h-5" />
                    الفرق
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gold hover:bg-gold/20 transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                      لوحة الإدارة
                    </Link>
                  )}
                </nav>

                <div className="border-t border-border/50 mt-6 pt-6">
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleSignOut}>
                    <LogOut className="w-5 h-5 ml-2" />
                    تسجيل الخروج
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-card border border-border/50 p-6 card-glow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الفرق</p>
                      <p className="font-gaming text-2xl">{stats.tournaments}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-card border border-border/50 p-6 card-glow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">مدفوعات معلقة</p>
                      <p className="font-gaming text-2xl">{pendingPayments}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-card border border-border/50 p-6 card-glow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">مدفوعات مؤكدة</p>
                      <p className="font-gaming text-2xl text-success">{approvedPayments}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* My Teams */}
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    فرقي
                  </h3>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/teams/create">
                      إنشاء فريق
                      <ChevronLeft className="w-4 h-4 mr-1" />
                    </Link>
                  </Button>
                </div>

                {teamsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : myTeams && myTeams.length > 0 ? (
                  <div className="space-y-3">
                    {myTeams.map((team) => (
                      <div key={team.id} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-gaming flex items-center justify-center">
                            <Users className="w-7 h-7 text-primary-foreground" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold">{team.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              الحالة: {team.status === 'registered' ? 'مسجل' :
                                team.status === 'pending_payment' ? 'في انتظار الدفع' : 'غير مكتمل'}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/teams/${team.id}`}>عرض</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground mb-4">لم تنضم لأي فريق بعد</p>
                    <Button variant="gaming" asChild>
                      <Link to="/teams/create">أنشئ فريقك الأول</Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* My Payments */}
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" />
                    مدفوعاتي
                  </h3>
                </div>

                {paymentsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : myPayments && myPayments.length > 0 ? (
                  <div className="space-y-3">
                    {myPayments.slice(0, 5).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div>
                          <p className="font-medium">{payment.amount} جنيه</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.created_at).toLocaleDateString("ar-EG")}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${payment.status === 'approved' ? 'badge-approved' :
                            payment.status === 'rejected' ? 'badge-rejected' : 'badge-pending'
                          }`}>
                          {payment.status === 'approved' ? 'مقبول' :
                            payment.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Wallet className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">لا توجد مدفوعات</p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-primary" />
                  إجراءات سريعة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                    <Link to="/tournaments">
                      <Trophy className="w-6 h-6" />
                      تصفح البطولات
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                    <Link to="/teams/create">
                      <Users className="w-6 h-6" />
                      إنشاء فريق
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                    <Link to="/rules">
                      <Calendar className="w-6 h-6" />
                      قوانين البطولة
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
