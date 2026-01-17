import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, Flame, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTournaments } from "@/hooks/useTournaments";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig = {
  upcoming: { label: "قريباً", className: "badge-pending" },
  registration_open: { label: "مفتوحة", className: "badge-open" },
  registration_closed: { label: "مغلقة", className: "badge-full" },
  in_progress: { label: "🔴 جارية", className: "badge-live" },
  completed: { label: "انتهت", className: "badge-finished" },
  cancelled: { label: "ملغاة", className: "badge-rejected" },
};

const TournamentsPreview = () => {
  const { data: tournaments, isLoading } = useTournaments();

  // Get only the first 3 tournaments
  const displayTournaments = tournaments?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-card/30" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">البطولات النشطة</span>
              </div>
              <h2 className="font-gaming text-3xl md:text-4xl font-bold">
                <span className="text-foreground">انضم إلى</span>
                <span className="text-primary text-glow-red mr-2">المنافسة</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="gaming-card overflow-hidden">
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
        </div>
      </section>
    );
  }

  // If no tournaments, show empty state
  if (!displayTournaments.length) {
    return (
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-card/30" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">البطولات</span>
              </div>
              <h2 className="font-gaming text-3xl md:text-4xl font-bold">
                <span className="text-foreground">انضم إلى</span>
                <span className="text-primary text-glow-red mr-2">المنافسة</span>
              </h2>
            </div>
          </div>

          <div className="text-center py-16 rounded-2xl bg-card/50 border border-border/50">
            <Trophy className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold mb-2">لا توجد بطولات حالياً</h3>
            <p className="text-muted-foreground mb-6">ترقبوا بطولات جديدة قريباً!</p>
            <Button variant="gaming" asChild>
              <Link to="/contact">تواصل معنا لإقامة بطولة</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-card/30" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">البطولات النشطة</span>
            </div>
            <h2 className="font-gaming text-3xl md:text-4xl font-bold">
              <span className="text-foreground">انضم إلى</span>
              <span className="text-primary text-glow-red mr-2">المنافسة</span>
            </h2>
          </div>
          <Button variant="neon" asChild>
            <Link to="/tournaments">عرض الكل<ChevronLeft className="w-4 h-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTournaments.map((tournament) => {
            const status = statusConfig[tournament.status as keyof typeof statusConfig] || statusConfig.upcoming;
            
            return (
              <div key={tournament.id} className="gaming-card overflow-hidden card-glow group">
                <div className="relative h-32 bg-gradient-to-br from-primary/30 to-secondary/20 p-4">
                  <div className={cn("inline-flex px-3 py-1 rounded-full text-xs font-medium", status.className)}>
                    {status.label}
                  </div>
                  <Trophy className="absolute bottom-4 left-4 w-16 h-16 text-primary/20" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors">
                    {tournament.name}
                  </h3>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {tournament.status === "in_progress" ? "جارية الآن" : formatDate(tournament.start_date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Flame className="w-4 h-4 text-primary" />
                      <span className="text-primary font-semibold">{tournament.prize_pool || 0} جنيه</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {tournament.max_teams} فريق كحد أقصى
                    </div>
                  </div>
                  <Button variant="gaming" className="w-full" asChild>
                    <Link to={`/tournaments/${tournament.id}`}>
                      {tournament.status === "registration_open" ? "سجّل الآن" : "عرض التفاصيل"}
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TournamentsPreview;
