import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, User, Gamepad2, UserPlus, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ranks = ["Iron", "Bronze", "Silver", "Gold", "Platinum", "Emerald", "Diamond", "Master", "Grandmaster", "Challenger"];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    riotId: "",
    rank: "",
    password: "",
    confirmPassword: "",
  });
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(formData.email, formData.password, {
      username: formData.username,
      riot_id: formData.riotId,
      rank: formData.rank,
    });

    if (error) {
      toast.error(error.message || "خطأ في إنشاء الحساب");
    } else {
      toast.success("تم إنشاء الحساب بنجاح!");
      navigate("/dashboard");
    }

    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-gaming text-3xl font-bold mb-2">
                <span className="text-primary text-glow-red">إنشاء حساب</span>
              </h1>
              <p className="text-muted-foreground">انضم إلينا وابدأ رحلتك نحو القمة</p>
            </div>

            <div className="rounded-2xl bg-card border border-border/50 p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username">اسم المستخدم</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="username" type="text" placeholder="اختر اسم مستخدم" className="pr-10" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="example@email.com" className="pr-10" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riotId">Riot ID</Label>
                  <div className="relative">
                    <Gamepad2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="riotId" type="text" placeholder="PlayerName#TAG" className="pr-10" value={formData.riotId} onChange={(e) => setFormData({ ...formData, riotId: e.target.value })} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rank">الرتبة</Label>
                  <Select value={formData.rank} onValueChange={(value) => setFormData({ ...formData, rank: value })}>
                    <SelectTrigger><SelectValue placeholder="اختر رتبتك" /></SelectTrigger>
                    <SelectContent>
                      {ranks.map((rank) => (<SelectItem key={rank} value={rank.toLowerCase()}>{rank}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pr-10 pl-10" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="confirmPassword" type="password" placeholder="••••••••" className="pr-10" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                  </div>
                </div>

                <Button type="submit" variant="gaming" size="lg" className="w-full" disabled={isLoading}>
                  <UserPlus className="w-5 h-5 ml-2" />
                  {isLoading ? "جاري الإنشاء..." : "إنشاء حساب"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  لديك حساب بالفعل؟{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">سجّل الدخول</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
