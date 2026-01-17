import { cn } from "@/lib/utils";
import { User, Calendar, Wallet, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Payment {
  id: string;
  playerName: string;
  teamName: string;
  amount: number;
  date: string;
  status: "pending" | "approved" | "rejected";
  screenshotUrl?: string;
  paymentMethod: string;
}

interface PaymentCardProps {
  payment: Payment;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const PaymentCard = ({ payment, onApprove, onReject }: PaymentCardProps) => {
  const statusConfig = {
    pending: { label: "قيد المراجعة", className: "badge-pending", icon: Clock },
    approved: { label: "معتمد", className: "badge-approved", icon: CheckCircle },
    rejected: { label: "مرفوض", className: "badge-rejected", icon: XCircle },
  };
  
  const status = statusConfig[payment.status];
  const StatusIcon = status.icon;

  return (
    <div className="gaming-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-bold">{payment.playerName}</h4>
            <p className="text-sm text-muted-foreground">{payment.teamName}</p>
          </div>
        </div>
        <span className={cn("px-3 py-1 rounded-full text-xs flex items-center gap-1.5", status.className)}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
        <div className="text-center">
          <Wallet className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">المبلغ</p>
          <p className="font-gaming text-primary">{payment.amount} ج.م</p>
        </div>
        <div className="text-center">
          <Calendar className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">التاريخ</p>
          <p className="text-sm">{payment.date}</p>
        </div>
        <div className="text-center">
          <Wallet className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">الطريقة</p>
          <p className="text-sm">{payment.paymentMethod}</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="w-4 h-4 ml-2" />
              عرض الإيصال
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>إيصال الدفع</DialogTitle>
              <DialogDescription>صورة الإيصال المرفوعة للمراجعة</DialogDescription>
            </DialogHeader>
            <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
              {payment.screenshotUrl ? (
                <img 
                  src={payment.screenshotUrl} 
                  alt="إيصال الدفع" 
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <p className="text-muted-foreground">لا يوجد إيصال</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        {payment.status === "pending" && (
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-success hover:text-success hover:bg-success/10"
              onClick={() => onApprove?.(payment.id)}
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onReject?.(payment.id)}
            >
              <XCircle className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCard;
