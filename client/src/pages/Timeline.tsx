import { useState } from 'react';
import { Apple, AlertCircle, Stethoscope, Trash2, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppContext } from '@/contexts/AppContext';
import { trpc } from '@/lib/trpc';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type FilterType = 'all' | 'meal' | 'symptom' | 'doctor';

export default function Timeline() {
  const { language } = useLanguage();
  const { selectedChild } = useAppContext();
  const isAr = language === 'ar';
  const isFr = language === 'fr';

  const [filter, setFilter] = useState<FilterType>('all');
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; type: 'meal' | 'symptom' | 'doctor'; title: string } | null>(null);

  const childId = selectedChild?.id ?? 0;

  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: entries, isLoading, isError, refetch } = trpc.timeline.getEntries.useQuery(
    { childId, filter, limit: 100 },
    { enabled: childId > 0, retry: false }
  );

  const utils = trpc.useUtils();
  const deleteMutation = trpc.timeline.deleteEntry.useMutation({
    onSuccess: () => {
      utils.timeline.getEntries.invalidate({ childId });
      utils.dashboard.getRecentActivity.invalidate({ childId });
      utils.dashboard.getStats.invalidate({ childId });
      setDeleteTarget(null);
      setDeleteError(null);
    },
    onError: (err) => {
      setDeleteError(err.message || (isAr ? 'فشل الحذف' : isFr ? 'Échec de la suppression' : 'Deletion failed'));
    },
  });

  const filters: { key: FilterType; emoji: string; label: string }[] = [
    { key: 'all',     emoji: '📋', label: isAr ? 'الكل'    : isFr ? 'Tout'      : 'All' },
    { key: 'meal',    emoji: '🍎', label: isAr ? 'وجبات'   : isFr ? 'Repas'     : 'Meals' },
    { key: 'symptom', emoji: '🔴', label: isAr ? 'أعراض'   : isFr ? 'Symptômes' : 'Symptoms' },
    { key: 'doctor',  emoji: '👨‍⚕️', label: isAr ? 'طبيب'    : isFr ? 'Médecin'   : 'Doctor' },
  ];

  const getEntryConfig = (type: 'meal' | 'symptom' | 'doctor') => {
    if (type === 'meal')    return { Icon: Apple,        gradient: 'linear-gradient(135deg, #B3E5FC, #4FC3F7)', iconColor: '#0288D1' };
    if (type === 'symptom') return { Icon: AlertCircle,  gradient: 'linear-gradient(135deg, #F8BBD0, #F48FB1)', iconColor: '#E91E8C' };
    return                         { Icon: Stethoscope,  gradient: 'linear-gradient(135deg, #C8E6C9, #66BB6A)', iconColor: '#2E7D32' };
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const locale = isAr ? 'ar-DZ' : isFr ? 'fr-FR' : 'en-US';
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    const timeStr = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    if (isSameDay(d, today)) {
      return `${isAr ? 'اليوم' : isFr ? "Aujourd'hui" : 'Today'} ${timeStr}`;
    }
    if (isSameDay(d, yesterday)) {
      return `${isAr ? 'أمس' : isFr ? 'Hier' : 'Yesterday'} ${timeStr}`;
    }
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'short' }) + ' ' + timeStr;
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: '#F9FAFB', fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}>

      {/* ── Header ── */}
      <div
        className="relative overflow-hidden px-4 pt-10 pb-6"
        style={{
          background: 'linear-gradient(135deg, #CE93D8 0%, #8E24AA 100%)',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          boxShadow: '0 8px 32px rgba(142,36,170,0.3)',
        }}
      >
        <div className="absolute top-0 right-0 w-36 h-36 rounded-full opacity-15 pointer-events-none" style={{ background: 'white', transform: 'translate(40%,-40%)' }} />
        <div className="relative z-10 max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-white">
            {isAr ? 'السجل الزمني' : isFr ? 'Chronologie' : 'Timeline'}
          </h1>
          <button
            onClick={() => refetch()}
            className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center"
            title={isAr ? 'تحديث' : isFr ? 'Actualiser' : 'Refresh'}
          >
            <RefreshCw className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">

        {/* ── Filter chips ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all"
              style={
                filter === f.key
                  ? { background: 'linear-gradient(135deg, #CE93D8, #8E24AA)', color: 'white', boxShadow: '0 4px 12px rgba(142,36,170,0.35)' }
                  : { background: 'white', color: '#6B7280', border: '1.5px solid #E5E7EB' }
              }
            >
              <span>{f.emoji}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* ── No child selected ── */}
        {!selectedChild && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-gray-400 text-sm">
              {isAr ? 'الرجاء اختيار طفل أولاً' : isFr ? 'Veuillez sélectionner un enfant' : 'Please select a child first'}
            </p>
          </div>
        )}

        {/* ── Error state ── */}
        {selectedChild && isError && (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
            <p className="text-red-500 text-sm font-semibold">
              {isAr ? 'حدث خطأ أثناء تحميل البيانات' : isFr ? 'Erreur lors du chargement des données' : 'Error loading data'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 rounded-full text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #CE93D8, #8E24AA)' }}
            >
              {isAr ? 'إعادة المحاولة' : isFr ? 'Réessayer' : 'Retry'}
            </button>
          </div>
        )}

        {/* ── Loading ── */}
        {selectedChild && isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-3xl bg-white animate-pulse" style={{ border: '1px solid #F1F5F9' }} />
            ))}
          </div>
        )}

        {/* ── Entries ── */}
        {selectedChild && !isLoading && entries && entries.length > 0 && (
          <div className="space-y-3">
            {entries.map((entry, idx) => {
              const { Icon, gradient } = getEntryConfig(entry.type);
              const isLast = idx === entries.length - 1;
              return (
                <div key={`${entry.type}-${entry.id}`} className="relative">
                  {!isLast && (
                    <div className="absolute left-[28px] top-16 bottom-0 w-0.5 z-0" style={{ background: '#E5E7EB' }} />
                  )}
                  <div
                    className="relative z-10 flex items-start gap-3 p-4 rounded-3xl bg-white"
                    style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: gradient }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{entry.title}</p>
                      <p className="text-xs text-gray-500 truncate">{entry.detail}</p>
                      {entry.severity !== undefined && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="h-1.5 rounded-full flex-1" style={{ background: '#F1F5F9' }}>
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${entry.severity * 10}%`,
                                background: entry.severity >= 7 ? '#EF4444' : entry.severity >= 4 ? '#F59E0B' : '#22C55E',
                              }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-gray-500">{entry.severity}/10</span>
                        </div>
                      )}
                      <p className="text-[10px] text-gray-400 mt-1">{formatDate(entry.date)}</p>
                    </div>
                    <button
                      onClick={() => setDeleteTarget({ id: entry.id, type: entry.type, title: entry.title })}
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
                      style={{ background: '#FEF2F2' }}
                      title={isAr ? 'حذف' : isFr ? 'Supprimer' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Empty state ── */}
        {selectedChild && !isLoading && entries && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #E1BEE7, #CE93D8)' }}>
              <span className="text-3xl">📋</span>
            </div>
            <p className="text-gray-500 text-sm font-semibold">
              {isAr ? 'لا توجد سجلات بعد' : isFr ? 'Aucune entrée pour le moment' : 'No entries yet'}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {isAr ? 'ابدأ بتسجيل وجبة أو عرض' : isFr ? 'Commencez par enregistrer un repas ou un symptôme' : 'Start by logging a meal or symptom'}
            </p>
          </div>
        )}
      </div>

      {/* ── Delete confirmation dialog ── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isAr ? 'تأكيد الحذف' : isFr ? 'Confirmer la suppression' : 'Confirm deletion'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isAr
                ? `هل أنت متأكد من حذف "${deleteTarget?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : isFr
                ? `Voulez-vous vraiment supprimer "${deleteTarget?.title}" ? Cette action est irréversible.`
                : `Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p className="text-xs text-red-500 px-1 pb-1">{deleteError}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteError(null)}>
              {isAr ? 'إلغاء' : isFr ? 'Annuler' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) {
                  deleteMutation.mutate({ childId, entryId: deleteTarget.id, type: deleteTarget.type });
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleteMutation.isPending
                ? (isAr ? 'جارٍ الحذف...' : isFr ? 'Suppression...' : 'Deleting...')
                : (isAr ? 'حذف' : isFr ? 'Supprimer' : 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
