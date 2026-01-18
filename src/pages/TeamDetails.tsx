import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users, Crown, ArrowRight, UserPlus, Check, X,
  Loader2, Upload, Wallet, Shield, Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTeam, useTeamMembers } from "@/hooks/useTeams";
import { useTournament } from "@/hooks/useTournaments";
import { useTeamJoinRequests, useCreateJoinRequest, useRespondToJoinRequest, useRemoveTeamMember } from "@/hooks/useJoinRequests";
import { useCreatePayment, uploadPaymentScreenshot, useTeamPayments } from "@/hooks/usePayments";
import { useAllSiteContent } from "@/hooks/useSiteContent";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const { data: team, isLoading: teamLoading } = useTeam(id);
  const { data: members, isLoading: membersLoading } = useTeamMembers(id);
  const { data: tournament } = useTournament(team?.tournament_id);
  const { data: joinRequests } = useTeamJoinRequests(id);
  
  const createJoinRequest = useCreateJoinRequest();
  const respondToRequest = useRespondToJoinRequest();
  const removeMember = useRemoveTeamMember();
  const createPayment = useCreatePayment();
  const { data: teamPayments } = useTeamPayments(id);
  const { data: siteContent } = useAllSiteContent();

  const paymentSettings = (() => {
    const settings = siteContent?.find((c: any) => c.key === "settings");
    const meta = settings?.metadata as any | undefined;
    return {
      instapay: meta?.instaPayNumber || "01552342086",
      vodafone: meta?.vodafoneNumber || "01552342086",
    };
  })();
  
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [riotId, setRiotId] = useState(profile?.riot_id || "");
  const [message, setMessage] = useState("");
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("instapay");
  const [isUploading, setIsUploading] = useState(false);

  const isCaptain = user && team?.captain_id === user.id;
  const isMember = members?.some(m => m.user_id === user?.id);
  const hasPendingRequest = joinRequests?.some(
    r => r.user_id === user?.id && r.status === "pending"
  );
  const pendingRequests = joinRequests?.filter(r => r.status === "pending") || [];

  const handleJoinRequest = async () => {
    if (!id) return;
    await createJoinRequest.mutateAsync({
      teamId: id,
      riotId,
      message,
    });
    setJoinDialogOpen(false);
    setRiotId("");
    setMessage("");
  };

  const handleRespondToRequest = async (requestId: string, status: "approved" | "rejected") => {
    if (!id) return;
    await respondToRequest.mutateAsync({
      requestId,
      status,
      teamId: id,
    });
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!id) return;
    if (confirm("هل أنت متأكد من إزالة هذا اللاعب؟")) {
      await removeMember.mutateAsync({ memberId, teamId: id });
    }
  };

  const handlePaymentSubmit = async () => {
    if (!paymentFile || !team || !tournament || !user) return;
    
    setIsUploading(true);
    try {
      const screenshotUrl = await uploadPaymentScreenshot(paymentFile, user.id);
      await createPayment.mutateAsync({
        teamId: team.id,
        tournamentId: team.tournament_id,
        amount: tournament.entry_fee,
        screenshotUrl,
        paymentMethod,
      });
      setPaymentDialogOpen(false);
      setPaymentFile(null);
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء رفع الإيصال");
    } finally {
      setIsUploading(false);
    }
  };

  if (teamLoading) {
    return (
      <Layout>
        <div className="min-h-screen py-12">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
              <div>
                <Skeleton className="h-80 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!team) {
    return (
      <Layout>
        <div className="min-h-screen py-12 flex items-center justify-center">
          <div className="text-center">
            <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-bold mb-2">الفريق غير موجود</h2>
            <Button asChild>
              <Link to="/teams">العودة للفرق</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const statusLabels: Record<string, string> = {
    incomplete: "غير مكتمل",
    pending_payment: "في انتظار الدفع",
    registered: "مسجل",
    qualified: "متأهل",
    eliminated: "خرج",
  };

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
            <span className="text-foreground">{team.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Team Header */}
              <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
                <div className="relative h-32 bg-gradient-to-br from-primary/30 to-secondary/30 p-6">
                  <Trophy className="absolute bottom-4 left-4 w-20 h-20 text-primary/20" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="font-gaming text-2xl font-bold mb-2">{team.name}</h1>
                      <p className="text-muted-foreground">
                        {tournament?.name || "بطولة غير محددة"}
                      </p>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      team.status === "registered" ? "badge-approved" :
                      team.status === "pending_payment" ? "badge-pending" : "badge-full"
                    )}>
                      {statusLabels[team.status] || team.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  أعضاء الفريق ({members?.length || 0}/{tournament?.team_size || 5})
                </h2>

                {membersLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : members && members.length > 0 ? (
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50"
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            {member.profiles?.avatar_url ? (
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={member.profiles.avatar_url} alt={member.profiles.username} />
                                <AvatarFallback className="bg-gradient-gaming text-sm font-bold text-primary-foreground">
                                  {member.profiles?.username?.[0]?.toUpperCase() || "?"}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-gaming flex items-center justify-center">
                                <span className="text-sm font-bold text-primary-foreground">
                                  {member.profiles?.username?.[0]?.toUpperCase() || "?"}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{member.profiles?.username}</span>
                              {member.role === "captain" && (
                                <Crown className="w-4 h-4 text-gold" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {member.riot_id || member.profiles?.riot_id || "لا يوجد Riot ID"}
                              </span>
                              {/* Payment status badge */}
                              {(() => {
                                const p = teamPayments?.find((tp: any) => tp.user_id === member.user_id);
                                if (!p) return <span className="text-xs text-muted-foreground">لم يقم بالرفع</span>;
                                if (p.status === "approved") return <span className="text-xs text-success">إيصال مقبول</span>;
                                if (p.status === "rejected") return <span className="text-xs text-destructive">إيصال مرفوض</span>;
                                return <span className="text-xs text-warning">قيد المراجعة</span>;
                              })()}
                            </div>
                          </div>
                        </div>
                        {isCaptain && member.role !== "captain" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-6">
                    لا يوجد أعضاء بعد
                  </p>
                )}
              </div>

              {/* Join Requests (for captain) */}
              {isCaptain && pendingRequests.length > 0 && (
                <div className="rounded-2xl bg-card border border-border/50 p-6">
                  <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-primary" />
                    طلبات الانضمام ({pendingRequests.length})
                  </h2>
                  <div className="space-y-3">
                    {pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-primary/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-sm font-bold">
                              {request.profiles?.username?.[0]?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">{request.profiles?.username}</span>
                            <p className="text-sm text-muted-foreground">
                              {request.riot_id || request.profiles?.riot_id || "لا يوجد Riot ID"}
                              {request.profiles?.rank && ` • ${request.profiles.rank}`}
                            </p>
                            {request.message && (
                              <p className="text-xs text-muted-foreground mt-1">
                                "{request.message}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-success border-success/50 hover:bg-success/20"
                            onClick={() => handleRespondToRequest(request.id, "approved")}
                            disabled={respondToRequest.isPending}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive border-destructive/50 hover:bg-destructive/20"
                            onClick={() => handleRespondToRequest(request.id, "rejected")}
                            disabled={respondToRequest.isPending}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-card border border-border/50 p-6 sticky top-24">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">البطولة</div>
                      <div className="font-medium">{tournament?.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">الأعضاء</div>
                      <div className="font-medium">{members?.length || 0}/{tournament?.team_size || 5}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">المجموعة</div>
                      <div className="font-medium">{team.group_name || "لم يتم التوزيع"}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {user ? (
                  <div className="space-y-3">
                    {!isMember && !hasPendingRequest && !team.is_locked && (
                      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="gaming" className="w-full">
                            <UserPlus className="w-4 h-4 ml-2" />
                            طلب الانضمام
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>طلب الانضمام للفريق</DialogTitle>
                            <DialogDescription>
                              أرسل طلب انضمام لفريق {team.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label htmlFor="riotId">Riot ID الخاص بك</Label>
                              <Input
                                id="riotId"
                                value={riotId}
                                onChange={(e) => setRiotId(e.target.value)}
                                placeholder="مثال: Player#EG1"
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label htmlFor="message">رسالة (اختياري)</Label>
                              <Textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="لماذا تريد الانضمام؟"
                                className="mt-2"
                                rows={3}
                              />
                            </div>
                          </div>
                          <Button
                            variant="gaming"
                            className="w-full"
                            onClick={handleJoinRequest}
                            disabled={createJoinRequest.isPending}
                          >
                            {createJoinRequest.isPending ? (
                              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                            ) : null}
                            إرسال الطلب
                          </Button>
                        </DialogContent>
                      </Dialog>
                    )}

                    {hasPendingRequest && (
                      <div className="p-4 rounded-xl bg-warning/10 border border-warning/30 text-center">
                        <p className="text-warning text-sm">طلبك قيد المراجعة</p>
                      </div>
                    )}

                    {(isCaptain || isMember) && team.status !== "registered" && (
                      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="gaming" className="w-full">
                            <Wallet className="w-4 h-4 ml-2" />
                            رفع إيصال الدفع
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>رفع إيصال الدفع</DialogTitle>
                            <DialogDescription>
                              المبلغ المطلوب لكل لاعب: {tournament ? tournament.entry_fee : 0} جنيه
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label>طريقة الدفع</Label>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <Button
                                  type="button"
                                  variant={paymentMethod === "instapay" ? "default" : "outline"}
                                  onClick={() => setPaymentMethod("instapay")}
                                >
                                  InstaPay
                                </Button>
                                <Button
                                  type="button"
                                  variant={paymentMethod === "vodafone" ? "default" : "outline"}
                                  onClick={() => setPaymentMethod("vodafone")}
                                >
                                  فودافون كاش
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                              <div className="text-sm text-muted-foreground">تفاصيل التحويل</div>
                              <div className="mt-2">
                                {paymentMethod === "instapay" ? (
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm">InstaPay / المحفظة:</div>
                                    <div className="font-medium" dir="ltr">{paymentSettings.instapay}</div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm">فودافون كاش:</div>
                                    <div className="font-medium" dir="ltr">{paymentSettings.vodafone}</div>
                                  </div>
                                )}
                                <div className="text-xs text-muted-foreground mt-2">تأكد من تحويل المبلغ إلى الرقم الصحيح قبل رفع إيصال الدفع.</div>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="screenshot">صورة الإيصال</Label>
                              <Input
                                id="screenshot"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPaymentFile(e.target.files?.[0] || null)}
                                className="mt-2"
                              />
                            </div>
                          </div>
                          <Button
                            variant="gaming"
                            className="w-full"
                            onClick={handlePaymentSubmit}
                            disabled={!paymentFile || isUploading}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                جاري الرفع...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 ml-2" />
                                رفع الإيصال
                              </>
                            )}
                          </Button>
                        </DialogContent>
                      </Dialog>
                    )}

                    {isMember && !isCaptain && (
                      <div className="p-4 rounded-xl bg-success/10 border border-success/30 text-center">
                        <p className="text-success text-sm">أنت عضو في هذا الفريق</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button variant="gaming" className="w-full" asChild>
                    <Link to="/login">سجّل دخول للانضمام</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeamDetails;
