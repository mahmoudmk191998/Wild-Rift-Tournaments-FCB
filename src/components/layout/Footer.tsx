import { Link } from "react-router-dom";
import { Flame, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-card border-t border-border/50">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-gaming flex items-center justify-center">
                <Flame className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="font-gaming text-xl font-bold text-foreground">RIFT</span>
                <span className="font-gaming text-xl font-bold text-primary mr-1">ARENA</span>
              </div>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">المنصة العربية الأولى لبطولات Wild Rift التنافسية.</p>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-xs text-muted-foreground leading-relaxed">⚠️ هذه البطولات ليست تابعة لشركة Riot Games ولا ترعاها.</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6">روابط سريعة</h4>
            <ul className="space-y-3">
              {[{ href: "/tournaments", label: "البطولات" }, { href: "/teams", label: "الفرق" }, { href: "/rules", label: "القوانين" }, { href: "/terms", label: "الشروط والأحكام" }].map((link) => (
                <li key={link.href}><Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm"><ExternalLink className="w-3 h-3" />{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground"><div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"><Mail className="w-4 h-4 text-primary" /></div><span className="text-sm">support@riftarena.com</span></li>
              <li className="flex items-center gap-3 text-muted-foreground"><div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"><Phone className="w-4 h-4 text-primary" /></div><span className="text-sm" dir="ltr">01552342086</span></li>
              <li className="flex items-center gap-3 text-muted-foreground"><div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"><ExternalLink className="w-4 h-4 text-primary" /></div><a href="https://riftmasters.online" className="text-sm hover:text-primary">riftmasters.online</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">© 2026 Rift Arena. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
