import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, ArrowRight, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateTeam } from "@/hooks/useTeams";
import { useTournaments } from "@/hooks/useTournaments";

const CreateTeam = () => {
  const [searchParams] = useSearchParams();
  const preSelectedTournament = searchParams.get('tournament');
  
  const [copied, setCopied] = useState(false);
  const [createdTeamId, setCreatedTeamId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    tournamentId: preSelectedTournament || "",
    description: "",
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const createTeam = useCreateTeam();
  const { data: tournaments, isLoading: tournamentsLoading } = useTournaments("registration_open");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      navigate("/login");
      return;
    }

    if (!formData.tournamentId) {
      toast.error("يجب اختيار البطولة");
      return;
    }

    try {
      const team = await createTeam.mutateAsync({
        name: formData.name,
        tournamentId: formData.tournamentId,
        description: formData.description,
      });
      setCreatedTeamId(team.id);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const copyInviteCode = () => {
    if (createdTeamId) {
      navigator.clipboard.writeText(createdTeamId);
      setCopied(true);
      toast.success("تم نسخ كود الفريق");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen py-12 flex items-center justify-center">
          <div className="text-center">
            <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-bold mb-4">يجب تسجيل الدخول</h2>
            <Button variant="gaming" asChild>
              <Link to="/login">تسجيل الدخول</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/teams" className="hover:text-primary transition-colors">
              الفرق
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-foreground">إنشاء فريق</span>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-gaming flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="font-gaming text-3xl font-bold mb-2">
                <span className="text-primary text-glow-red">إنشاء فريق جديد</span>
              </h1>
              <p className="text-muted-foreground">
                أنشئ فريقك وادعُ أصدقاءك للانضمام
              </p>
            </div>

            <div className="rounded-2xl bg-card border border-border/50 p-6 md:p-8">
              {!createdTeamId ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="tournament">البطولة</Label>
                    <Select
                      value={formData.tournamentId}
                      onValueChange={(value) => setFormData({ ...formData, tournamentId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={tournamentsLoading ? "جاري التحميل..." : "اختر البطولة"} />
                      </SelectTrigger>
                      <SelectContent>
                        {tournaments?.map((tournament) => (
                          <SelectItem key={tournament.id} value={tournament.id}>
                            {tournament.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">اسم الفريق</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="اختر اسماً مميزاً لفريقك"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">وصف الفريق (اختياري)</Label>
                    <Textarea
                      id="description"
                      placeholder="أخبرنا عن فريقك..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="gaming" 
                    size="lg" 
                    className="w-full"
                    disabled={createTeam.isPending}
                  >
                    {createTeam.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                        جاري الإنشاء...
                      </>
                    ) : (
                      "إنشاء الفريق"
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="w-10 h-10 text-success" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">تم إنشاء الفريق بنجاح!</h3>
                    <p className="text-muted-foreground">شارك الكود مع أعضاء فريقك للانضمام</p>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 p-4 rounded-xl bg-muted/50 border border-border font-mono text-center text-sm break-all">
                      {createdTeamId}
                    </div>
                    <Button variant="outline" size="icon" onClick={copyInviteCode}>
                      {copied ? <Check className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link to="/teams">تصفح الفرق</Link>
                    </Button>
                    <Button variant="gaming" className="flex-1" asChild>
                      <Link to="/dashboard">لوحة التحكم</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTeam;
