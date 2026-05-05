const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope, Plus, FileText, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Doctor() {
  const { t, language } = useLanguage();

  const DOCTOR_VISITS = [
    {
      id: 1,
      doctorName: 'Dr. Sarah Smith',
      specialty: language === 'fr' ? 'Pédiatrie' : language === 'ar' ? 'طب الأطفال' : 'Pediatrics',
      date: '2024-05-01',
      notes: language === 'fr' ? 'Bilan général. Tous les signes vitaux normaux. Croissance dans les normes.' : language === 'ar' ? 'فحص عام. جميع العلامات الحيوية طبيعية. النمو ضمن المعدل.' : 'General checkup. All vital signs normal. Growth on track.',
      documents: 2,
    },
    {
      id: 2,
      doctorName: 'Dr. John Doe',
      specialty: language === 'fr' ? 'Allergologue' : language === 'ar' ? 'طبيب الحساسية' : 'Allergist',
      date: '2024-04-15',
      notes: language === 'fr' ? 'Tests d\'allergie effectués. Allergie au lait confirmée.' : language === 'ar' ? 'تم إجراء اختبارات الحساسية. تأكدت حساسية الحليب.' : 'Allergy testing completed. Milk allergy confirmed.',
      documents: 1,
    },
    {
      id: 3,
      doctorName: 'Dr. Emily Brown',
      specialty: language === 'fr' ? 'Pédiatrie' : language === 'ar' ? 'طب الأطفال' : 'Pediatrics',
      date: '2024-03-20',
      notes: language === 'fr' ? 'Rendez-vous vaccination. Polio 2 administré.' : language === 'ar' ? 'موعد التطعيم. تم إعطاء شلل الأطفال 2.' : 'Vaccination appointment. Polio 2 administered.',
      documents: 0,
    },
  ];

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log(formData);
    setFormData({ doctorName: '', specialty: '', date: new Date().toISOString().split('T')[0], notes: '' });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <div className="page-header-gradient px-4 pt-10 pb-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-extrabold text-white">{t('doctorVisits')}</h1>
            <p className="text-sm text-white/80 mt-1">
              {language === 'fr' ? "Suivez les rendez-vous médicaux et les dossiers" : language === 'ar' ? 'تتبع المواعيد الطبية والسجلات' : "Track medical appointments and records"}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center space-y-1 shadow-sm">
            <Stethoscope size={22} className="mx-auto text-primary" />
            <p className="text-xl font-bold text-foreground">{DOCTOR_VISITS.length}</p>
            <p className="text-xs text-muted-foreground">
              {language === 'fr' ? 'Visites totales' : language === 'ar' ? 'إجمالي الزيارات' : 'Total Visits'}
            </p>
          </Card>
          <Card className="p-4 text-center space-y-1 shadow-sm">
            <FileText size={22} className="mx-auto text-secondary" />
            <p className="text-xl font-bold text-foreground">3</p>
            <p className="text-xs text-muted-foreground">
              {language === 'fr' ? 'Documents' : language === 'ar' ? 'الوثائق' : 'Documents'}
            </p>
          </Card>
        </div>

        {/* Doctor Contacts */}
        <Card className="p-5 space-y-3 shadow-sm">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Phone size={18} />
            {language === 'fr' ? 'Contacts médicaux' : language === 'ar' ? 'جهات الاتصال الطبية' : 'Medical Contacts'}
          </h2>
          <div className="space-y-2">
            <div className="p-3 bg-muted/10 rounded-lg">
              <p className="text-sm font-semibold text-foreground">
                {language === 'fr' ? 'Pédiatre principal' : language === 'ar' ? 'طبيب الأطفال الرئيسي' : 'Primary Pediatrician'}
              </p>
              <p className="text-sm text-muted-foreground">Dr. Sarah Smith</p>
              <p className="text-xs text-primary font-medium mt-0.5">+1 (555) 123-4567</p>
            </div>
            <div className="p-3 bg-muted/10 rounded-lg">
              <p className="text-sm font-semibold text-foreground">
                {language === 'fr' ? 'Allergologue' : language === 'ar' ? 'طبيب الحساسية' : 'Allergist'}
              </p>
              <p className="text-sm text-muted-foreground">Dr. John Doe</p>
              <p className="text-xs text-primary font-medium mt-0.5">+1 (555) 234-5678</p>
            </div>
          </div>
        </Card>

        {/* Visit History */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">
            {language === 'fr' ? 'Visites récentes' : language === 'ar' ? 'الزيارات الأخيرة' : 'Recent Visits'}
          </h2>
          <div className="space-y-3">
            {DOCTOR_VISITS.map((visit) => (
              <Card key={visit.id} className="p-4 space-y-2 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{visit.doctorName}</h3>
                    <p className="text-xs text-muted-foreground">{visit.specialty}</p>
                  </div>
                  <span className="text-xs font-semibold text-primary">{visit.date}</span>
                </div>
                <p className="text-xs text-muted-foreground">{visit.notes}</p>
                {visit.documents > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-secondary font-medium">
                    <FileText size={12} />
                    {visit.documents} {language === 'fr' ? 'document(s)' : language === 'ar' ? 'وثيقة' : `document${visit.documents > 1 ? 's' : ''}`}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Add Visit Form */}
        {showForm && (
          <Card className="p-5 space-y-4 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">{t('addVisit')}</h2>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="doctorName" className="text-sm font-semibold">{t('doctorName')} *</Label>
                <Input
                  id="doctorName"
                  placeholder={language === 'fr' ? 'ex. Dr. Sarah Smith' : language === 'ar' ? 'مثال: د. أحمد علي' : 'e.g., Dr. Sarah Smith'}
                  value={formData.doctorName}
                  onChange={(e) => handleInputChange('doctorName', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="specialty" className="text-sm font-semibold">
                  {language === 'fr' ? 'Spécialité' : language === 'ar' ? 'التخصص' : 'Specialty'}
                </Label>
                <Input
                  id="specialty"
                  placeholder={language === 'fr' ? 'ex. Pédiatrie' : language === 'ar' ? 'مثال: طب الأطفال' : 'e.g., Pediatrics'}
                  value={formData.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-sm font-semibold">{t('visitDate')}</Label>
                <Input id="date" type="date" value={formData.date} onChange={(e) => handleInputChange('date', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-sm font-semibold">{t('notes')}</Label>
                <textarea
                  id="notes"
                  placeholder={language === 'fr' ? 'Notes de la visite...' : language === 'ar' ? 'ملاحظات الزيارة...' : 'Visit notes...'}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full p-3 border border-border rounded-lg text-sm resize-none h-24 bg-background text-foreground"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1 rounded-xl">{t('save')}</Button>
                <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1 rounded-xl">{t('cancel')}</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Add Button */}
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="w-full h-12 text-base font-semibold gap-2 rounded-xl">
            <Plus size={18} />
            {t('addVisit')}
          </Button>
        )}
      </div>
    </div>
  );
}
