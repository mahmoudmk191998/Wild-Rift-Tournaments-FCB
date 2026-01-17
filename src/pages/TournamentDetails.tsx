import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Trophy, Users, Calendar, Coins, Clock,
  Swords, Shield, Medal, ArrowRight, CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTournament } from "@/hooks/useTournaments";
import { useTeams } from "@/hooks/useTeams";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig = {
  upcoming: { label: "قريباً", className: "badge-pending" },
  registration_open: { label: "التسجيل مفتوح", className: "badge-open" },
  registration_closed: { label: "التسجيل مغلق", className: "badge-full" },
  in_progress: { label: "🔴 جارية الآن", className: "badge-live" },
  completed: { label: "انتهت", className: "badge-finished" },
  cancelled: { label: "ملغاة", className: "badge-rejected" },
};

const TournamentDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: tournament, isLoading: tournamentLoading } = useTournament(id);
  const { data: teams, isLoading: teamsLoading } = useTeams(id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (tournamentLoading) {
    return (
      <Layout>
        <div className="min-h-screen py-12">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-48 w-full rounded-2xl" />
              </div>
              <div>
                <Skeleton className="h-96 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!tournament) {
    return (
      <Layout>
        <div className="min-h-screen py-12 flex items-center justify-center">
          <div className="text-center">
            <Trophy className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-bold mb-2">البطولة غير موجودة</h2>
            <Button asChild>
              <Link to="/tournaments">العودة للبطولات</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const status = statusConfig[tournament.status as keyof typeof statusConfig] || statusConfig.upcoming;
  const prizeDistribution = tournament.prize_distribution as { first?: number; second?: number; third?: number } || { first: 50, second: 30, third: 20 };
  const totalPrize = tournament.prize_pool || 0;

  const prizes = [
    { place: "المركز الأول", amount: Math.round(totalPrize * (prizeDistribution.first || 50) / 100), icon: Trophy },
    { place: "المركز الثاني", amount: Math.round(totalPrize * (prizeDistribution.second || 30) / 100), icon: Medal },
    { place: "المركز الثالث", amount: Math.round(totalPrize * (prizeDistribution.third || 20) / 100), icon: Medal },
  ];

  const rules = [
    "يجب على كل لاعب أن يكون رتبته Emerald أو أعلى",
    "يجب دفع رسوم الاشتراك قبل بداية البطولة",
    "التأخر عن موعد المباراة أكثر من 15 دقيقة يعني الخسارة",
    "يمنع استخدام أي برامج غش أو استغلال للثغرات",
    "قرار الحكم نهائي وغير قابل للطعن",
  ];

  const matchTypeLabels = {
    bo1: "Best of 1",
    bo3: "Best of 3",
    bo5: "Best of 5",
  };

  const tournamentTypeLabels = {
    group_knockout: "مجموعات + خروج المغلوب",
    single_elimination: "خروج المغلوب",
  };

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/tournaments" className="hover:text-primary transition-colors">
              البطولات
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-foreground">{tournament.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header Card */}
              <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-primary/30 to-secondary/30 p-6">
                  <div className={cn("inline-flex px-4 py-2 rounded-full text-sm font-medium", status.className)}>
                    {status.label}
                  </div>
                  <Trophy className="absolute bottom-6 left-6 w-24 h-24 text-primary/20" />
                </div>
                <div className="p-6">
                  <h1 className="font-gaming text-3xl font-bold text-foreground mb-4">
                    {tournament.name}
                  </h1>
                  <p className="text-muted-foreground leading-relaxed">
                    {tournament.description || "بطولة تنافسية مثيرة في وايلد ريفت!"}
                  </p>
                </div>
              </div>

              {/* Prize Pool */}
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <h2 className="font-bold text-xl mb-6 flex items-center gap-3">
                  <Coins className="w-6 h-6 text-gold" />
                  الجوائز
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {prizes.map((prize, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-xl text-center transition-all",
                        index === 0
                          ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30"
                          : "bg-muted/50 border border-border/50"
                      )}
                    >
                      <prize.icon className={cn(
                        "w-8 h-8 mx-auto mb-2",
                        index === 0 ? "text-gold" : "text-muted-foreground"
                      )} />
                      <div className="text-sm text-muted-foreground mb-1">{prize.place}</div>
                      <div className={cn(
                        "font-gaming text-xl font-bold",
                        index === 0 ? "text-gold text-glow-gold" : "text-foreground"
                      )}>
                        {prize.amount} جنيه
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules */}
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <h2 className="font-bold text-xl mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary" />
                  القوانين
                </h2>
                <ul className="space-y-3">
                  {rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Registered Teams */}
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <h2 className="font-bold text-xl mb-6 flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary" />
                  الفرق المسجلة ({teams?.length || 0}/{tournament.max_teams})
                </h2>
                {teamsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : teams && teams.length > 0 ? (
                  <div className="space-y-3">
                    {teams.map((team) => (
                      <div
                        key={team.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium">{team.name}</span>
                        </div>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          team.status === 'registered' ? 'badge-approved' :
                            team.status === 'pending_payment' ? 'badge-pending' : 'badge-full'
                        )}>
                          {team.status === 'registered' ? 'مسجل' :
                            team.status === 'pending_payment' ? 'في انتظار الدفع' : 'غير مكتمل'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    لا توجد فرق مسجلة بعد
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="rounded-2xl bg-card border border-border/50 p-6 sticky top-24">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">التاريخ</div>
                      <div className="font-medium">{formatDate(tournament.start_date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">الوقت</div>
                      <div className="font-medium">{formatTime(tournament.start_date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Swords className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">نوع المباريات</div>
                      <div className="font-medium">
                        {matchTypeLabels[tournament.match_type]} - {tournamentTypeLabels[tournament.tournament_type]}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">حجم الفريق</div>
                      <div className="font-medium">{tournament.team_size} لاعبين</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 mb-6">
                  <div className="text-sm text-muted-foreground mb-1">رسوم الاشتراك</div>
                  <div className="font-gaming text-2xl text-primary">
                    {tournament.entry_fee} جنيه
                    <span className="text-sm font-normal text-muted-foreground mr-1">/لاعب</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 mb-6">
                  <div className="text-sm text-muted-foreground mb-1">مجموع الجوائز</div>
                  <div className="font-gaming text-2xl text-gold text-glow-gold">
                    {tournament.prize_pool || 0} جنيه
                  </div>
                </div>

                {tournament.status === 'registration_open' && (
                  <>
                    {user ? (
                      <Button variant="gaming" size="lg" className="w-full" asChild>
                        <Link to={`/teams/create?tournament=${tournament.id}`}>
                          سجّل فريقك الآن
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="gaming" size="lg" className="w-full" asChild>
                        <Link to="/login">
                          سجّل دخول للتسجيل
                        </Link>
                      </Button>
                    )}
                    <p className="text-xs text-muted-foreground text-center mt-4">
                      يجب أن يكون لديك فريق مكتمل للتسجيل
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TournamentDetails;
