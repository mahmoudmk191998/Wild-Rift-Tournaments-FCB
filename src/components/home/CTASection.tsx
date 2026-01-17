import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Zap, Flame, Crown } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute top-10 right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-float" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="fire-border rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center animate-glow-pulse">
              <Crown className="w-10 h-10 text-primary" />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
              <Flame className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">ابدأ رحلتك نحو القمة</span>
            </div>
            <h2 className="font-gaming text-3xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">هل أنت جاهز</span><br />
              <span className="text-primary text-glow-red">للمنافسة؟</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">انضم إلى آلاف اللاعبين المحترفين وابدأ رحلتك في عالم بطولات Wild Rift التنافسية</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button variant="fire" size="xl" asChild><Link to="/register"><Trophy className="w-5 h-5" />سجّل الآن مجاناً</Link></Button>
              <Button variant="neon" size="xl" asChild><Link to="/tournaments"><Zap className="w-5 h-5" />استكشف البطولات</Link></Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
