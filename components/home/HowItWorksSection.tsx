import { UserPlus, Users, CreditCard, Trophy } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "سجّل حسابك",
    description: "أنشئ حسابك مجاناً وأضف معلومات Riot ID الخاصة بك",
  },
  {
    icon: Users,
    step: "02",
    title: "كوّن فريقك",
    description: "أنشئ فريقك أو انضم لفريق موجود عبر رابط الدعوة",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "ادفع رسوم الاشتراك",
    description: "ادفع 150 جنيه للاعب عبر InstaPay أو المحفظة",
  },
  {
    icon: Trophy,
    step: "04",
    title: "نافس واربح!",
    description: "شارك في البطولة وتنافس على الجوائز النقدية",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 relative bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-gaming text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">كيف </span>
            <span className="text-primary text-glow-cyan">تبدأ؟</span>
          </h2>
          <p className="text-muted-foreground">
            أربع خطوات بسيطة للانضمام للبطولات والتنافس على الجوائز
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-0 w-full h-0.5 bg-gradient-to-l from-primary/50 to-transparent -translate-x-1/2" />
              )}
              
              <div className="relative p-6 rounded-2xl bg-card border border-border/50 text-center card-glow">
                {/* Step Number */}
                <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-gaming">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="font-bold text-lg mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
