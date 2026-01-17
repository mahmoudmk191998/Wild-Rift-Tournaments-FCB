import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Plus, Crown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTeams } from "@/hooks/useTeams";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const Teams = () => {
  const { user } = useAuth();
  const { data: teams, isLoading } = useTeams();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = teams?.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
            <div>
              <h1 className="font-gaming text-4xl md:text-5xl font-bold mb-2">
                <span className="text-primary text-glow-red">الفرق</span>
              </h1>
              <p className="text-muted-foreground">
                تصفح الفرق المسجلة أو أنشئ فريقك الخاص
              </p>
            </div>
            <div className="flex gap-3">
              {user ? (
                <>
                  <Button variant="outline" asChild>
                    <Link to="/dashboard">
                      <Users className="w-4 h-4 ml-2" />
                      فريقي
                    </Link>
                  </Button>
                  <Button variant="gaming" asChild>
                    <Link to="/teams/create">
                      <Plus className="w-4 h-4 ml-2" />
                      أنشئ فريق
                    </Link>
                  </Button>
                </>
              ) : (
                <Button variant="gaming" asChild>
                  <Link to="/login">
                    سجّل دخول للمشاركة
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="max-w-md mb-8">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="ابحث عن فريق..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl bg-card border border-border/50 p-6">
                  <Skeleton className="h-14 w-14 rounded-xl mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <Skeleton className="h-16 rounded-lg" />
                    <Skeleton className="h-16 rounded-lg" />
                    <Skeleton className="h-16 rounded-lg" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Teams Grid */}
          {!isLoading && filteredTeams && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team) => (
                <div
                  key={team.id}
                  className="rounded-2xl bg-card border border-border/50 p-6 card-glow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-gaming flex items-center justify-center">
                      <Users className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Crown className="w-4 h-4 text-gold" />
                      القائد
                    </div>
                  </div>

                  <h3 className="font-bold text-xl mb-4 text-foreground">
                    {team.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <div className="font-gaming text-xl text-primary">
                        {team.status === 'registered' ? '✓' : '⏳'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {team.status === 'registered' ? 'مسجل' : 'قيد التسجيل'}
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <div className="font-gaming text-xl text-gold">
                        {team.group_name || '-'}
                      </div>
                      <div className="text-xs text-muted-foreground">المجموعة</div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/teams/${team.id}`}>
                      عرض الفريق
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredTeams?.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد فرق مسجلة بعد'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Teams;
