import { cn } from "@/lib/utils";
import { Shield, Trophy, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Match {
  id: string;
  team1: { name: string; score?: number } | null;
  team2: { name: string; score?: number } | null;
  winner?: string;
  round: number;
  position: number;
}

interface TournamentBracketProps {
  matches: Match[];
  rounds: number;
  onEditMatch?: (match: Match) => void;
  editable?: boolean;
}

const MatchCard = ({ 
  match, 
  onEdit, 
  editable 
}: { 
  match: Match; 
  onEdit?: () => void; 
  editable?: boolean;
}) => {
  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden w-56">
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border/30">
        <span className="text-xs text-muted-foreground">مباراة {match.id}</span>
        {editable && (
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onEdit}>
            <Edit className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      {/* Team 1 */}
      <div className={cn(
        "flex items-center justify-between px-3 py-2 border-b border-border/20",
        match.winner === match.team1?.name && "bg-success/10"
      )}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
            <Shield className="w-3 h-3 text-primary" />
          </div>
          <span className={cn(
            "text-sm",
            match.team1 ? "font-medium" : "text-muted-foreground"
          )}>
            {match.team1?.name || "TBD"}
          </span>
        </div>
        <span className={cn(
          "font-gaming text-lg",
          match.winner === match.team1?.name ? "text-success" : "text-muted-foreground"
        )}>
          {match.team1?.score ?? "-"}
        </span>
      </div>
      
      {/* Team 2 */}
      <div className={cn(
        "flex items-center justify-between px-3 py-2",
        match.winner === match.team2?.name && "bg-success/10"
      )}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
            <Shield className="w-3 h-3 text-primary" />
          </div>
          <span className={cn(
            "text-sm",
            match.team2 ? "font-medium" : "text-muted-foreground"
          )}>
            {match.team2?.name || "TBD"}
          </span>
        </div>
        <span className={cn(
          "font-gaming text-lg",
          match.winner === match.team2?.name ? "text-success" : "text-muted-foreground"
        )}>
          {match.team2?.score ?? "-"}
        </span>
      </div>
    </div>
  );
};

const TournamentBracket = ({ matches, rounds, onEditMatch, editable }: TournamentBracketProps) => {
  const roundNames = ["دور الـ 16", "ربع النهائي", "نصف النهائي", "النهائي"];
  
  const getMatchesByRound = (round: number) => 
    matches.filter(m => m.round === round).sort((a, b) => a.position - b.position);

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-8 min-w-max">
        {Array.from({ length: rounds }, (_, i) => i + 1).map((round) => {
          const roundMatches = getMatchesByRound(round);
          const roundName = roundNames[rounds - round] || `الجولة ${round}`;
          
          return (
            <div key={round} className="flex flex-col">
              {/* Round Header */}
              <div className="text-center mb-4">
                <span className={cn(
                  "inline-block px-4 py-1.5 rounded-full text-sm font-medium",
                  round === rounds 
                    ? "bg-gold/20 text-gold border border-gold/30" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {round === rounds ? (
                    <span className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      {roundName}
                    </span>
                  ) : roundName}
                </span>
              </div>
              
              {/* Matches */}
              <div 
                className="flex flex-col justify-around flex-1 gap-4"
                style={{ 
                  minHeight: `${Math.pow(2, rounds - 1) * 80}px` 
                }}
              >
                {roundMatches.map((match) => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    onEdit={() => onEditMatch?.(match)}
                    editable={editable}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TournamentBracket;
