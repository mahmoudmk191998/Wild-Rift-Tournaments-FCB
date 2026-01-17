import { cn } from "@/lib/utils";
import { Shield, Edit, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Team {
  id: string;
  name: string;
  played: number;
  wins: number;
  losses: number;
  points: number;
  qualified?: boolean;
}

interface GroupStageTableProps {
  groupName: string;
  groupLetter: string;
  teams: Team[];
  qualifyCount?: number;
  onEditTeam?: (team: Team) => void;
  editable?: boolean;
}

const GroupStageTable = ({ 
  groupName, 
  groupLetter, 
  teams, 
  qualifyCount = 2,
  onEditTeam,
  editable = false
}: GroupStageTableProps) => {
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
  
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
            {sortedTeams.map((team, index) => {
              const isQualified = index < qualifyCount;
              return (
                <tr 
                  key={team.id}
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
                      <span className="font-medium">{team.name}</span>
                      {isQualified && (
                        <Trophy className="w-4 h-4 text-success" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-muted-foreground">{team.played}</td>
                  <td className="py-3 px-4 text-center text-success">{team.wins}</td>
                  <td className="py-3 px-4 text-center text-destructive">{team.losses}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-gaming text-lg">{team.points}</span>
                  </td>
                  {editable && (
                    <td className="py-3 px-4 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEditTeam?.(team)}
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
    </div>
  );
};

export default GroupStageTable;
