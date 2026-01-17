import Layout from "@/components/layout/Layout";
import { Shield, FileText, AlertTriangle } from "lucide-react";

const Terms = () => {
  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">قانوني</span>
            </div>
            <h1 className="font-gaming text-4xl font-bold mb-4">
              <span className="text-primary text-glow-red">الشروط والأحكام</span>
            </h1>
          </div>

          <div className="gaming-card p-8 space-y-8">
            <section>
              <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                القبول بالشروط
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                باستخدامك لمنصة WR Arena، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام المنصة.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-xl mb-4">الأهلية</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• يجب أن يكون عمرك 16 عامًا أو أكثر للمشاركة</li>
                <li>• يجب أن تمتلك حساب Wild Rift صالح</li>
                <li>• يجب أن تكون رتبتك Emerald أو أعلى</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-xl mb-4">قواعد السلوك</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• يمنع استخدام أي برامج غش أو استغلال للثغرات</li>
                <li>• يمنع السلوك السام أو العنصري أو المسيء</li>
                <li>• يجب احترام جميع المشاركين والحكام</li>
                <li>• قرارات الحكم نهائية وغير قابلة للطعن</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-xl mb-4">المدفوعات والجوائز</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• رسوم الاشتراك غير قابلة للاسترداد بعد بدء البطولة</li>
                <li>• يتم توزيع الجوائز خلال 48 ساعة من انتهاء البطولة</li>
                <li>• المنصة تحتفظ بنسبة من الجوائز كرسوم تشغيل</li>
              </ul>
            </section>

            <div className="p-4 bg-warning/10 border border-warning/30 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-warning">تنويه هام:</strong> هذه البطولة ليست تابعة أو مدعومة من Riot Games.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
