const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import {
  ChevronLeft, Bell, BellOff, Syringe, Pill, Stethoscope,
  AlertTriangle, CheckCircle2, Clock, Trash2, BellRing, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

type NotificationType = 'vaccine_reminder' | 'medication_reminder' | 'appointment_reminder' | 'symptom_alert' | 'allergen_alert' | 'other';

export default function Notifications() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<'all' | NotificationType>('all');

  const t = (fr: string, ar: string, en: string) =>
    language === 'fr' ? fr : language === 'ar' ? ar : en;

  const utils = trpc.useUtils();
  const { data: notifList = [], isLoading } = trpc.notifications.list.useQuery({ });
  const { data: unreadCount = 0 } = trpc.notifications.unreadCount.useQuery();

  const markReadMutation = trpc.notifications.markRead.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
      utils.notifications.unreadCount.invalidate();
    },
  });

  const markAllReadMutation = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
      utils.notifications.unreadCount.invalidate();
      toast.success(t('Tout marqué comme lu', 'تم تحديد الكل كمقروء', 'All marked as read'));
    },
  });

  const deleteMutation = trpc.notifications.delete.useMutation({
    onSuccess: () => {
      utils.notifications.list.invalidate();
      utils.notifications.unreadCount.invalidate();
      toast.success(t('Notification supprimée', 'تم حذف الإشعار', 'Notification deleted'));
    },
  });

  const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
    vaccine_reminder: { icon: Syringe, color: 'text-blue-600', bg: 'bg-blue-50', label: t('Vaccins', 'التطعيمات', 'Vaccines') },
    medication_reminder: { icon: Pill, color: 'text-purple-600', bg: 'bg-purple-50', label: t('Médicaments', 'الأدوية', 'Medications') },
    appointment_reminder: { icon: Stethoscope, color: 'text-green-600', bg: 'bg-green-50', label: t('Rendez-vous', 'المواعيد', 'Appointments') },
    symptom_alert: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', label: t('Symptômes', 'الأعراض', 'Symptoms') },
    allergen_alert: { icon: BellRing, color: 'text-red-600', bg: 'bg-red-50', label: t('Allergènes', 'مسببات الحساسية', 'Allergens') },
    other: { icon: Bell, color: 'text-gray-600', bg: 'bg-gray-50', label: t('Autre', 'أخرى', 'Other') },
  };

  const filters: Array<{ id: 'all' | NotificationType; label: string }> = [
    { id: 'all', label: t('Tout', 'الكل', 'All') },
    { id: 'vaccine_reminder', label: t('Vaccins', 'التطعيمات', 'Vaccines') },
    { id: 'medication_reminder', label: t('Médicaments', 'الأدوية', 'Meds') },
    { id: 'appointment_reminder', label: t('RDV', 'المواعيد', 'Appts') },
    { id: 'symptom_alert', label: t('Symptômes', 'الأعراض', 'Symptoms') },
    { id: 'allergen_alert', label: t('Allergènes', 'الحساسية', 'Allergens') },
  ];

  const filtered = filter === 'all' ? notifList : notifList.filter(n => n.type === filter);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 1) return t(`Il y a ${days} jours`, `منذ ${days} أيام`, `${days} days ago`);
    if (days === 1) return t('Hier', 'أمس', 'Yesterday');
    if (hours > 0) return t(`Il y a ${hours}h`, `منذ ${hours} ساعة`, `${hours}h ago`);
    return t('À l\'instant', 'الآن', 'Just now');
  };

  return (
    <div className="min-h-screen bg-background pb-24" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button onClick={() => setLocation('/')} className="p-2 rounded-full hover:bg-muted transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <Bell className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground flex-1">
            {t('Notifications', 'الإشعارات', 'Notifications')}
          </h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          {unreadCount > 0 && (
            <button
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              className="text-xs text-primary font-medium"
            >
              {t('Tout lire', 'قراءة الكل', 'Mark all')}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === f.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <BellOff className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              {t('Aucune notification', 'لا توجد إشعارات', 'No notifications')}
            </p>
            <p className="text-muted-foreground text-xs text-center max-w-xs">
              {t(
                'Les rappels de vaccins, médicaments et alertes IA apparaîtront ici.',
                'ستظهر هنا تذكيرات اللقاحات والأدوية وتنبيهات الذكاء الاصطناعي.',
                'Vaccine reminders, medication alerts and AI alerts will appear here.'
              )}
            </p>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && filtered.length > 0 && (
          <div className="space-y-2">
            {filtered.map(notif => {
              const config = typeConfig[notif.type as NotificationType] ?? typeConfig.other;
              const Icon = config.icon;
              const isUnread = notif.isRead === 0;
              const isUrgent = notif.type === 'allergen_alert' || notif.type === 'symptom_alert';
              return (
                <Card
                  key={notif.id}
                  className={`p-4 transition-all cursor-pointer ${
                    isUnread ? 'border-primary/30 bg-primary/3' : ''
                  } ${isUrgent ? 'border-red-300' : ''}`}
                  onClick={() => isUnread && markReadMutation.mutate({ id: notif.id })}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold leading-tight ${isUrgent ? 'text-red-700' : 'text-foreground'}`}>
                          {notif.title}
                        </p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {isUnread && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMutation.mutate({ id: notif.id });
                            }}
                            className="p-1 rounded-full hover:bg-muted transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                      {notif.content && (
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{notif.content}</p>
                      )}
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">{formatTime(notif.createdAt)}</span>
                        {!isUnread && (
                          <CheckCircle2 className="w-3 h-3 text-green-500 ml-1" />
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Notification Settings Shortcut */}
        <Card className="p-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {t('Gérer les notifications', 'إدارة الإشعارات', 'Manage Notifications')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('Paramètres de rappels et alertes', 'إعدادات التذكيرات والتنبيهات', 'Reminder and alert settings')}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setLocation('/settings')}>
              {t('Gérer', 'إدارة', 'Manage')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
