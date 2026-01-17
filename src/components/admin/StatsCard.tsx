import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "primary" | "gold" | "success" | "warning" | "destructive";
}

const StatsCard = ({ label, value, icon: Icon, trend, color = "primary" }: StatsCardProps) => {
  const colorClasses = {
    primary: "bg-primary/20 text-primary",
    gold: "bg-gold/20 text-gold",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    destructive: "bg-destructive/20 text-destructive",
  };

  return (
    <div className="gaming-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={cn(
            "text-sm font-medium px-2 py-1 rounded-lg",
            trend.isPositive ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
          )}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="font-gaming text-3xl font-bold">{value}</p>
    </div>
  );
};

export default StatsCard;
