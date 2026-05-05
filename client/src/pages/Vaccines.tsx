import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Clock, Syringe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'wouter';

const VACCINES = [
  { name: 'BCG', date: '2024-01-15', status: 'completed', nextDue: null },
  { name: 'Hepatitis B', date: '2024-01-15', status: 'completed', nextDue: null },
  { name: 'Polio 1', date: '2024-02-15', status: 'completed', nextDue: '2024-04-15' },
  { name: 'Polio 2', date: '2024-04-15', status: 'completed', nextDue: '2024-06-15' },
  { name: 'Polio 3', date: null, status: 'pending', nextDue: '2024-06-15' },
  { name: 'DPT 1', date: '2024-02-15', status: 'completed', nextDue: '2024-04-15' },
  { name: 'DPT 2', date: '2024-04-15', status: 'completed', nextDue: '2024-06-15' },
  { name: 'DPT 3', date: null, status: 'pending', nextDue: '2024-06-15' },
  { name: 'MMR', date: null, status: 'pending', nextDue: '2024-09-15' },
  { name: 'Varicella', date: null, status: 'pending', nextDue: '2024-12-15' },
];

export default function Vaccines() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const isAr = language === 'ar';
  const isFr = language === 'fr';
  const completedCount = VACCINES.filter((v) => v.status === 'completed').length;
  const pendingCount = VACCINES.filter((v) => v.status === 'pending').length;

  return (
    <div className="min-h-screen pb-24 overflow-x-hidden" style={{ background: '#F9FAFB' }}>
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div
          className="px-5 pt-12 pb-6 rounded-b-3xl"
          style={{ background: 'linear-gradient(135deg, #66BB6A 0%, #2E7D32 100%)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Syringe size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white" style={{ fontFamily: isAr ? 'Tajawal, sans-serif' : 'Poppins, sans-serif' }}>
                {isFr ? 'Carnet de Vaccins' : isAr ? 'سجل التطعيمات' : 'Vaccine Journal'}
              </h1>
              <p className="text-sm text-white/80">
                {isFr ? "Suivez les vaccinations de votre enfant" : isAr ? 'تابع تطعيمات طفلك' : "Track your child's vaccinations"}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 text-center rounded-2xl bg-white shadow-sm border-0">
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <p className="text-xs text-gray-500 mt-1">{isFr ? 'Administrés' : isAr ? 'تم إعطاؤها' : 'Administered'}</p>
            </Card>
            <Card className="p-4 text-center rounded-2xl bg-white shadow-sm border-0">
              <div className="text-2xl font-bold text-orange-500">{pendingCount}</div>
              <p className="text-xs text-gray-500 mt-1">{isFr ? 'À venir' : isAr ? 'قادمة' : 'Upcoming'}</p>
            </Card>
          </div>

          {/* Completed Vaccines */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-gray-700 px-1">
              {isFr ? '✅ Vaccins administrés' : isAr ? '✅ التطعيمات المُعطاة' : '✅ Administered Vaccines'}
            </h2>
            {VACCINES.filter((v) => v.status === 'completed').map((vaccine) => (
              <Card key={vaccine.name} className="p-3 flex items-center gap-3 rounded-2xl bg-white shadow-sm border-0">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={16} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{vaccine.name}</p>
                  <p className="text-xs text-gray-400">{vaccine.date}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Pending Vaccines */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-gray-700 px-1">
              {isFr ? '⏰ Vaccins à venir' : isAr ? '⏰ التطعيمات القادمة' : '⏰ Upcoming Vaccines'}
            </h2>
            {VACCINES.filter((v) => v.status === 'pending').map((vaccine) => (
              <Card key={vaccine.name} className="p-3 flex items-center gap-3 rounded-2xl bg-orange-50 shadow-sm border border-orange-100">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Clock size={16} className="text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{vaccine.name}</p>
                  <p className="text-xs text-orange-500">
                    {isFr ? 'Prévu le : ' : isAr ? 'موعده: ' : 'Due: '}
                    {vaccine.nextDue}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Important Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800">
                {isFr ? 'Restez à jour' : isAr ? 'ابقَ على اطلاع' : 'Keep Updated'}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {isFr
                  ? "Les vaccinations sont cruciales. Suivez le calendrier recommandé et consultez votre pédiatre."
                  : isAr
                  ? 'التطعيمات ضرورية لصحة طفلك. اتبع الجدول الموصى به واستشر طبيب الأطفال.'
                  : "Vaccinations are crucial for your child's health. Follow the recommended schedule."}
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2">
            <span className="text-amber-500 text-sm">⚠️</span>
            <p className="text-xs text-amber-700">
              {isFr ? 'Cette application est une aide, pas un remplacement d\'un avis médical.' : isAr ? 'هذا التطبيق أداة مساعدة وليس بديلاً عن الاستشارة الطبية.' : 'This app is a guide, not a replacement for medical advice.'}
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setLocation('/appointments')}
            className="w-full h-14 text-white text-base font-bold rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #66BB6A 0%, #2E7D32 100%)',
              boxShadow: '0 8px 24px rgba(102,187,106,0.4)',
            }}
          >
            <Syringe size={20} />
            {isFr ? 'Prendre un rendez-vous' : isAr ? 'حجز موعد' : 'Schedule Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
}
