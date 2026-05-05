import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Apple, AlertCircle, Stethoscope, TrendingUp, Syringe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Timeline() {
  const { t } = useLanguage();

  const TIMELINE_EVENTS = [
    {
      id: 1,
      type: 'meal',
      title: t('filterMeals') + ': ' + (t('language') === 'fr' ? 'Pomme et banane' : t('language') === 'ar' ? 'تفاح وموز' : 'Apple and banana'),
      time: t('language') === 'fr' ? "Aujourd'hui 14h30" : t('language') === 'ar' ? 'اليوم 2:30 م' : 'Today 2:30 PM',
      icon: Apple,
      color: 'text-green-600',
      details: t('language') === 'fr' ? 'Aucun allergène détecté' : t('language') === 'ar' ? 'لم يتم اكتشاف مسببات حساسية' : 'No allergens detected',
    },
    {
      id: 2,
      type: 'symptom',
      title: t('rash') + ' — ' + t('mild'),
      time: t('language') === 'fr' ? "Aujourd'hui 13h15" : t('language') === 'ar' ? 'اليوم 1:15 م' : 'Today 1:15 PM',
      icon: AlertCircle,
      color: 'text-red-600',
      details: t('language') === 'fr' ? 'Sévérité: 3/10, bras gauche' : t('language') === 'ar' ? 'الشدة: 3/10، الذراع اليسرى' : 'Severity: 3/10, on left arm',
    },
    {
      id: 3,
      type: 'doctor',
      title: t('language') === 'fr' ? 'Visite Dr. Smith' : t('language') === 'ar' ? 'زيارة د. سميث' : 'Visited Dr. Smith',
      time: t('language') === 'fr' ? 'Hier 10h00' : t('language') === 'ar' ? 'أمس 10:00 ص' : 'Yesterday 10:00 AM',
      icon: Stethoscope,
      color: 'text-blue-600',
      details: t('language') === 'fr' ? 'Bilan général, tout va bien' : t('language') === 'ar' ? 'فحص عام، كل شيء على ما يرام' : 'General checkup, all good',
    },
    {
      id: 4,
      type: 'growth',
      title: t('language') === 'fr' ? 'Mesure de croissance enregistrée' : t('language') === 'ar' ? 'تم تسجيل قياس النمو' : 'Growth measurement recorded',
      time: t('language') === 'fr' ? 'Il y a 2 jours' : t('language') === 'ar' ? 'منذ يومين' : '2 days ago',
      icon: TrendingUp,
      color: 'text-orange-600',
      details: t('language') === 'fr' ? 'Poids: 6,8 kg, Taille: 58 cm' : t('language') === 'ar' ? 'الوزن: 6.8 كجم، الطول: 58 سم' : 'Weight: 6.8 kg, Height: 58 cm',
    },
    {
      id: 5,
      type: 'vaccine',
      title: t('language') === 'fr' ? 'Vaccin Polio 2 administré' : t('language') === 'ar' ? 'تم إعطاء لقاح شلل الأطفال 2' : 'Polio 2 vaccination completed',
      time: t('language') === 'fr' ? 'Il y a 1 semaine' : t('language') === 'ar' ? 'منذ أسبوع' : '1 week ago',
      icon: Syringe,
      color: 'text-pink-600',
      details: t('language') === 'fr' ? 'Aucune réaction indésirable' : t('language') === 'ar' ? 'لا توجد ردود فعل سلبية' : 'No adverse reactions',
    },
  ];

  const categories = ['all', 'meal', 'symptom', 'doctor', 'growth', 'vaccine'];

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      all: `📋 ${t('filterAll')}`,
      meal: `🍎 ${t('filterMeals')}`,
      symptom: `🔴 ${t('filterSymptoms')}`,
      doctor: `👨‍⚕️ ${t('filterDoctor')}`,
      growth: `📈 ${t('filterGrowth')}`,
      vaccine: `💉 ${t('actionVaccines')}`,
    };
    return labels[cat] || cat;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <div className="pt-2">
          <h1 className="text-2xl font-bold text-foreground">{t('timeline')}</h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3">
            {categories.slice(0, 3).map((cat) => (
              <TabsTrigger key={cat} value={cat} className="text-xs">
                {getCategoryLabel(cat).split(' ').slice(0, 2).join(' ')}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsList className="grid w-full grid-cols-3 mt-2">
            {categories.slice(3).map((cat) => (
              <TabsTrigger key={cat} value={cat} className="text-xs">
                {getCategoryLabel(cat).split(' ').slice(0, 2).join(' ')}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => {
            const filtered = TIMELINE_EVENTS.filter(
              (event) => category === 'all' || event.type === category
            );
            return (
              <TabsContent key={category} value={category} className="space-y-3 mt-4">
                {filtered.length === 0 ? (
                  <Card className="p-8 text-center space-y-2">
                    <p className="text-muted-foreground text-sm">{t('noEventsYet')}</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {filtered.map((event, idx) => {
                      const Icon = event.icon;
                      const isLast = idx === filtered.length - 1;
                      return (
                        <div key={event.id} className="relative">
                          {!isLast && (
                            <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border z-0" />
                          )}
                          <Card className="p-4 flex gap-4 relative z-10 shadow-sm">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                <Icon size={20} className={event.color} />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground text-sm">{event.title}</h3>
                              <p className="text-xs text-muted-foreground">{event.time}</p>
                              <p className="text-xs text-muted-foreground/70 mt-1">{event.details}</p>
                            </div>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
