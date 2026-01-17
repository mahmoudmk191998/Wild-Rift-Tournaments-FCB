import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import PaymentCard from "@/components/admin/PaymentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Wallet, Search, Download,
  CheckCircle, XCircle, Clock, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePayments, useUpdatePaymentStatus } from "@/hooks/usePayments";
import { Skeleton } from "@/components/ui/skeleton";

const AdminPayments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { data: payments, isLoading } = usePayments();
  const updatePaymentStatus = useUpdatePaymentStatus();

  const filteredPayments = payments?.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.profiles?.username?.toLowerCase().includes(q) ||
      p.teams?.name?.toLowerCase().includes(q) ||
      p.user_id?.toLowerCase().includes(q) ||
      p.team_id?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleApprove = (id: string) => {
    updatePaymentStatus.mutate({ id, status: "approved" });
  };

  const handleReject = (id: string) => {
    updatePaymentStatus.mutate({ id, status: "rejected" });
  };

  const stats = [
    { 
      label: "معلق", 
      count: payments?.filter(p => p.status === "pending").length || 0, 
      icon: Clock, 
      color: "warning" 
    },
    { 
      label: "معتمد", 
      count: payments?.filter(p => p.status === "approved").length || 0, 
      icon: CheckCircle, 
      color: "success" 
    },
    { 
      label: "مرفوض", 
      count: payments?.filter(p => p.status === "rejected").length || 0, 
      icon: XCircle, 
      color: "destructive" 
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-gaming text-3xl font-bold">
              <span className="text-primary text-glow-red">إدارة المدفوعات</span>
            </h1>
            <p className="text-muted-foreground">مراجعة واعتماد مدفوعات اللاعبين</p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="gaming-card p-4 flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                stat.color === "warning" && "bg-warning/20",
                stat.color === "success" && "bg-success/20",
                stat.color === "destructive" && "bg-destructive/20"
              )}>
                <stat.icon className={cn(
                  "w-6 h-6",
                  stat.color === "warning" && "text-warning",
                  stat.color === "success" && "text-success",
                  stat.color === "destructive" && "text-destructive"
                )} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="font-gaming text-2xl">{stat.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="gaming-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="بحث عن لاعب أو فريق..." 
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">معلق</SelectItem>
                <SelectItem value="approved">معتمد</SelectItem>
                <SelectItem value="rejected">مرفوض</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Payments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPayments.map((payment) => (
            <PaymentCard 
              key={payment.id} 
              payment={{
                id: payment.id,
                playerName: payment.profiles?.username || payment.user_id,
                teamName: payment.teams?.name || payment.team_id,
                amount: payment.amount,
                date: payment.created_at,
                status: payment.status,
                screenshotUrl: payment.screenshot_url || undefined,
                paymentMethod: payment.payment_method || "InstaPay",
              }}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">لا توجد مدفوعات مطابقة</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
