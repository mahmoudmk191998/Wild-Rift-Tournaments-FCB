import { cn } from "@/lib/utils";
import { Shield, Edit, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useGroupStandings, useUpdateStanding } from "@/hooks/useGroups";
import { Input } from "@/components/ui/input";

interface GroupStageTableProps {
  groupId: string;
  groupName: string;
  groupLetter: string;
  qualifyCount?: number;
  onEditTeam?: (standing: any) => void;
  editable?: boolean;
}

const GroupStageTable = ({ 
  groupId,
  groupName, 
  groupLetter, 
  qualifyCount = 2,
  onEditTeam,
  editable = false
}: GroupStageTableProps) => {
  const { data: standings } = useGroupStandings(groupId);
  const updateStanding = useUpdateStanding();
  const [editing, setEditing] = useState<any | null>(null);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [draws, setDraws] = useState(0);
  const [points, setPoints] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);

  useEffect(() => {
    if (editing) {
      setWins(editing.wins || 0);
      setLosses(editing.losses || 0);
      setDraws(editing.draws || 0);
      setPoints(editing.points || 0);
      setGamesPlayed(editing.games_played || 0);
    }
  }, [editing]);

  const sortedTeams = (standings || []).slice().sort((a: any, b: any) => (b.points || 0) - (a.points || 0));
  
  const handleSave = async () => {
    if (!editing) return;
    try {
      await updateStanding.mutateAsync({ id: editing.id, wins, losses, draws, points, games_played: gamesPlayed });
      setEditing(null);
    } catch (e) {
      // handled by hook
    }
  };

  return (
    <div className="gaming-card overflow-hidden">
      <div className="bg-gradient-to-l from-primary/20 to-transparent p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center">
              <span className="font-gaming text-lg text-primary">{groupLetter}</span>
            </div>
            <h3 className="font-bold text-lg">{groupName}</h3>
          </div>
          {editable && (
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4 ml-2" />
              تعديل
            </Button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30 text-sm text-muted-foreground">
              <th className="text-right py-3 px-4">#</th>
              <th className="text-right py-3 px-4">الفريق</th>
              <th className="text-center py-3 px-4">لعب</th>
              <th className="text-center py-3 px-4">فوز</th>
              <th className="text-center py-3 px-4">خسارة</th>
              <th className="text-center py-3 px-4">النقاط</th>
              {editable && <th className="text-center py-3 px-4">إجراء</th>}
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((s: any, index: number) => {
              const isQualified = index < qualifyCount;
              return (
                <tr 
                  key={s.id}
                  className={cn(
                    "border-b border-border/20 transition-colors",
                    isQualified && "bg-success/5"
                  )}
                >
                  <td className="py-3 px-4">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold",
                      isQualified 
                        ? "bg-success/20 text-success" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">{s.teams?.name || 'Team'}</span>
                      {isQualified && (
                        <Trophy className="w-4 h-4 text-success" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-muted-foreground">{s.games_played || 0}</td>
                  <td className="py-3 px-4 text-center text-success">{s.wins || 0}</td>
                  <td className="py-3 px-4 text-center text-destructive">{s.losses || 0}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-gaming text-lg">{s.points || 0}</span>
                  </td>
                  {editable && (
                    <td className="py-3 px-4 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditing(s)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="p-3 bg-muted/30 text-xs text-muted-foreground flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-success/50" />
        <span>أول {qualifyCount} فرق تتأهل للمرحلة التالية</span>
      </div>

      {/* Edit Standing Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
          <div className="bg-background p-6 rounded-xl z-10 w-full max-w-md">
            <h3 className="font-bold mb-4">تعديل ترتيب الفريق</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">الفريق</div>
                <div className="font-medium">{editing.teams?.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-muted-foreground">الألعاب</div>
                  <Input type="number" value={gamesPlayed} onChange={(e) => setGamesPlayed(parseInt(e.target.value || '0'))} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">النقاط</div>
                  <Input type="number" value={points} onChange={(e) => setPoints(parseInt(e.target.value || '0'))} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">فوز</div>
                  <Input type="number" value={wins} onChange={(e) => setWins(parseInt(e.target.value || '0'))} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">خسارة</div>
                  <Input type="number" value={losses} onChange={(e) => setLosses(parseInt(e.target.value || '0'))} />
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-muted-foreground">تعادلات</div>
                  <Input type="number" value={draws} onChange={(e) => setDraws(parseInt(e.target.value || '0'))} />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>إلغاء</Button>
              <Button variant="gaming" onClick={handleSave} disabled={updateStanding.isLoading}>{updateStanding.isLoading ? 'جارٍ الحفظ...' : 'حفظ'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupStageTable;
