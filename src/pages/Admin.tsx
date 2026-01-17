import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Trophy, Users, Wallet, Settings, 
  Plus, Search, CheckCircle, XCircle,
  Eye, Edit, BarChart3, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("tournaments");

  const stats = [
    { label: "إجمالي اللاعبين", value: "524", icon: Users, color: "primary" },
    { label: "البطولات النشطة", value: "3", icon: Trophy, color: "secondary" },
    { label: "الفرق المسجلة", value: "48", icon: Shield, color: "gold" },
    { label: "المدفوعات المعلقة", value: "12", icon: Wallet, color: "warning" },
  ];

  const pendingPayments = [
    { id: 1, player: "Ahmed_Pro", team: "فريق النسور", amount: 150, date: "2026-01-12" },
    { id: 2, player: "Sara_X", team: "أساطير الشرق", amount: 150, date: "2026-01-12" },
    { id: 3, player: "Mohamed_99", team: "صقور العرب", amount: 150, date: "2026-01-11" },
  ];

  const tournaments = [
    { id: 1, name: "بطولة الأبطال الشتوية", teams: 12, status: "open", date: "25 يناير" },
    { id: 2, name: "كأس المحترفين", teams: 16, status: "full", date: "1 فبراير" },
    { id: 3, name: "دوري الأساطير", teams: 32, status: "live", date: "جارية" },
  ];

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-gaming text-3xl font-bold">
                <span className="text-primary text-glow-cyan">لوحة الإدارة</span>
              </h1>
              <p className="text-muted-foreground">إدارة البطولات والفرق والمدفوعات</p>
            </div>
            <Button variant="gaming" asChild>
              <Link to="/admin/tournaments/create">
                <Plus className="w-4 h-4 ml-2" />
                بطولة جديدة
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="rounded-2xl bg-card border border-border/50 p-6 card-glow">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    stat.color === "primary" && "bg-primary/20",
                    stat.color === "secondary" && "bg-secondary/20",
                    stat.color === "gold" && "bg-gold/20",
                    stat.color === "warning" && "bg-warning/20"
                  )}>
                    <stat.icon className={cn(
                      "w-6 h-6",
                      stat.color === "primary" && "text-primary",
                      stat.color === "secondary" && "text-secondary",
                      stat.color === "gold" && "text-gold",
                      stat.color === "warning" && "text-warning"
                    )} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="font-gaming text-2xl">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { key: "tournaments", label: "البطولات", icon: Trophy },
              { key: "payments", label: "المدفوعات", icon: Wallet },
              { key: "teams", label: "الفرق", icon: Users },
              { key: "players", label: "اللاعبين", icon: Users },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "outline"}
                onClick={() => setActiveTab(tab.key)}
                className="flex-shrink-0"
              >
                <tab.icon className="w-4 h-4 ml-2" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Content */}
          <div className="rounded-2xl bg-card border border-border/50 p-6">
            {activeTab === "tournaments" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-lg">إدارة البطولات</h2>
                  <div className="relative w-64">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="بحث..." className="pr-10" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">البطولة</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">الفرق</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">التاريخ</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">الحالة</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tournaments.map((t) => (
                        <tr key={t.id} className="border-b border-border/50">
                          <td className="py-4 px-4 font-medium">{t.name}</td>
                          <td className="py-4 px-4">{t.teams} فريق</td>
                          <td className="py-4 px-4">{t.date}</td>
                          <td className="py-4 px-4">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-xs",
                              t.status === "open" && "badge-open",
                              t.status === "full" && "badge-full",
                              t.status === "live" && "badge-live"
                            )}>
                              {t.status === "open" ? "مفتوحة" : t.status === "full" ? "مكتملة" : "جارية"}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-lg">المدفوعات المعلقة</h2>
                </div>
                <div className="space-y-4">
                  {pendingPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                          <p className="font-medium">{payment.player}</p>
                          <p className="text-sm text-muted-foreground">{payment.team}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-gaming text-primary">{payment.amount} جنيه</p>
                        <p className="text-xs text-muted-foreground">{payment.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="text-success hover:text-success">
                          <CheckCircle className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <XCircle className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === "teams" || activeTab === "players") && (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">قريباً...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
