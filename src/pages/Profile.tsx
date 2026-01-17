import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User, Save, Camera, Trophy, Users, Medal,
  Calendar, ArrowLeft, Loader2, Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateProfile, uploadAvatar } from "@/hooks/useProfile";
import { useMyTeams } from "@/hooks/useTeams";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ranks = [
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Emerald",
  "Diamond",
  "Master",
  "Grandmaster",
  "Challenger",
];

const Profile = () => {
  const { user, profile, isLoading: authLoading, isAdmin } = useAuth();
  const { data: myTeams, isLoading: teamsLoading } = useMyTeams();
  const [teamStatuses, setTeamStatuses] = useState<Record<string, { groupName?: string | null; position?: number | null; knockout?: string | null }>>({});

  useEffect(() => {
    if (!myTeams || myTeams.length === 0) return;

    let mounted = true;

    const fetchStatuses = async () => {
      const statuses: Record<string, { groupName?: string | null; position?: number | null; knockout?: string | null }> = {};

      for (const team of myTeams) {
        try {
          const tournamentId = team.tournament_id;
          const groupName = team.group_name || null;
          let position: number | null = null;
          let knockout: string | null = null;

          if (tournamentId && groupName) {
            const { data: groupsData } = await supabase
              .from("groups")
              .select("id,name")
              .eq("tournament_id", tournamentId)
              .eq("name", groupName)
              .limit(1)
              .maybeSingle();

            const groupId = (groupsData as any)?.id;

            if (groupId) {
              const { data: standings } = await supabase
                .from("group_standings")
                .select("team_id,points")
                .eq("group_id", groupId)
                .order("points", { ascending: false });

              if (standings && Array.isArray(standings)) {
                const idx = standings.findIndex((s: any) => s.team_id === team.id);
                if (idx !== -1) position = idx + 1;
              }
            }
          }

          if (tournamentId) {
            const { data: matches } = await supabase
              .from("matches")
              .select("id,team1_id,team2_id,stage,is_completed,winner_id,round")
              .eq("tournament_id", tournamentId)
              .or(`team1_id.eq.${team.id},team2_id.eq.${team.id}`);

            const playerMatches = matches || [];
            if (playerMatches.length === 0) {
              knockout = null;
            } else {
              const completed = playerMatches.filter((m: any) => m.is_completed).length;
              const total = playerMatches.length;
              const hasWin = playerMatches.some((m: any) => m.winner_id === team.id);
              const hasLoss = playerMatches.some((m: any) => m.is_completed && m.winner_id && m.winner_id !== team.id && (m.team1_id === team.id || m.team2_id === team.id));

              if (hasLoss && completed > 0 && !hasWin) knockout = "مقصى";
              else if (hasWin) knockout = `متقدم (${completed}/${total})`;
              else knockout = `${completed}/${total}`;
            }
          }

          statuses[team.id] = { groupName, position, knockout };
        } catch (e) {
          // ignore individual team errors
          statuses[team.id] = { groupName: team.group_name || null, position: null, knockout: null };
        }
      }

      if (mounted) setTeamStatuses(statuses);
    };

    fetchStatuses();

    return () => {
      mounted = false;
    };
  }, [myTeams]);
  const updateProfile = useUpdateProfile();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [riotId, setRiotId] = useState("");
  const [rank, setRank] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setRiotId(profile.riot_id || "");
      setRank(profile.rank || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!username.trim()) {
      toast.error("يجب إدخال اسم المستخدم");
      return;
    }

    updateProfile.mutate({
      username,
      riot_id: riotId || null,
      rank: rank || null,
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const avatarUrl = await uploadAvatar(file, user.id);
      await updateProfile.mutateAsync({ avatar_url: avatarUrl });
      toast.success("تم تحديث الصورة الشخصية");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء رفع الصورة");
    } finally {
      setIsUploading(false);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Skeleton className="h-12 w-48 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Skeleton className="h-80 rounded-2xl" />
              <div className="lg:col-span-2">
                <Skeleton className="h-96 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-gaming text-3xl font-bold">
                <span className="text-primary text-glow-red">الملف الشخصي</span>
              </h1>
              <p className="text-muted-foreground">تعديل معلومات حسابك</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="rounded-2xl bg-card border border-border/50 p-6 text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.username} />
                  <AvatarFallback className="bg-gradient-gaming text-2xl font-gaming text-primary-foreground">
                    {profile.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarClick}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-primary-foreground" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <h2 className="font-bold text-lg">{profile.username}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {profile.riot_id || "لم يتم تحديد Riot ID"}
              </p>

              {profile.rank && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm mb-4">
                  <Medal className="w-4 h-4" />
                  {profile.rank}
                </div>
              )}

              {isAdmin && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-sm">
                  <Trophy className="w-4 h-4" />
                  مدير
                </div>
              )}

              <div className="border-t border-border/50 mt-6 pt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">تاريخ الانضمام</span>
                  <span>{new Date(profile.created_at).toLocaleDateString("ar-EG")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">الفرق</span>
                  <span>{myTeams?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="lg:col-span-2 rounded-2xl bg-card border border-border/50 p-6">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-primary" />
                تعديل المعلومات
              </h3>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="username">اسم المستخدم *</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="أدخل اسم المستخدم"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="riotId">Riot ID</Label>
                  <Input
                    id="riotId"
                    value={riotId}
                    onChange={(e) => setRiotId(e.target.value)}
                    placeholder="مثال: Player#1234"
                    className="mt-2"
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    معرف حسابك في Wild Rift
                  </p>
                </div>

                <div>
                  <Label htmlFor="rank">الرتبة</Label>
                  <Select value={rank} onValueChange={setRank}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="اختر رتبتك" />
                    </SelectTrigger>
                    <SelectContent>
                      {ranks.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="gaming"
                    onClick={handleSave}
                    disabled={updateProfile.isPending}
                    className="flex-1"
                  >
                    {updateProfile.isPending ? (
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 ml-2" />
                    )}
                    حفظ التغييرات
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* My Teams Section */}
          <div className="mt-8 rounded-2xl bg-card border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                فرقي
              </h3>
              <Button variant="outline" size="sm" asChild>
                <Link to="/teams/create">إنشاء فريق جديد</Link>
              </Button>
            </div>

            {teamsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : myTeams && myTeams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myTeams.map((team) => (
                  <div
                    key={team.id}
                    className="p-4 rounded-xl bg-muted/30 border border-border/50 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-gaming flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">{team.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {team.status === "registered"
                          ? "مسجل"
                          : team.status === "pending_payment"
                          ? "في انتظار الدفع"
                          : "غير مكتمل"}
                      </p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <div>المجموعة: {team.group_name || '—'}</div>
                        <div>الترتيب: {teamStatuses[team.id]?.position ?? '—'}</div>
                        <div>الإقصائيات: {teamStatuses[team.id]?.knockout ?? '—'}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/teams/${team.id}`}>عرض</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground mb-4">لم تنضم لأي فريق بعد</p>
                <Button variant="gaming" asChild>
                  <Link to="/teams/create">أنشئ فريقك الأول</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
