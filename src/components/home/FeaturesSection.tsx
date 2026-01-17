import { Trophy, Users, Wallet, Shield, Swords, Medal } from "lucide-react";

const features = [
  { icon: Trophy, title: "بطولات احترافية", description: "نظام بطولات متكامل مع مراحل المجموعات وخروج المغلوب" },
  { icon: Users, title: "نظام الفرق", description: "أنشئ فريقك وادعُ أصدقائك للانضمام والمنافسة معاً" },
  { icon: Wallet, title: "جوائز نقدية", description: "جوائز مالية حقيقية للفائزين في كل بطولة" },
  { icon: Shield, title: "لعب نظيف", description: "نظام صارم لمنع الغش وضمان المنافسة العادلة" },
  { icon: Swords, title: "مباريات BO3", description: "مباريات تنافسية بنظام Best of 3 لإثبات المهارة" },
  { icon: Medal, title: "تصنيفات", description: "نظام تصنيف للاعبين والفرق بناءً على أدائهم" },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute left-0 top-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">مميزات المنصة</span>
          </div>
          <h2 className="font-gaming text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">لماذا</span>
            <span className="text-primary text-glow-red mr-2">تختارنا؟</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="gaming-card p-6 card-glow group">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
