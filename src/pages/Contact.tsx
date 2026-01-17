import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Send, MapPin } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact:", formData);
    toast.success("تم إرسال رسالتك بنجاح! سنرد عليك قريباً.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="font-gaming text-4xl md:text-5xl font-bold mb-4">
              <span className="text-primary text-glow-cyan">تواصل معنا</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              لديك سؤال أو استفسار؟ نحن هنا لمساعدتك
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="rounded-2xl bg-card border border-border/50 p-6 md:p-8">
              <h2 className="font-bold text-xl mb-6">أرسل لنا رسالة</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="اسمك الكامل"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">الموضوع</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="موضوع رسالتك"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">الرسالة</Label>
                  <Textarea
                    id="message"
                    placeholder="اكتب رسالتك هنا..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" variant="gaming" size="lg" className="w-full">
                  <Send className="w-5 h-5 ml-2" />
                  إرسال الرسالة
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <h2 className="font-bold text-xl mb-6">معلومات التواصل</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">البريد الإلكتروني</h3>
                      <a href="mailto:contact@wrarena.com" className="text-muted-foreground hover:text-primary transition-colors">
                        contact@wrarena.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Discord</h3>
                      <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        WR Arena Server
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">الموقع</h3>
                      <p className="text-muted-foreground">
                        مصر - الوطن العربي
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 p-6">
                <h3 className="font-bold mb-3">ساعات العمل</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  فريق الدعم متاح للرد على استفساراتكم
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">السبت - الخميس</span>
                    <span>10:00 ص - 10:00 م</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الجمعة</span>
                    <span>2:00 م - 10:00 م</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
