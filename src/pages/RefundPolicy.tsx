import Layout from "@/components/layout/Layout";
import { Wallet, AlertTriangle, CheckCircle } from "lucide-react";

const RefundPolicy = () => {
  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">المدفوعات</span>
            </div>
            <h1 className="font-gaming text-4xl font-bold mb-4">
              <span className="text-primary text-glow-red">سياسة الاسترداد</span>
            </h1>
          </div>

          <div className="gaming-card p-8 space-y-8">
            <section>
              <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                حالات الاسترداد المقبولة
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• إلغاء البطولة من قبل الإدارة</li>
                <li>• طلب الاسترداد قبل 48 ساعة من بدء البطولة</li>
                <li>• عدم اكتمال الحد الأدنى من الفرق</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                حالات عدم الاسترداد
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• بعد بدء البطولة</li>
                <li>• الاستبعاد بسبب مخالفة القوانين</li>
                <li>• عدم حضور المباريات</li>
                <li>• انسحاب الفريق طوعياً</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-xl mb-4">طريقة الاسترداد</h2>
              <p className="text-muted-foreground leading-relaxed">
                يتم الاسترداد عبر نفس طريقة الدفع الأصلية خلال 7 أيام عمل. تواصل معنا عبر صفحة الاتصال لطلب الاسترداد.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RefundPolicy;
