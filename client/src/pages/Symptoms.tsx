import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Activity, Plus, AlertCircle, ChevronLeft, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { useAppContext } from '@/contexts/AppContext';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

export default function Symptoms() {
  const { t, language } = useLanguage();
  const { selectedChild } = useAppContext();
  const [, setLocation] = useLocation();
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [severity, setSeverity] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isAr = language === 'ar';
  const isFr = language === 'fr';

  const COMMON_SYMPTOMS = [
    { key: 'rash', emoji: '🔴', gradient: 'linear-gradient(135deg, #FFCDD2, #EF9A9A)', border: '#FFCDD2' },
    { key: 'itching', emoji: '🤔', gradient: 'linear-gradient(135deg, #FFF9C4, #FFF176)', border: '#FFF9C4' },
    { key: 'swelling', emoji: '💧', gradient: 'linear-gradient(135deg, #B3E5FC, #81D4FA)', border: '#B3E5FC' },
    { key: 'cough', emoji: '😷', gradient: 'linear-gradient(135deg, #C8E6C9, #A5D6A7)', border: '#C8E6C9' },
    { key: 'vomiting', emoji: '🤢', gradient: 'linear-gradient(135deg, #DCEDC8, #C5E1A5)', border: '#DCEDC8' },
    { key: 'diarrhea', emoji: '💩', gradient: 'linear-gradient(135deg, #FFE0B2, #FFCC80)', border: '#FFE0B2' },
    { key: 'fever', emoji: '🌡️', gradient: 'linear-gradient(135deg, #FFCCBC, #FFAB91)', border: '#FFCCBC' },
    { key: 'lethargy', emoji: '😴', gradient: 'linear-gradient(135deg, #E1BEE7, #CE93D8)', border: '#E1BEE7' },
  ];

  const severityColor = severity <= 3 ? '#43A047' : severity <= 6 ? '#FB8C00' : '#E53935';
  const severityLabel = severity <= 3
    ? (isAr ? 'خفيف' : isFr ? 'Léger' : 'Mild')
    : severity <= 6
    ? (isAr ? 'متوسط' : isFr ? 'Modéré' : 'Moderate')
    : (isAr ? 'شديد' : isFr ? 'Sévère' : 'Severe');

  const createSymptom = trpc.symptoms?.create?.useMutation?.({
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedSymptom(null);
        setSeverity(5);
        setNotes('');
      }, 2000);
    },
    onError: () => {
      toast.error(isAr ? 'خطأ في الحفظ' : isFr ? 'Erreur lors de la sauvegarde' : 'Error saving');
    },
  });

  const handleSubmit = () => {
    if (!selectedSymptom) return;
    if (createSymptom) {
      createSymptom.mutate({
        childId: selectedChild?.id ?? 0,
        symptomType: selectedSymptom,
        severity,
        notes: notes || undefined,
      });
    } else {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedSymptom(null);
        setSeverity(5);
        setNotes('');
      }, 2000);
    }
  };

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#F9FAFB', fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}
    >
      {/* Header */}
      <div
        className="relative overflow-hidden px-4 pt-10 pb-7"
        style={{
          background: 'linear-gradient(135deg, #F48FB1 0%, #E91E8C 60%, #F06292 100%)',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          boxShadow: '0 8px 32px rgba(244,143,177,0.4)',
        }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15 pointer-events-none" style={{ background: 'white', transform: 'translate(40%, -40%)' }} />
        <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full opacity-10 pointer-events-none" style={{ background: 'white', transform: 'translate(-30%, 40%)' }} />

        <div className="relative z-10 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setLocation('/')}
              className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm"
            >
              {isAr ? <ChevronRight size={20} color="white" /> : <ChevronLeft size={20} color="white" />}
            </button>
            <div className="w-9 h-9" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              <Activity size={26} color="white" />
            </div>
            <div>
              <h1 className="text-white text-xl font-extrabold leading-tight">{t('symptomTracker')}</h1>
              <p className="text-white/75 text-xs mt-0.5">
                {isAr ? 'سجل أعراض طفلك' : isFr ? 'Enregistrez les symptômes' : 'Record symptoms'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">

        {/* Correlation info */}
        <div
          className="flex items-start gap-3 p-4 rounded-3xl"
          style={{ background: '#FFF8E1', border: '1.5px solid #FFE082' }}
        >
          <div className="w-9 h-9 rounded-2xl bg-amber-400 flex items-center justify-center flex-shrink-0" style={{ boxShadow: '0 4px 12px rgba(251,191,36,0.4)' }}>
            <AlertCircle size={18} color="white" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-800">
              {isAr ? 'ارتباط تلقائي' : isFr ? 'Corrélation automatique' : 'Auto Correlation'}
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              {isAr ? 'سنربط الأعراض بالوجبات للحصول على تحليلات ذكية' : isFr ? 'Nous corrèlerons les symptômes avec les repas pour des analyses' : "We'll correlate symptoms with meals for AI insights"}
            </p>
          </div>
        </div>

        {/* Symptom Selection */}
        <div
          className="p-5 rounded-3xl bg-white"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
        >
          <p className="text-sm font-extrabold text-gray-800 mb-4">
            {isAr ? 'اختر العرض' : isFr ? 'Sélectionner le symptôme' : 'Select symptom'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {COMMON_SYMPTOMS.map((symptom) => {
              const isSelected = selectedSymptom === symptom.key;
              return (
                <button
                  key={symptom.key}
                  onClick={() => setSelectedSymptom(isSelected ? null : symptom.key)}
                  className="flex items-center gap-3 p-3.5 rounded-2xl transition-all active:scale-95"
                  style={{
                    background: isSelected ? symptom.gradient : 'white',
                    border: `2px solid ${isSelected ? symptom.border : '#F1F5F9'}`,
                    boxShadow: isSelected ? '0 4px 16px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <span style={{ fontSize: 26 }}>{symptom.emoji}</span>
                  <span className="text-xs font-bold text-gray-700 text-start leading-tight">{t(symptom.key as any)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Severity Slider */}
        {selectedSymptom && (
          <div
            className="p-5 rounded-3xl bg-white space-y-4"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-extrabold text-gray-800">{t('severity')}</p>
              <div
                className="flex items-center gap-2 px-3 py-1 rounded-full text-white text-xs font-bold"
                style={{ background: severityColor, boxShadow: `0 4px 12px ${severityColor}66` }}
              >
                <span>{severity}/10</span>
                <span>— {severityLabel}</span>
              </div>
            </div>

            <Slider
              value={[severity]}
              onValueChange={(v) => setSeverity(v[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />

            <div className="flex justify-between text-[10px] font-semibold" style={{ color: '#9CA3AF' }}>
              <span style={{ color: '#43A047' }}>● {isAr ? 'خفيف' : isFr ? 'Léger' : 'Low'}</span>
              <span style={{ color: '#FB8C00' }}>● {isAr ? 'متوسط' : isFr ? 'Modéré' : 'Medium'}</span>
              <span style={{ color: '#E53935' }}>● {isAr ? 'شديد' : isFr ? 'Sévère' : 'High'}</span>
            </div>
          </div>
        )}

        {/* Notes */}
        {selectedSymptom && (
          <div
            className="p-5 rounded-3xl bg-white"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}
          >
            <p className="text-sm font-extrabold text-gray-800 mb-3">{t('notes')}</p>
            <textarea
              placeholder={t('notesPlaceholder')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none outline-none"
              style={{
                background: '#F9FAFB',
                border: '1.5px solid #E5E7EB',
                borderRadius: '16px',
                padding: '12px 14px',
                fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif",
              }}
            />
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
              <Clock size={12} />
              <span>{new Date().toLocaleTimeString(isFr ? 'fr-FR' : isAr ? 'ar-DZ' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          disabled={!selectedSymptom}
          onClick={handleSubmit}
          className="w-full h-14 text-white font-extrabold text-base rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: submitted
              ? 'linear-gradient(135deg, #66BB6A, #43A047)'
              : 'linear-gradient(135deg, #F48FB1, #E91E8C)',
            boxShadow: submitted
              ? '0 8px 24px rgba(102,187,106,0.45)'
              : '0 8px 24px rgba(244,143,177,0.45)',
          }}
        >
          {submitted ? (
            <>
              <CheckCircle2 size={22} />
              {isAr ? 'تم الحفظ!' : isFr ? 'Enregistré !' : 'Saved!'}
            </>
          ) : (
            <>
              <Plus size={22} />
              {t('addSymptom')}
            </>
          )}
        </button>

        {/* Disclaimer */}
        <div
          className="flex items-start gap-2 px-4 py-3 rounded-2xl"
          style={{ background: '#FFFDE7', border: '1px solid #FFF176' }}
        >
          <span className="text-amber-500 text-sm flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
            {isAr
              ? 'هذا التطبيق أداة مساعدة وليس بديلاً عن الاستشارة الطبية.'
              : isFr
              ? "Cette application est une aide, pas un remplacement d'un avis médical."
              : 'This app is a health aid, not a replacement for medical advice.'}
          </p>
        </div>
      </div>
    </div>
  );
}
