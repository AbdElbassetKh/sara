const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppContext } from '@/contexts/AppContext';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import {
  ChevronLeft, CheckCircle2, XCircle, Sun, AlertCircle,
  Calendar, TrendingUp, Smile, Frown
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useState } from 'react';

export default function DailyCheckin() {
  const { t, language } = useLanguage();
  const { selectedChild } = useAppContext();
  const [, setLocation] = useLocation();
  const [hasSymptoms, setHasSymptoms] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const childId = selectedChild?.id ?? 0;

  const { data: todayCheckin, refetch } = trpc.premium.getTodayCheckin.useQuery(
    { childId },
    { enabled: childId > 0 }
  );

  const { data: history } = trpc.premium.getCheckinHistory.useQuery(
    { childId, days: 30 },
    { enabled: childId > 0 }
  );

  const submitMutation = trpc.premium.submitCheckin.useMutation({
    onSuccess: (data) => {
      if (data.alreadyCheckedIn) {
        toast.info(
          language === 'fr' ? 'Vous avez déjà fait votre bilan aujourd\'hui' :
          language === 'ar' ? 'لقد أكملت تسجيل الحضور اليوم بالفعل' :
          'You already checked in today'
        );
      } else {
        toast.success(
          language === 'fr' ? 'Bilan quotidien enregistré ✅' :
          language === 'ar' ? 'تم تسجيل الحضور اليومي ✅' :
          'Daily check-in saved ✅'
        );
      }
      setSubmitted(true);
      refetch();
    },
    onError: () => {
      toast.error(language === 'fr' ? 'Erreur lors de l\'enregistrement' : language === 'ar' ? 'خطأ في الحفظ' : 'Error saving');
    }
  });

  const handleSubmit = () => {
    if (hasSymptoms === null) {
      toast.error(
        language === 'fr' ? 'Veuillez sélectionner une option' :
        language === 'ar' ? 'يرجى اختيار خيار' :
        'Please select an option'
      );
      return;
    }
    submitMutation.mutate({ childId, hasSymptoms, notes });
  };

  // Calculate streak (consecutive days without symptoms)
  const streak = history
    ? (() => {
        let count = 0;
        const sorted = [...history].sort((a, b) => new Date(b.checkinDate).getTime() - new Date(a.checkinDate).getTime());
        for (const c of sorted) {
          if (c.hasSymptoms === 0) count++;
          else break;
        }
        return count;
      })()
    : 0;

  const alreadyCheckedIn = !!todayCheckin || submitted;

  return (
    <div className="min-h-screen bg-background pb-24" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setLocation('/')} className="p-2 rounded-full hover:bg-muted transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <Sun className="w-6 h-6 text-yellow-500" />
        <h1 className="text-lg font-bold text-foreground">
          {language === 'fr' ? 'Bilan quotidien' : language === 'ar' ? 'التسجيل اليومي' : 'Daily Check-in'}
        </h1>
      </div>

      <div className="px-4 pt-6 space-y-6">
        {/* Streak Card */}
        <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-md">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black text-green-700">{streak}</p>
              <p className="text-sm font-medium text-green-600">
                {language === 'fr' ? 'jours sans symptômes' :
                 language === 'ar' ? 'أيام بدون أعراض' :
                 'days without symptoms'}
              </p>
              {streak > 0 && (
                <p className="text-xs text-green-500 mt-0.5">
                  {language === 'fr' ? '🎉 Continuez comme ça !' :
                   language === 'ar' ? '🎉 استمر هكذا!' :
                   '🎉 Keep it up!'}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Today's Check-in */}
        {alreadyCheckedIn ? (
          <Card className="p-5 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold text-foreground">
              {language === 'fr' ? 'Bilan du jour complété !' :
               language === 'ar' ? 'تم إكمال تسجيل اليوم!' :
               "Today's check-in done!"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {todayCheckin?.hasSymptoms === 1
                ? (language === 'fr' ? '⚠️ Symptômes signalés aujourd\'hui' :
                   language === 'ar' ? '⚠️ تم الإبلاغ عن أعراض اليوم' :
                   '⚠️ Symptoms reported today')
                : (language === 'fr' ? '✅ Aucun symptôme aujourd\'hui' :
                   language === 'ar' ? '✅ لا توجد أعراض اليوم' :
                   '✅ No symptoms today')}
            </p>
            <Button variant="outline" onClick={() => setLocation('/')} className="mt-2">
              {language === 'fr' ? 'Retour au tableau de bord' :
               language === 'ar' ? 'العودة إلى لوحة التحكم' :
               'Back to Dashboard'}
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">
                {language === 'fr' ? `Comment va ${selectedChild?.name ?? 'votre enfant'} aujourd'hui ?` :
                 language === 'ar' ? `كيف حال ${selectedChild?.name ?? 'طفلك'} اليوم؟` :
                 `How is ${selectedChild?.name ?? 'your child'} today?`}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'ar' ? 'ar-DZ' : 'en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>

            {/* Yes/No Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setHasSymptoms(false)}
                className={`p-5 rounded-2xl border-2 transition-all space-y-2 ${
                  hasSymptoms === false
                    ? 'border-green-500 bg-green-50 shadow-md scale-[1.02]'
                    : 'border-border bg-card hover:border-green-300'
                }`}
              >
                <Smile className={`w-10 h-10 mx-auto ${hasSymptoms === false ? 'text-green-500' : 'text-muted-foreground'}`} />
                <p className={`text-sm font-semibold ${hasSymptoms === false ? 'text-green-700' : 'text-foreground'}`}>
                  {language === 'fr' ? 'Tout va bien' : language === 'ar' ? 'كل شيء بخير' : 'All good'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'fr' ? 'Pas de symptômes' : language === 'ar' ? 'لا توجد أعراض' : 'No symptoms'}
                </p>
              </button>

              <button
                onClick={() => setHasSymptoms(true)}
                className={`p-5 rounded-2xl border-2 transition-all space-y-2 ${
                  hasSymptoms === true
                    ? 'border-orange-500 bg-orange-50 shadow-md scale-[1.02]'
                    : 'border-border bg-card hover:border-orange-300'
                }`}
              >
                <Frown className={`w-10 h-10 mx-auto ${hasSymptoms === true ? 'text-orange-500' : 'text-muted-foreground'}`} />
                <p className={`text-sm font-semibold ${hasSymptoms === true ? 'text-orange-700' : 'text-foreground'}`}>
                  {language === 'fr' ? 'Symptômes' : language === 'ar' ? 'توجد أعراض' : 'Has symptoms'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'fr' ? 'Quelque chose à signaler' : language === 'ar' ? 'شيء ما للإبلاغ عنه' : 'Something to report'}
                </p>
              </button>
            </div>

            {/* Notes */}
            {hasSymptoms !== null && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {language === 'fr' ? 'Notes (optionnel)' : language === 'ar' ? 'ملاحظات (اختياري)' : 'Notes (optional)'}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    language === 'fr' ? 'Décrivez les symptômes ou observations...' :
                    language === 'ar' ? 'صف الأعراض أو الملاحظات...' :
                    'Describe symptoms or observations...'
                  }
                  className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  rows={3}
                />
              </div>
            )}

            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={handleSubmit}
              disabled={hasSymptoms === null || submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  {language === 'fr' ? 'Enregistrement...' : language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                </div>
              ) : (
                language === 'fr' ? 'Enregistrer le bilan' : language === 'ar' ? 'حفظ التسجيل' : 'Save Check-in'
              )}
            </Button>
          </div>
        )}

        {/* History */}
        {history && history.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              {language === 'fr' ? 'Historique (30 jours)' : language === 'ar' ? 'السجل (30 يومًا)' : 'History (30 days)'}
            </h3>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 30 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (29 - i));
                const dateStr = date.toISOString().split('T')[0];
                const checkin = history.find(h => {
                  const d = new Date(h.checkinDate);
                  return d.toISOString().split('T')[0] === dateStr;
                });
                return (
                  <div
                    key={i}
                    title={dateStr}
                    className={`aspect-square rounded-md ${
                      !checkin ? 'bg-muted/50' :
                      checkin.hasSymptoms === 0 ? 'bg-green-400' : 'bg-orange-400'
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-green-400" />
                <span>{language === 'fr' ? 'Sans symptômes' : language === 'ar' ? 'بدون أعراض' : 'No symptoms'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-orange-400" />
                <span>{language === 'fr' ? 'Avec symptômes' : language === 'ar' ? 'مع أعراض' : 'With symptoms'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-muted/50" />
                <span>{language === 'fr' ? 'Non renseigné' : language === 'ar' ? 'غير مسجل' : 'Not logged'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
