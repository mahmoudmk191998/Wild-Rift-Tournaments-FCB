import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateMatchResult } from "@/hooks/useMatches";
import { Trophy } from "lucide-react";

interface MatchProp {
  id: string;
  team1?: { name: string; score?: number } | null;
  team2?: { name: string; score?: number } | null;
}

const MatchResultModal = ({
  open,
  match,
  onOpenChange,
}: {
  open: boolean;
  match: MatchProp | null;
  onOpenChange: (open: boolean) => void;
}) => {
  const [team1Score, setTeam1Score] = useState<number>(0);
  const [team2Score, setTeam2Score] = useState<number>(0);
  const update = useUpdateMatchResult();

  useEffect(() => {
    if (match) {
      setTeam1Score(match.team1?.score ?? 0);
      setTeam2Score(match.team2?.score ?? 0);
    }
  }, [match]);

  const handleSave = async () => {
    if (!match) return;
    const winnerId = team1Score > team2Score ? "team1" : team2Score > team1Score ? "team2" : null;
    try {
      await update.mutateAsync({ id: match.id, team1Score, team2Score, winnerId });
      onOpenChange(false);
    } catch (e) {
      // error handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Trophy className="w-5 h-5 text-gold" /> تسجيل نتيجة المباراة</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">الفريق 1</div>
              <div className="font-medium">{match?.team1?.name || "TBD"}</div>
            </div>
            <div className="w-24">
              <Input type="number" value={team1Score} onChange={(e) => setTeam1Score(parseInt(e.target.value || "0"))} />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">الفريق 2</div>
              <div className="font-medium">{match?.team2?.name || "TBD"}</div>
            </div>
            <div className="w-24">
              <Input type="number" value={team2Score} onChange={(e) => setTeam2Score(parseInt(e.target.value || "0"))} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
          <Button variant="gaming" onClick={handleSave} disabled={!match || update.isLoading}>
            {update.isLoading ? "جارٍ الحفظ..." : "حفظ النتيجة"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MatchResultModal;
