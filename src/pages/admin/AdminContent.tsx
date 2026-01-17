import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Save, Eye, Home, Shield, 
  HelpCircle, Phone, Loader2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAllSiteContent, useUpdateSiteContent } from "@/hooks/useSiteContent";
import { Skeleton } from "@/components/ui/skeleton";

const AdminContent = () => {
  const { data: siteContent, isLoading } = useAllSiteContent();
  const updateContent = useUpdateSiteContent();

  const [heroTitle, setHeroTitle] = useState("انضم لأقوى بطولات Wild Rift");
  const [heroDescription, setHeroDescription] = useState("سجّل فريقك الآن وتنافس مع أفضل اللاعبين في المنطقة. جوائز نقدية ضخمة بانتظارك!");
  const [rules, setRules] = useState("");
  const [faq, setFaq] = useState<{ question: string; answer: string }[]>([]);
  const [contactEmail, setContactEmail] = useState("support@wrarena.com");
  const [contactPhone, setContactPhone] = useState("+20 123 456 7890");
  const [discordLink, setDiscordLink] = useState("https://discord.gg/wrarena");

  useEffect(() => {
    if (siteContent) {
      const heroContent = siteContent.find(c => c.key === "hero");
      const rulesContent = siteContent.find(c => c.key === "rules");
      const faqContent = siteContent.find(c => c.key === "faq");
      const contactContent = siteContent.find(c => c.key === "contact");

      if (heroContent) {
        setHeroTitle(heroContent.title || "");
        setHeroDescription(heroContent.content || "");
      }
      if (rulesContent) {
        setRules(rulesContent.content || "");
      }
      if (faqContent && faqContent.metadata) {
        setFaq((faqContent.metadata as any).items || []);
      }
      if (contactContent && contactContent.metadata) {
        const meta = contactContent.metadata as any;
        setContactEmail(meta.email || "");
        setContactPhone(meta.phone || "");
        setDiscordLink(meta.discord || "");
      }
    }
  }, [siteContent]);

  const handleSaveHero = async () => {
    await updateContent.mutateAsync({
      key: "hero",
      title: heroTitle,
      content: heroDescription,
    });
  };

  const handleSaveRules = async () => {
    await updateContent.mutateAsync({
      key: "rules",
      content: rules,
    });
  };

  const handleSaveFaq = async () => {
    await updateContent.mutateAsync({
      key: "faq",
      metadata: { items: faq },
    });
  };

  const handleSaveContact = async () => {
    await updateContent.mutateAsync({
      key: "contact",
      metadata: {
        email: contactEmail,
        phone: contactPhone,
        discord: discordLink,
      },
    });
  };

  const addFaqItem = () => {
    setFaq([...faq, { question: "", answer: "" }]);
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
              <span className="text-primary text-glow-red">إدارة المحتوى</span>
            </h1>
            <p className="text-muted-foreground">تعديل نصوص ومحتوى الموقع</p>
          </div>
        </div>

        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="bg-card border border-border/50">
            <TabsTrigger value="home" className="data-[state=active]:bg-primary/20">
              <Home className="w-4 h-4 ml-2" />
              الصفحة الرئيسية
            </TabsTrigger>
            <TabsTrigger value="rules" className="data-[state=active]:bg-primary/20">
              <Shield className="w-4 h-4 ml-2" />
              القوانين
            </TabsTrigger>
            <TabsTrigger value="faq" className="data-[state=active]:bg-primary/20">
              <HelpCircle className="w-4 h-4 ml-2" />
              الأسئلة الشائعة
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-primary/20">
              <Phone className="w-4 h-4 ml-2" />
              التواصل
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <div className="gaming-card p-6">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" />
                قسم البداية (Hero)
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="heroTitle">العنوان الرئيسي</Label>
                  <Input 
                    id="heroTitle"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="heroDesc">الوصف</Label>
                  <Textarea 
                    id="heroDesc"
                    value={heroDescription}
                    onChange={(e) => setHeroDescription(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>
                <Button 
                  variant="gaming" 
                  onClick={handleSaveHero}
                  disabled={updateContent.isPending}
                >
                  {updateContent.isPending ? (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 ml-2" />
                  )}
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <div className="gaming-card p-6">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                قوانين البطولة (Markdown)
              </h2>
              <div className="space-y-4">
                <Textarea 
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  className="font-mono text-sm"
                  rows={20}
                  placeholder="اكتب قوانين البطولة هنا..."
                />
                <div className="flex gap-3">
                  <Button 
                    variant="gaming" 
                    onClick={handleSaveRules}
                    disabled={updateContent.isPending}
                  >
                    {updateContent.isPending ? (
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 ml-2" />
                    )}
                    حفظ
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 ml-2" />
                    معاينة
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <div className="gaming-card p-6">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                الأسئلة الشائعة
              </h2>
              <div className="space-y-4">
                {faq.map((item, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-xl border border-border/30 space-y-3">
                    <div>
                      <Label>السؤال</Label>
                      <Input 
                        value={item.question}
                        onChange={(e) => {
                          const newFaq = [...faq];
                          newFaq[index].question = e.target.value;
                          setFaq(newFaq);
                        }}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>الإجابة</Label>
                      <Textarea 
                        value={item.answer}
                        onChange={(e) => {
                          const newFaq = [...faq];
                          newFaq[index].answer = e.target.value;
                          setFaq(newFaq);
                        }}
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={addFaqItem}>
                  + إضافة سؤال جديد
                </Button>
                <Button 
                  variant="gaming" 
                  onClick={handleSaveFaq}
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
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="gaming-card p-6">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                معلومات التواصل
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input 
                    id="phone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="discord">رابط Discord</Label>
                  <Input 
                    id="discord"
                    value={discordLink}
                    onChange={(e) => setDiscordLink(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <Button 
                  variant="gaming" 
                  onClick={handleSaveContact}
                  disabled={updateContent.isPending}
                >
                  {updateContent.isPending ? (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 ml-2" />
                  )}
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
