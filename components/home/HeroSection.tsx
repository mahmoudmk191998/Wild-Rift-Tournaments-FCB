import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Zap, Flame, ChevronLeft, Star } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-40 left-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
      
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 animate-slide-up">
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">منصة البطولات الرسمية</span>
          </div>

          <h1 className="font-gaming text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
            <span className="text-foreground">ساحة</span>
            <br />
            <span className="text-primary text-glow-red">الأبطال</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed animate-slide-up max-w-2xl mx-auto">
            انضم إلى أقوى بطولات Wild Rift في المنطقة العربية
            <br />
            <span className="text-primary font-semibold">نافس • اربح • كن أسطورة</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
            <Button variant="gaming" size="xl" asChild className="group">
              <Link to="/tournaments">
                <Trophy className="w-5 h-5" />
                تصفح البطولات
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </Link>
            </Button>
            <Button variant="neon" size="xl" asChild>
              <Link to="/register">
                <Users className="w-5 h-5" />
                سجّل الآن
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
            {[
              { value: "500+", label: "لاعب مسجل", icon: Users },
              { value: "50+", label: "بطولة منتهية", icon: Trophy },
              { value: "100K+", label: "جنيه جوائز", icon: Zap },
              { value: "24/7", label: "دعم متواصل", icon: Flame },
            ].map((stat, index) => (
              <div key={index} className="gaming-card p-4 card-glow">
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary/20 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="font-gaming text-2xl font-bold text-primary text-glow-red">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
