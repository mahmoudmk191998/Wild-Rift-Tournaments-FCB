import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import GroupStageTable from "@/components/admin/GroupStageTable";
import TournamentBracket from "@/components/admin/TournamentBracket";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Layers, RefreshCw, Settings,
  Shuffle, Trophy
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTournaments } from "@/hooks/useTournaments";
import { useGroups, useGroupStandings, useCreateGroups, useAssignTeamToGroup } from "@/hooks/useGroups";
import { useMatches } from "@/hooks/useMatches";
import { useTeams } from "@/hooks/useTeams";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import MatchResultModal from "@/components/admin/MatchResultModal";

const AdminGroups = () => {
  const [selectedTournament, setSelectedTournament] = useState<string>("");
  
  const { data: tournaments, isLoading: tournamentsLoading } = useTournaments();
  const { data: groups, isLoading: groupsLoading } = useGroups(selectedTournament || undefined);
  const { data: matches, isLoading: matchesLoading } = useMatches(selectedTournament || undefined);
  const createGroups = useCreateGroups();
  const { data: teams, isLoading: teamsLoading } = useTeams(selectedTournament || undefined);
  const assignTeam = useAssignTeamToGroup();
  const navigate = useNavigate();

  // Set first tournament as default when loaded
  if (tournaments?.length && !selectedTournament) {
    setSelectedTournament(tournaments[0].id);
  }

  const knockoutMatches = matches?.filter(m => m.stage !== 'group') || [];
  const [editingMatch, setEditingMatch] = useState<any | null>(null);

  const isLoading = tournamentsLoading || groupsLoading || matchesLoading;

  if (isLoading && !tournaments?.length) {
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
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
              <span className="text-primary text-glow-red">إدارة المجموعات</span>
            </h1>
            <p className="text-muted-foreground">إدارة مراحل المجموعات وجدول النقاط</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedTournament} onValueChange={setSelectedTournament}>
              <SelectTrigger className="w-64">
                <Trophy className="w-4 h-4 ml-2" />
                <SelectValue placeholder="اختر بطولة" />
              </SelectTrigger>
              <SelectContent>
                {tournaments?.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
              <Button
                variant="outline"
                onClick={async () => {
                  if (!selectedTournament || !groups?.length || !teams) return;
                  // Assign unassigned teams to groups in round-robin
                  const unassigned = teams.filter(t => !t.group_name);
                  if (!unassigned.length) return;
                  let gi = 0;
                  for (const team of unassigned) {
                    const group = groups[gi % groups.length];
                    try {
                      await assignTeam.mutateAsync({ teamId: team.id, groupId: group.id, groupName: group.name });
                    } catch (e) {
                      // continue assigning others
                    }
                    gi++;
                  }
                }}
                disabled={!teams || assignTeam.isLoading}
              >
                <Shuffle className="w-4 h-4 ml-2" />
                {assignTeam.isLoading ? "جارٍ التوزيع..." : "توزيع عشوائي"}
              </Button>
            <Button variant="gaming">
              <Settings className="w-4 h-4 ml-2" />
              إعدادات
            </Button>
          </div>
        </div>

        <Tabs defaultValue="groups" className="space-y-6">
          <TabsList className="bg-card border border-border/50">
            <TabsTrigger value="groups" className="data-[state=active]:bg-primary/20">
              <Layers className="w-4 h-4 ml-2" />
              مرحلة المجموعات
            </TabsTrigger>
            <TabsTrigger value="knockout" className="data-[state=active]:bg-primary/20">
              <Trophy className="w-4 h-4 ml-2" />
              مرحلة الإقصاء
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="space-y-6">
            {/* Group Stage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="gaming-card p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">عدد المجموعات</p>
                <p className="font-gaming text-2xl text-primary">{groups?.length || 0}</p>
              </div>
              <div className="gaming-card p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">فرق لكل مجموعة</p>
                <p className="font-gaming text-2xl">4</p>
              </div>
              <div className="gaming-card p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">يتأهل من كل مجموعة</p>
                <p className="font-gaming text-2xl text-success">2</p>
              </div>
              <div className="gaming-card p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">المباريات المتبقية</p>
                <p className="font-gaming text-2xl text-warning">
                  {matches?.filter(m => m.stage === 'group' && !m.is_completed).length || 0}
                </p>
              </div>
            </div>

            {/* Groups Grid */}
            {groups && groups.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {groups.map((group) => (
                  <GroupStageTable 
                    key={group.id}
                    groupId={group.id}
                    groupName={group.name}
                    groupLetter={group.name.replace("المجموعة ", "")}
                    qualifyCount={2}
                    editable={true}
                    onEditTeam={(standing) => navigate(`/teams/${standing.team_id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="gaming-card p-12 text-center">
                <Layers className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-4">لا توجد مجموعات لهذه البطولة</p>
                <Button
                  variant="gaming"
                  onClick={async () => {
                    if (!selectedTournament) return;
                    const t = tournaments?.find((x) => x.id === selectedTournament);
                    const numGroups = t?.num_groups || 4;
                    await createGroups.mutateAsync({ tournamentId: selectedTournament, numGroups });
                  }}
                  disabled={!selectedTournament || createGroups.isLoading}
                >
                  <Shuffle className="w-4 h-4 ml-2" />
                  {createGroups.isLoading ? "جارٍ الإنشاء..." : "إنشاء المجموعات"}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="knockout" className="space-y-6">
            {/* Knockout Stage */}
            <div className="gaming-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-xl flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-gold" />
                  شجرة البطولة
                </h2>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 ml-2" />
                  إعادة توليد
                </Button>
              </div>
              
              {knockoutMatches.length > 0 ? (
                <>
                  <TournamentBracket 
                    matches={knockoutMatches.map(m => ({
                      id: m.id,
                      team1: m.team1 ? { name: m.team1.name, score: m.team1_score || 0 } : null,
                      team2: m.team2 ? { name: m.team2.name, score: m.team2_score || 0 } : null,
                      winner: m.winner_id ? "فريق" : undefined,
                      round: m.bracket_round || 1,
                      position: m.bracket_position || 1,
                    }))}
                    rounds={3}
                    editable={true}
                    onEditMatch={(mm) => setEditingMatch(mm)}
                  />
                  <MatchResultModal open={!!editingMatch} match={editingMatch} onOpenChange={(o) => { if (!o) setEditingMatch(null); }} />
                </>
              ) : (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">لم تبدأ مرحلة الإقصاء بعد</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminGroups;
