import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Trophy, Users, Gamepad2, LogIn, UserPlus, Flame, BookOpen, Mail, User, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navLinks = [
    { href: "/", label: "الرئيسية", icon: Gamepad2 },
    { href: "/tournaments", label: "البطولات", icon: Trophy },
    { href: "/teams", label: "الفرق", icon: Users },
    { href: "/rules", label: "القوانين", icon: BookOpen },
    { href: "/contact", label: "تواصل معنا", icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={cn(
      "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
      scrolled ? "glass-effect border-b border-primary/20 shadow-lg shadow-primary/5" : "bg-transparent"
    )}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-gaming flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-gaming text-xl text-primary block leading-tight">RIFT</span>
              <span className="text-xs text-muted-foreground">ARENA</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                  isActive(link.href) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"
                )}>
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {isLoading ? (
              <div className="w-32 h-9 bg-muted/50 rounded-lg animate-pulse" />
            ) : user && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-gaming flex items-center justify-center">
                      <span className="text-sm text-white font-bold">
                        {profile.username[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm">{profile.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      لوحة التحكم
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      الملف الشخصي
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2 text-gold">
                        <Trophy className="w-4 h-4" />
                        لوحة الإدارة
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 ml-2" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login"><LogIn className="w-4 h-4 ml-2" />دخول</Link>
                </Button>
                <Button variant="gaming" size="sm" asChild>
                  <Link to="/register"><UserPlus className="w-4 h-4 ml-2" />تسجيل</Link>
                </Button>
              </>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-3 rounded-xl glass-effect">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href} onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3.5 rounded-xl text-sm font-medium flex items-center gap-3",
                    isActive(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary"
                  )}>
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border/50 pt-4 mt-2 flex flex-col gap-2">
                {user && profile ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                      <User className="w-5 h-5" />
                      لوحة التحكم
                    </Link>
                    <Link 
                      to="/profile" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                      <Settings className="w-5 h-5" />
                      الملف الشخصي
                    </Link>
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-gold"
                      >
                        <Trophy className="w-5 h-5" />
                        لوحة الإدارة
                      </Link>
                    )}
                    <Button variant="outline" className="w-full" onClick={() => { handleSignOut(); setIsOpen(false); }}>
                      <LogOut className="w-4 h-4 ml-2" />
                      تسجيل الخروج
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/login" onClick={() => setIsOpen(false)}>تسجيل الدخول</Link>
                    </Button>
                    <Button variant="gaming" className="w-full" asChild>
                      <Link to="/register" onClick={() => setIsOpen(false)}>إنشاء حساب</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
