import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Save, Wallet, Trophy, 
  Bell, Coins, Loader2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAllSiteContent, useUpdateSiteContent } from "@/hooks/useSiteContent";
import { Skeleton } from "@/components/ui/skeleton";

const AdminSettings = () => {
  const { data: siteContent, isLoading } = useAllSiteContent();
  const updateContent = useUpdateSiteContent();

  // Tournament Settings
  const [defaultEntryFee, setDefaultEntryFee] = useState("150");
  const [platformFee, setPlatformFee] = useState("20");
  const [defaultTeamSize, setDefaultTeamSize] = useState("5");
  const [autoLockTeams, setAutoLockTeams] = useState(true);

  // Payment Settings
  const [instaPayEnabled, setInstaPayEnabled] = useState(true);
  const [vodafoneEnabled, setVodafoneEnabled] = useState(true);
  const [instaPayNumber, setInstaPayNumber] = useState("01234567890");
  const [vodafoneNumber, setVodafoneNumber] = useState("01098765432");

  // Prize Distribution
  const [firstPlace, setFirstPlace] = useState("60");
  const [secondPlace, setSecondPlace] = useState("25");
  const [thirdPlace, setThirdPlace] = useState("15");

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [discordNotifications, setDiscordNotifications] = useState(true);

  useEffect(() => {
    if (siteContent) {
      const settings = siteContent.find(c => c.key === "settings");
      if (settings && settings.metadata) {
        const meta = settings.metadata as any;
        setDefaultEntryFee(meta.defaultEntryFee || "150");
        setPlatformFee(meta.platformFee || "20");
        setDefaultTeamSize(meta.defaultTeamSize || "5");
        setAutoLockTeams(meta.autoLockTeams ?? true);
        setInstaPayEnabled(meta.instaPayEnabled ?? true);
        setVodafoneEnabled(meta.vodafoneEnabled ?? true);
        setInstaPayNumber(meta.instaPayNumber || "");
        setVodafoneNumber(meta.vodafoneNumber || "");
        setFirstPlace(meta.firstPlace || "60");
        setSecondPlace(meta.secondPlace || "25");
        setThirdPlace(meta.thirdPlace || "15");
        setEmailNotifications(meta.emailNotifications ?? true);
        setDiscordNotifications(meta.discordNotifications ?? true);
      }
    }
  }, [siteContent]);

  const handleSave = async (section: string) => {
    await updateContent.mutateAsync({
      key: "settings",
      metadata: {
        defaultEntryFee,
        platformFee,
        defaultTeamSize,
        autoLockTeams,
        instaPayEnabled,
        vodafoneEnabled,
        instaPayNumber,
        vodafoneNumber,
        firstPlace,
        secondPlace,
        thirdPlace,
        emailNotifications,
        discordNotifications,
      },
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-96" />
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
              <span className="text-primary text-glow-red">الإعدادات</span>
            </h1>
            <p className="text-muted-foreground">إعدادات المنصة والبطولات</p>
          </div>
        </div>

        <Tabs defaultValue="tournament" className="space-y-6">
          <TabsList className="bg-card border border-border/50">
            <TabsTrigger value="tournament" className="data-[state=active]:bg-primary/20">
              <Trophy className="w-4 h-4 ml-2" />
              البطولات
            </TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-primary/20">
              <Wallet className="w-4 h-4 ml-2" />
              المدفوعات
            </TabsTrigger>
            <TabsTrigger value="prizes" className="data-[state=active]:bg-primary/20">
              <Coins className="w-4 h-4 ml-2" />
              الجوائز
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/20">
              <Bell className="w-4 h-4 ml-2" />
              الإشعارات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tournament" className="space-y-6">
            <div className="gaming-card p-6">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                إعدادات البطولات الافتراضية
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="entryFee">رسوم الاشتراك الافتراضية (جنيه)</Label>
                  <Input 
                    id="entryFee"
                    type="number"
                    value={defaultEntryFee}
                    onChange={(e) => setDefaultEntryFee(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="platformFee">نسبة المنصة (%)</Label>
                  <Input 
                    id="platformFee"
                    type="number"
                    value={platformFee}
                    onChange={(e) => setPlatformFee(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="teamSize">حجم الفريق الافتراضي</Label>
                  <Select value={defaultTeamSize} onValueChange={setDefaultTeamSize}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 لاعبين</SelectItem>
                      <SelectItem value="5">5 لاعبين</SelectItem>
                      <SelectItem value="6">6 لاعبين (+ احتياطي)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div>
                    <Label>قفل الفرق تلقائياً</Label>
                    <p className="text-xs text-muted-foreground mt-1">قفل الفرق عند بدء البطولة</p>
                  </div>
                  <Switch checked={autoLockTeams} onCheckedChange={setAutoLockTeams} />
                </div>
              </div>
              <Button 
                variant="gaming" 
                className="mt-6" 
                onClick={() => handleSave("البطولات")}
                disabled={updateContent.isPending}
              >
                {updateContent.isPending ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 ml-2" />
                )}
                حفظ
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <div className="gaming-card p-6">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                طرق الدفع
              </h2>
              <div className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-xl border border-border/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">InstaPay</h3>
                      <p className="text-xs text-muted-foreground">تفعيل الدفع عبر InstaPay</p>
                    </div>
                    <Switch checked={instaPayEnabled} onCheckedChange={setInstaPayEnabled} />
                  </div>
                  {instaPayEnabled && (
                    <div>
                      <Label htmlFor="instapay">رقم InstaPay</Label>
                      <Input 
                        id="instapay"
                        value={instaPayNumber}
                        onChange={(e) => setInstaPayNumber(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>

                <div className="p-4 bg-muted/30 rounded-xl border border-border/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">فودافون كاش</h3>
                      <p className="text-xs text-muted-foreground">تفعيل الدفع عبر فودافون كاش</p>
                    </div>
                    <Switch checked={vodafoneEnabled} onCheckedChange={setVodafoneEnabled} />
                  </div>
                  {vodafoneEnabled && (
                    <div>
                      <Label htmlFor="vodafone">رقم فودافون كاش</Label>
                      <Input 
                        id="vodafone"
                        value={vodafoneNumber}
                        onChange={(e) => setVodafoneNumber(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>
              <Button 
                variant="gaming" 
                className="mt-6" 
                onClick={() => handleSave("المدفوعات")}
                disabled={updateContent.isPending}
              >
                {updateContent.isPending ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 ml-2" />
                )}
                حفظ
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="prizes" className="space-y-6">
            <div className="gaming-card p-6">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Coins className="w-5 h-5 text-gold" />
                توزيع الجوائز الافتراضي
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                حدد نسبة توزيع الجوائز. المجموع يجب أن يساوي 100%
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30">
                  <Label htmlFor="first" className="text-gold">المركز الأول (%)</Label>
                  <Input 
                    id="first"
                    type="number"
                    value={firstPlace}
                    onChange={(e) => setFirstPlace(e.target.value)}
                    className="mt-2 text-center font-gaming text-xl"
                  />
                </div>
                <div className="p-4 bg-muted/30 rounded-xl border border-border/30">
                  <Label htmlFor="second">المركز الثاني (%)</Label>
                  <Input 
                    id="second"
                    type="number"
                    value={secondPlace}
                    onChange={(e) => setSecondPlace(e.target.value)}
                    className="mt-2 text-center font-gaming text-xl"
                  />
                </div>
                <div className="p-4 bg-muted/30 rounded-xl border border-border/30">
                  <Label htmlFor="third">المركز الثالث (%)</Label>
                  <Input 
                    id="third"
                    type="number"
                    value={thirdPlace}
                    onChange={(e) => setThirdPlace(e.target.value)}
                    className="mt-2 text-center font-gaming text-xl"
                  />
                </div>
              </div>
              <div className="mt-4 p-3 bg-muted/30 rounded-lg text-center">
                <span className="text-muted-foreground">المجموع: </span>
                <span className={parseInt(firstPlace) + parseInt(secondPlace) + parseInt(thirdPlace) === 100 ? "text-success" : "text-destructive"}>
                  {parseInt(firstPlace || "0") + parseInt(secondPlace || "0") + parseInt(thirdPlace || "0")}%
                </span>
              </div>
              <Button 
                variant="gaming" 
                className="mt-6" 
                onClick={() => handleSave("الجوائز")}
                disabled={updateContent.isPending}
              >
                {updateContent.isPending ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 ml-2" />
                )}
                حفظ
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="gaming-card p-6">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                إعدادات الإشعارات
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div>
                    <h3 className="font-medium">إشعارات البريد الإلكتروني</h3>
                    <p className="text-xs text-muted-foreground mt-1">إرسال إشعارات للاعبين عبر البريد</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div>
                    <h3 className="font-medium">إشعارات Discord</h3>
                    <p className="text-xs text-muted-foreground mt-1">إرسال إشعارات لسيرفر Discord</p>
                  </div>
                  <Switch checked={discordNotifications} onCheckedChange={setDiscordNotifications} />
                </div>
              </div>
              <Button 
                variant="gaming" 
                className="mt-6" 
                onClick={() => handleSave("الإشعارات")}
                disabled={updateContent.isPending}
              >
                {updateContent.isPending ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 ml-2" />
                )}
                حفظ
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
