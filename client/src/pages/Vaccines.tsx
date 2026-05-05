const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const completedCount = VACCINES.filter((v) => v.status === 'completed').length;
  const pendingCount = VACCINES.filter((v) => v.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background pb-24 overflow-x-hidden">
      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <div className="page-header-gradient px-4 pt-10 pb-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-extrabold text-white">{t('vaccineJournal')}</h1>
            <p className="text-sm text-white/80 mt-1">
              {language === 'fr' ? "Suivez les vaccinations de votre enfant" : language === 'ar' ? 'تابع تطعيمات طفلك' : "Track your child's vaccinations"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center space-y-1 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <p className="text-xs text-muted-foreground">{t('administered')}</p>
          </Card>
          <Card className="p-4 text-center space-y-1 shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">{t('upcoming')}</p>
          </Card>
        </div>

        {/* Completed Vaccines */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">{t('administered')}</h2>
          <div className="space-y-2">
            {VACCINES.filter((v) => v.status === 'completed').map((vaccine) => (
              <Card key={vaccine.name} className="p-4 flex items-start gap-3 shadow-sm">
                <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{vaccine.name}</p>
                  <p className="text-xs text-muted-foreground">{vaccine.date}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Pending Vaccines */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">{t('upcoming')}</h2>
          <div className="space-y-2">
            {VACCINES.filter((v) => v.status === 'pending').map((vaccine) => (
              <Card key={vaccine.name} className="p-4 flex items-start gap-3 border-orange-200 bg-orange-50/50 shadow-sm">
                <Clock size={18} className="text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{vaccine.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'fr' ? 'Prévu le : ' : language === 'ar' ? 'موعده: ' : 'Due: '}
                    {vaccine.nextDue}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                {language === 'fr' ? 'Restez à jour' : language === 'ar' ? 'ابقَ على اطلاع' : 'Keep Updated'}
              </p>
              <p className="text-xs text-blue-800 mt-1">
                {language === 'fr'
                  ? "Les vaccinations sont cruciales pour la santé de votre enfant. Suivez le calendrier recommandé."
                  : language === 'ar'
                  ? 'التطعيمات ضرورية لصحة طفلك. اتبع الجدول الموصى به واستشر طبيب الأطفال.'
                  : "Vaccinations are crucial for your child's health. Follow the recommended schedule and consult with your pediatrician."}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full h-12 text-base font-semibold rounded-xl">
          {language === 'fr' ? 'Prendre un rendez-vous' : language === 'ar' ? 'حجز موعد' : 'Schedule Appointment'}
        </Button>
      </div>
    </div>
  );
}
