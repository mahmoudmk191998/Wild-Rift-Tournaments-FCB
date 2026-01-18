import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
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
  Users, Search, Eye, Ban, 
  Shield, Trophy, Star, UserX
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfiles, useBanUser, Profile } from "@/hooks/useProfile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AdminPlayers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [rankFilter, setRankFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const { data: profiles, isLoading } = useProfiles();
  const banUser = useBanUser();

  const filteredPlayers = profiles?.filter(p => {
    const matchesSearch = p.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.riot_id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRank = rankFilter === "all" || p.rank === rankFilter;
    return matchesSearch && matchesRank;
  }) || [];

  const handleToggleBan = (userId: string, isBanned: boolean) => {
    banUser.mutate({ userId, isBanned: !isBanned });
  };

  const handleOpen = (p: Profile) => {
    setSelectedProfile(p);
    setOpen(true);
  };

  const rankColors: Record<string, string> = {
    Iron: "text-gray-400",
    Bronze: "text-amber-700",
    Silver: "text-gray-300",
    Gold: "text-yellow-500",
    Platinum: "text-cyan-400",
    Emerald: "text-emerald-400",
    Diamond: "text-blue-400",
    Master: "text-purple-400",
    Grandmaster: "text-red-400",
    Challenger: "text-gold",
  };

  const columns = [
    {
      key: "username",
      header: "اللاعب",
      render: (p: Profile) => (
        <div className="flex items-center gap-3">
          {p.avatar_url ? (
            <Avatar className={cn("w-10 h-10", p.is_banned ? "bg-destructive/20" : "bg-primary/20")}>
              <AvatarImage src={p.avatar_url} alt={p.username} />
              <AvatarFallback className="font-medium text-sm">
                {p.username?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              p.is_banned ? "bg-destructive/20" : "bg-primary/20"
            )}>
              {p.is_banned ? (
                <UserX className="w-5 h-5 text-destructive" />
              ) : (
                <Users className="w-5 h-5 text-primary" />
              )}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <p className={cn("font-medium", p.is_banned && "line-through text-muted-foreground")}>{p.username}</p>
            </div>
            <p className="text-xs text-muted-foreground">{p.riot_id || "لا يوجد Riot ID"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "rank",
      header: "الرتبة",
      render: (p: Profile) => (
        <span className={cn("font-medium", rankColors[p.rank || ""] || "text-foreground")}>
          {p.rank || "غير محدد"}
        </span>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      render: (p: Profile) => (
        p.is_banned ? (
          <span className="px-3 py-1 rounded-full text-xs badge-rejected">
            محظور
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-xs badge-approved">
            نشط
          </span>
        )
      ),
    },
    {
      key: "joinDate",
      header: "تاريخ الانضمام",
      render: (p: Profile) => (
        <span className="text-sm text-muted-foreground">
          {new Date(p.created_at).toLocaleDateString("ar-EG")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "إجراءات",
      render: (p: Profile) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => handleOpen(p)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleToggleBan(p.user_id, p.is_banned)}
            className={p.is_banned ? "text-success hover:text-success" : "text-destructive hover:text-destructive"}
          >
            {p.is_banned ? <Users className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-96" />
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
              <span className="text-primary text-glow-red">إدارة اللاعبين</span>
            </h1>
            <p className="text-muted-foreground">عرض وإدارة جميع اللاعبين المسجلين</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="gaming-card p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">إجمالي اللاعبين</p>
            <p className="font-gaming text-2xl text-primary">{profiles?.length || 0}</p>
          </div>
          <div className="gaming-card p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">نشطين</p>
            <p className="font-gaming text-2xl text-success">{profiles?.filter(p => !p.is_banned).length || 0}</p>
          </div>
          <div className="gaming-card p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">محظورين</p>
            <p className="font-gaming text-2xl text-destructive">{profiles?.filter(p => p.is_banned).length || 0}</p>
          </div>
          <div className="gaming-card p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Diamond+</p>
            <p className="font-gaming text-2xl text-blue-400">
              {profiles?.filter(p => ["Diamond", "Master", "Grandmaster", "Challenger"].includes(p.rank || "")).length || 0}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="gaming-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="بحث عن لاعب..." 
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={rankFilter} onValueChange={setRankFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="الرتبة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الرتب</SelectItem>
                <SelectItem value="Emerald">Emerald</SelectItem>
                <SelectItem value="Diamond">Diamond</SelectItem>
                <SelectItem value="Master">Master</SelectItem>
                <SelectItem value="Grandmaster">Grandmaster</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="gaming-card">
          <DataTable data={filteredPlayers} columns={columns} />
        </div>

        {/* Player Details Sheet */}
        <Sheet open={open} onOpenChange={(val) => { if (!val) setSelectedProfile(null); setOpen(val); }}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>تفاصيل اللاعب</SheetTitle>
              <SheetDescription>عرض معلومات الملف الشخصي</SheetDescription>
            </SheetHeader>

            <div className="mt-4 space-y-4">
              {selectedProfile ? (
                <div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center overflow-hidden">
                      {selectedProfile.avatar_url ? (
                        <img src={selectedProfile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-lg">{selectedProfile.username}</p>
                      <p className="text-sm text-muted-foreground">{selectedProfile.riot_id || 'لا يوجد Riot ID'}</p>
                      <p className="text-sm text-muted-foreground">{selectedProfile.rank || 'غير محدد'}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">معلومات إضافية</p>
                    <ul className="list-disc list-inside text-sm">
                      <li>معرّف المستخدم: {selectedProfile.user_id}</li>
                      <li>مُنشأ في: {new Date(selectedProfile.created_at).toLocaleString('ar-EG')}</li>
                      <li>آخر تحديث: {new Date(selectedProfile.updated_at).toLocaleString('ar-EG')}</li>
                      <li>محظور: {selectedProfile.is_banned ? 'نعم' : 'لا'}</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">لم يتم اختيار لاعب</p>
              )}
            </div>

            <SheetFooter>
              <div className="flex items-center gap-2">
                {selectedProfile && (
                  <>
                    <Button variant={selectedProfile.is_banned ? 'secondary' : 'destructive'} onClick={() => handleToggleBan(selectedProfile.user_id, selectedProfile.is_banned)}>
                      {selectedProfile.is_banned ? 'إلغاء الحظر' : 'حظر اللاعب'}
                    </Button>
                    <Button variant="outline" onClick={() => { /* future: open edit rank modal */ }}>
                      تعديل الرتبة
                    </Button>
                  </>
                )}
                <SheetClose className="btn">إغلاق</SheetClose>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </AdminLayout>
  );
};

export default AdminPlayers;
