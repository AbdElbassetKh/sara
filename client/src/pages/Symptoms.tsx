import { useState, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Activity, Plus, AlertCircle, ChevronLeft, ChevronRight, Clock, CheckCircle2, Camera, X, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { useAppContext } from '@/contexts/AppContext';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const CATEGORY_COLORS: Record<string, { gradient: string; border: string; bg: string }> = {
  skin:          { gradient: 'linear-gradient(135deg, #FFCDD2, #EF9A9A)', border: '#FFCDD2', bg: '#FFF5F5' },
  digestive:     { gradient: 'linear-gradient(135deg, #DCEDC8, #C5E1A5)', border: '#DCEDC8', bg: '#F5FFF0' },
  respiratory:   { gradient: 'linear-gradient(135deg, #B3E5FC, #81D4FA)', border: '#B3E5FC', bg: '#F0FAFF' },
  neurological:  { gradient: 'linear-gradient(135deg, #E1BEE7, #CE93D8)', border: '#E1BEE7', bg: '#FAF0FF' },
  other:         { gradient: 'linear-gradient(135deg, #FFE0B2, #FFCC80)', border: '#FFE0B2', bg: '#FFFAF0' },
};

export default function Symptoms() {
  const { t, language } = useLanguage();
  const { selectedChild } = useAppContext();
  const [, setLocation] = useLocation();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [occurredAt, setOccurredAt] = useState(() => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now.toISOString().slice(0, 16);
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAr = language === 'ar';
  const isFr = language === 'fr';

  // Load symptom types from DB
  const { data: symptomTypes = [] } = trpc.foodCatalog.listSymptomTypes.useQuery();

  const categories = [
    { key: 'all', label: isAr ? 'الكل' : isFr ? 'Tous' : 'All', icon: '🔍' },
    { key: 'skin', label: isAr ? 'جلد' : isFr ? 'Peau' : 'Skin', icon: '🩹' },
    { key: 'digestive', label: isAr ? 'هضم' : isFr ? 'Digestif' : 'Digestive', icon: '🫃' },
    { key: 'respiratory', label: isAr ? 'تنفس' : isFr ? 'Respiratoire' : 'Respiratory', icon: '🌬️' },
    { key: 'neurological', label: isAr ? 'عصبي' : isFr ? 'Neurologique' : 'Neurological', icon: '🧠' },
    { key: 'other', label: isAr ? 'أخرى' : isFr ? 'Autres' : 'Other', icon: '➕' },
  ];

  const filteredSymptoms = activeCategory === 'all'
    ? symptomTypes
    : symptomTypes.filter((s) => s.category === activeCategory);

  const severityColor = severity <= 3 ? '#43A047' : severity <= 6 ? '#FB8C00' : '#E53935';
  const severityLabel = severity <= 3
    ? (isAr ? 'خفيف' : isFr ? 'Léger' : 'Mild')
    : severity <= 6
    ? (isAr ? 'متوسط' : isFr ? 'Modéré' : 'Moderate')
    : (isAr ? 'شديد' : isFr ? 'Sévère' : 'Severe');

  const uploadPhoto = trpc.children.uploadPhoto.useMutation();
  const createSymptom = trpc.symptoms.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedSymptoms([]);
        setSeverity(5);
        setNotes('');
        setPhotoPreview(null);
        setPhotoFile(null);
      }, 2000);
    },
    onError: () => {
      toast.error(isAr ? 'خطأ في الحفظ' : isFr ? 'Erreur lors de la sauvegarde' : 'Error saving');
    },
  });

  const toggleSymptom = (name: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error(isAr ? 'حجم الصورة يجب أن يكون أقل من 5 ميغابايت' : isFr ? 'La photo doit faire moins de 5 Mo' : 'Photo must be under 5 MB');
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error(isAr ? 'يرجى اختيار عرض واحد على الأقل' : isFr ? 'Veuillez sélectionner au moins un symptôme' : 'Please select at least one symptom');
      return;
    }
    if (!selectedChild) {
      toast.error(isAr ? 'يرجى اختيار طفل أولاً' : isFr ? 'Veuillez sélectionner un enfant' : 'Please select a child first');
      return;
    }

    let photoUrl: string | undefined;
    if (photoFile && photoPreview) {
      setIsUploadingPhoto(true);
      try {
        const base64Data = photoPreview.includes(',') ? photoPreview.split(',')[1] : photoPreview;
        const result = await uploadPhoto.mutateAsync({ childId: selectedChild.id, base64Data });
        photoUrl = result.photoUrl ?? undefined;
      } catch {
        toast.error(isAr ? 'فشل رفع الصورة' : isFr ? "Échec de l'upload photo" : 'Photo upload failed');
      } finally {
        setIsUploadingPhoto(false);
      }
    }

    // Save each selected symptom
    for (const symptomType of selectedSymptoms) {
      createSymptom.mutate({
        childId: selectedChild.id,
        symptomType,
        severity,
        occurredAt: new Date(occurredAt).toISOString(),
        notes: notes || undefined,
        photoUrl,
      });
    }
  };

  const isLoading = createSymptom.isPending || isUploadingPhoto;

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
            <button onClick={() => setLocation('/')} className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
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
        <div className="flex items-start gap-3 p-4 rounded-3xl" style={{ background: '#FFF8E1', border: '1.5px solid #FFE082' }}>
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

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border-2 ${
                activeCategory === cat.key
                  ? 'border-pink-400 bg-pink-50 text-pink-700 shadow-sm'
                  : 'border-gray-100 bg-white text-gray-600'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Symptom Grid */}
        <div className="p-5 rounded-3xl bg-white" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
          <p className="text-sm font-extrabold text-gray-800 mb-4">
            {isAr ? 'اختر الأعراض (يمكن تحديد أكثر من عرض)' : isFr ? 'Sélectionner les symptômes (plusieurs possibles)' : 'Select symptoms (multiple allowed)'}
          </p>
          {filteredSymptoms.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              <p className="text-sm">{isAr ? 'جاري التحميل...' : isFr ? 'Chargement...' : 'Loading...'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredSymptoms.map((symptom) => {
                const name = isAr ? symptom.nameAr : isFr ? symptom.nameFr : symptom.nameEn;
                const isSelected = selectedSymptoms.includes(name);
                const colors = CATEGORY_COLORS[symptom.category ?? 'other'] ?? CATEGORY_COLORS.other;
                return (
                  <button
                    key={symptom.id}
                    onClick={() => toggleSymptom(name)}
                    className="flex items-center gap-3 p-3.5 rounded-2xl transition-all active:scale-95 relative"
                    style={{
                      background: isSelected ? colors.gradient : 'white',
                      border: `2px solid ${isSelected ? colors.border : '#F1F5F9'}`,
                      boxShadow: isSelected ? '0 4px 16px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    <span style={{ fontSize: 26 }}>{symptom.icon}</span>
                    <span className="text-xs font-bold text-gray-700 text-start leading-tight">{name}</span>
                    {isSelected && <CheckCircle2 size={14} className="absolute top-2 right-2 text-pink-500" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected symptoms tags */}
        {selectedSymptoms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map((s) => (
              <div key={s} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                {s}
                <button onClick={() => toggleSymptom(s)} className="text-pink-400 hover:text-pink-600 font-bold">×</button>
              </div>
            ))}
          </div>
        )}

        {/* Severity Slider */}
        {selectedSymptoms.length > 0 && (
          <div className="p-5 rounded-3xl bg-white space-y-4" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-extrabold text-gray-800">{t('severity')}</p>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full text-white text-xs font-bold" style={{ background: severityColor, boxShadow: `0 4px 12px ${severityColor}66` }}>
                <span>{severity}/10</span>
                <span>— {severityLabel}</span>
              </div>
            </div>
            <Slider value={[severity]} onValueChange={(v) => setSeverity(v[0])} min={1} max={10} step={1} className="w-full" />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: '#9CA3AF' }}>
              <span style={{ color: '#43A047' }}>● {isAr ? 'خفيف' : isFr ? 'Léger' : 'Low'}</span>
              <span style={{ color: '#FB8C00' }}>● {isAr ? 'متوسط' : isFr ? 'Modéré' : 'Medium'}</span>
              <span style={{ color: '#E53935' }}>● {isAr ? 'شديد' : isFr ? 'Sévère' : 'High'}</span>
            </div>
          </div>
        )}

        {/* Time of occurrence */}
        {selectedSymptoms.length > 0 && (
          <div className="p-5 rounded-3xl bg-white" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
            <p className="text-sm font-extrabold text-gray-800 mb-3 flex items-center gap-2">
              <Clock size={16} className="text-pink-400" />
              {isAr ? 'وقت ظهور الأعراض' : isFr ? "Heure d'apparition" : 'Time of occurrence'}
            </p>
            <input
              type="datetime-local"
              value={occurredAt}
              onChange={(e) => setOccurredAt(e.target.value)}
              className="w-full text-sm text-gray-700 outline-none rounded-2xl px-4 py-3 border border-gray-200 bg-gray-50 focus:border-pink-300 transition-colors"
            />
          </div>
        )}

        {/* Notes */}
        {selectedSymptoms.length > 0 && (
          <div className="p-5 rounded-3xl bg-white" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
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
          </div>
        )}

        {/* Photo Upload */}
        {selectedSymptoms.length > 0 && (
          <Card className="p-4 rounded-2xl bg-white shadow-sm">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              {isFr ? 'Photo du symptôme (optionnel)' : isAr ? 'صورة العرض (اختياري)' : 'Symptom photo (optional)'}
            </Label>
            {photoPreview ? (
              <div className="relative">
                <img src={photoPreview} alt="symptom" className="w-full h-40 object-cover rounded-xl" />
                <button onClick={() => { setPhotoPreview(null); setPhotoFile(null); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-pink-300 hover:text-pink-400 transition-all"
              >
                <Camera size={24} />
                <span className="text-xs font-medium">
                  {isFr ? 'Prendre une photo ou choisir depuis la galerie' : isAr ? 'التقاط صورة أو اختيار من المعرض' : 'Take a photo or choose from gallery'}
                </span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoChange} />
          </Card>
        )}

        {/* Submit Button */}
        <button
          disabled={selectedSymptoms.length === 0 || isLoading}
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
            <><CheckCircle2 size={22} />{isAr ? 'تم الحفظ!' : isFr ? 'Enregistré !' : 'Saved!'}</>
          ) : isLoading ? (
            <><Loader2 size={20} className="animate-spin" />{isAr ? 'جاري الحفظ...' : isFr ? 'Enregistrement...' : 'Saving...'}</>
          ) : (
            <><Plus size={22} />{t('addSymptom')}</>
          )}
        </button>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 px-4 py-3 rounded-2xl" style={{ background: '#FFFDE7', border: '1px solid #FFF176' }}>
          <span className="text-amber-500 text-sm flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
            {isAr ? 'هذا التطبيق أداة مساعدة وليس بديلاً عن الاستشارة الطبية.' : isFr ? "Cette application est une aide, pas un remplacement d'un avis médical." : 'This app is a health aid, not a replacement for medical advice.'}
          </p>
        </div>
      </div>
    </div>
  );
}
