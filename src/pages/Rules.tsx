import Layout from "@/components/layout/Layout";
import { Shield, CheckCircle, AlertTriangle, Ban } from "lucide-react";

const generalRules = [
  "يجب على جميع اللاعبين التصرف باحترام تجاه الآخرين",
  "يمنع استخدام لغة مسيئة أو عنصرية في أي تواصل",
  "يجب الالتزام بمواعيد المباريات المحددة",
  "التأخر أكثر من 15 دقيقة يعني خسارة المباراة تلقائياً",
  "قرارات الحكام نهائية وغير قابلة للطعن",
];

const gameRules = [
  "يجب على كل لاعب استخدام حسابه الشخصي فقط",
  "يمنع مشاركة الحسابات أو تبديل اللاعبين أثناء البطولة",
  "يمنع استخدام أي برامج أو تطبيقات غير مصرح بها",
  "في حالة انقطاع الاتصال، يُعطى اللاعب 5 دقائق للعودة",
  "يجب تسجيل الشاشة للمباريات إذا طُلب ذلك",
];

const paymentRules = [
  "يجب دفع رسوم الاشتراك كاملة قبل بداية البطولة",
  "لن يتم قبول أي فريق بدون إتمام الدفع لجميع الأعضاء",
  "في حالة الانسحاب قبل البطولة، لا يتم استرداد الرسوم",
  "يتم توزيع الجوائز خلال 48 ساعة من انتهاء البطولة",
  "الجوائز تُحول عبر InstaPay أو المحافظ الإلكترونية فقط",
];

const violations = [
  { offense: "السلوك السيء أو الإساءة", penalty: "إنذار أو استبعاد" },
  { offense: "استخدام برامج غش", penalty: "استبعاد دائم + حظر" },
  { offense: "التأخر عن المباراة", penalty: "خسارة المباراة" },
  { offense: "عدم الالتزام بالقواعد", penalty: "إنذار أو استبعاد" },
  { offense: "مشاركة الحساب", penalty: "إلغاء النتائج + حظر" },
];

const Rules = () => {
  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-gaming flex items-center justify-center mb-4">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-gaming text-4xl md:text-5xl font-bold mb-4">
              <span className="text-primary text-glow-cyan">القوانين</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              الالتزام بالقوانين يضمن تجربة عادلة وممتعة للجميع
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* General Rules */}
            <div className="rounded-2xl bg-card border border-border/50 p-6 md:p-8">
              <h2 className="font-bold text-xl mb-6 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-primary" />
                القواعد العامة
              </h2>
              <ul className="space-y-3">
                {generalRules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Game Rules */}
            <div className="rounded-2xl bg-card border border-border/50 p-6 md:p-8">
              <h2 className="font-bold text-xl mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-secondary" />
                قواعد اللعب
              </h2>
              <ul className="space-y-3">
                {gameRules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment Rules */}
            <div className="rounded-2xl bg-card border border-border/50 p-6 md:p-8">
              <h2 className="font-bold text-xl mb-6 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-gold" />
                قواعد الدفع والجوائز
              </h2>
              <ul className="space-y-3">
                {paymentRules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Violations Table */}
            <div className="rounded-2xl bg-card border border-border/50 p-6 md:p-8">
              <h2 className="font-bold text-xl mb-6 flex items-center gap-3">
                <Ban className="w-6 h-6 text-destructive" />
                المخالفات والعقوبات
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-right py-3 px-4 text-muted-foreground font-medium">المخالفة</th>
                      <th className="text-right py-3 px-4 text-muted-foreground font-medium">العقوبة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {violations.map((item, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-4 px-4">{item.offense}</td>
                        <td className="py-4 px-4 text-destructive">{item.penalty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-2xl bg-muted/30 border border-border/50 p-6 text-center">
              <p className="text-muted-foreground text-sm">
                ⚠️ هذه البطولات ليست مرتبطة أو مدعومة من Riot Games.
                <br />
                Wild Rift هي علامة تجارية مسجلة لشركة Riot Games.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Rules;
