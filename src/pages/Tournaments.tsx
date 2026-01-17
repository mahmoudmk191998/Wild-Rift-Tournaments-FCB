import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trophy, Users, Calendar, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTournaments } from "@/hooks/useTournaments";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig = {
  upcoming: { label: "قريباً", className: "badge-pending" },
  registration_open: { label: "التسجيل مفتوح", className: "badge-open" },
  registration_closed: { label: "التسجيل مغلق", className: "badge-full" },
  in_progress: { label: "🔴 جارية الآن", className: "badge-live" },
  completed: { label: "انتهت", className: "badge-finished" },
  cancelled: { label: "ملغاة", className: "badge-rejected" },
};

const Tournaments = () => {
  const [filter, setFilter] = useState("all");
  const { data: tournaments, isLoading, error } = useTournaments(filter === "all" ? undefined : filter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="font-gaming text-4xl md:text-5xl font-bold mb-4">
              <span className="text-primary text-glow-red">البطولات</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              اكتشف البطولات المتاحة وانضم للمنافسة
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {[
              { key: "all", label: "الكل" },
              { key: "registration_open", label: "مفتوحة" },
              { key: "in_progress", label: "جارية" },
              { key: "completed", label: "منتهية" },
            ].map((item) => (
              <Button
                key={item.key}
                variant={filter === item.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(item.key)}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-card border border-border/50 overflow-hidden">
                  <Skeleton className="h-32 w-full" />
                  <div className="p-5 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <p className="text-destructive">حدث خطأ أثناء تحميل البطولات</p>
            </div>
          )}

          {/* Tournaments Grid */}
          {!isLoading && !error && tournaments && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((tournament) => {
                const status = statusConfig[tournament.status as keyof typeof statusConfig] || statusConfig.upcoming;

                return (
                  <div
                    key={tournament.id}
                    className="group rounded-2xl bg-card border border-border/50 overflow-hidden card-glow"
                  >
                    {/* Card Header */}
                    <div className="relative h-32 bg-gradient-to-br from-primary/20 to-secondary/20 p-4">
                      <div className={cn("inline-flex px-3 py-1 rounded-full text-xs font-medium", status.className)}>
                        {status.label}
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <Trophy className="w-12 h-12 text-primary/30" />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-4 text-foreground group-hover:text-primary transition-colors">
                        {tournament.name}
                      </h3>

                      <div className="space-y-3 mb-5">
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{formatDate(tournament.start_date)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {tournament.max_teams} فريق كحد أقصى
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Coins className="w-4 h-4 text-gold" />
                          <span className="text-gold font-semibold">
                            {tournament.prize_pool || 0} جنيه
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          رسوم الاشتراك: {tournament.entry_fee} جنيه/لاعب
                        </div>
                      </div>

                      <Button
                        variant={tournament.status === 'registration_open' ? 'gaming' : 'outline'}
                        className="w-full"
                        asChild
                      >
                        <Link to={`/tournaments/${tournament.id}`}>
                          {tournament.status === 'registration_open' ? 'سجّل الآن' :
                            tournament.status === 'in_progress' ? 'شاهد البطولة' : 'التفاصيل'}
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isLoading && !error && tournaments?.length === 0 && (
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">لا توجد بطولات في هذا التصنيف</p>
              <Button variant="gaming" className="mt-4" asChild>
                <Link to="/contact">تواصل معنا لإنشاء بطولة</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Tournaments;
