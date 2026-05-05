import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppContext } from '@/contexts/AppContext';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import {
  ChevronLeft, FileText, Download, Calendar, Baby,
  Utensils, Activity, TrendingUp, Syringe, Stethoscope,
  CheckCircle2, Lock, Crown
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useState } from 'react';

const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';

export default function ExportReport() {
  const { language } = useLanguage();
  const { selectedChild } = useAppContext();
  const [, setLocation] = useLocation();
  const [selectedSections, setSelectedSections] = useState<string[]>(['meals', 'symptoms', 'growth', 'vaccines']);
  const [dateRange, setDateRange] = useState<'week' | 'month' | '3months' | '6months' | 'year'>('month');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  const { data: subscription } = trpc.premium.getSubscription.useQuery();
  const isPremium = subscription?.isPremium;

  const sections = [
    { id: 'meals', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-50',
      label: language === 'fr' ? 'Journal des repas' : language === 'ar' ? 'سجل الوجبات' : 'Meal Journal' },
    { id: 'symptoms', icon: Activity, color: 'text-red-500', bg: 'bg-red-50',
      label: language === 'fr' ? 'Suivi des symptômes' : language === 'ar' ? 'تتبع الأعراض' : 'Symptom Tracking' },
    { id: 'growth', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50',
      label: language === 'fr' ? 'Courbes de croissance' : language === 'ar' ? 'منحنيات النمو' : 'Growth Charts' },
    { id: 'vaccines', icon: Syringe, color: 'text-blue-500', bg: 'bg-blue-50',
      label: language === 'fr' ? 'Carnet de vaccination' : language === 'ar' ? 'سجل التطعيمات' : 'Vaccine Journal' },
    { id: 'doctor', icon: Stethoscope, color: 'text-purple-500', bg: 'bg-purple-50',
      label: language === 'fr' ? 'Visites médicales' : language === 'ar' ? 'الزيارات الطبية' : 'Doctor Visits' },
  ];

  const dateRanges = [
    { id: 'week', label: language === 'fr' ? '7 jours' : language === 'ar' ? '7 أيام' : '7 days' },
    { id: 'month', label: language === 'fr' ? '1 mois' : language === 'ar' ? 'شهر' : '1 month' },
    { id: '3months', label: language === 'fr' ? '3 mois' : language === 'ar' ? '3 أشهر' : '3 months' },
    { id: '6months', label: language === 'fr' ? '6 mois' : language === 'ar' ? '6 أشهر' : '6 months' },
    { id: 'year', label: language === 'fr' ? '1 an' : language === 'ar' ? 'سنة' : '1 year' },
  ];

  const toggleSection = (id: string) => {
    setSelectedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!isPremium) {
      toast.error(
        language === 'fr' ? 'Fonctionnalité Premium requise' :
        language === 'ar' ? 'مطلوب اشتراك مميز' :
        'Premium feature required'
      );
      return;
    }
    if (selectedSections.length === 0) {
      toast.error(
        language === 'fr' ? 'Sélectionnez au moins une section' :
        language === 'ar' ? 'اختر قسمًا واحدًا على الأقل' :
        'Select at least one section'
      );
      return;
    }

    setIsGenerating(true);
    // Simulate PDF generation (in production, call tRPC endpoint)
    await new Promise(r => setTimeout(r, 2500));

    // Generate a simple HTML report and trigger download
    const childName = selectedChild?.name ?? 'Child';
    const reportDate = new Date().toLocaleDateString(
      language === 'fr' ? 'fr-FR' : language === 'ar' ? 'ar-DZ' : 'en-US'
    );

    const htmlContent = `<!DOCTYPE html>
<html lang="${language}">
<head>
<meta charset="UTF-8">
<title>AlleNest Report – ${childName}</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
  .header { display: flex; align-items: center; gap: 16px; border-bottom: 2px solid #4FC3F7; padding-bottom: 16px; margin-bottom: 24px; }
  .logo { width: 60px; height: 60px; border-radius: 12px; }
  h1 { color: #4FC3F7; margin: 0; }
  h2 { color: #0288D1; border-left: 4px solid #4FC3F7; padding-left: 12px; }
  .section { margin-bottom: 32px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .info-item { background: #f5f5f5; padding: 12px; border-radius: 8px; }
  .info-label { font-size: 12px; color: #666; }
  .info-value { font-weight: bold; font-size: 16px; }
  .footer { border-top: 1px solid #eee; padding-top: 16px; font-size: 12px; color: #999; text-align: center; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <h1>AlleNest – ${language === 'fr' ? 'Rapport de Santé' : language === 'ar' ? 'تقرير الصحة' : 'Health Report'}</h1>
    <p style="margin:0;color:#666;">${childName} – ${reportDate}</p>
  </div>
</div>

<div class="section">
  <h2>${language === 'fr' ? 'Profil Enfant' : language === 'ar' ? 'ملف الطفل' : 'Child Profile'}</h2>
  <div class="info-grid">
    <div class="info-item">
      <div class="info-label">${language === 'fr' ? 'Nom' : language === 'ar' ? 'الاسم' : 'Name'}</div>
      <div class="info-value">${childName}</div>
    </div>
    <div class="info-item">
      <div class="info-label">${language === 'fr' ? 'Date du rapport' : language === 'ar' ? 'تاريخ التقرير' : 'Report Date'}</div>
      <div class="info-value">${reportDate}</div>
    </div>
    <div class="info-item">
      <div class="info-label">${language === 'fr' ? 'Période couverte' : language === 'ar' ? 'الفترة المغطاة' : 'Period Covered'}</div>
      <div class="info-value">${dateRanges.find(d => d.id === dateRange)?.label}</div>
    </div>
    <div class="info-item">
      <div class="info-label">${language === 'fr' ? 'Sections incluses' : language === 'ar' ? 'الأقسام المضمنة' : 'Sections Included'}</div>
      <div class="info-value">${selectedSections.length}</div>
    </div>
  </div>
</div>

${selectedSections.map(s => {
  const sec = sections.find(sec => sec.id === s);
  return `<div class="section">
  <h2>${sec?.label}</h2>
  <p style="color:#666;font-style:italic;">${
    language === 'fr' ? 'Données exportées depuis AlleNest pour la période sélectionnée.' :
    language === 'ar' ? 'البيانات المصدرة من AlleNest للفترة المحددة.' :
    'Data exported from AlleNest for the selected period.'
  }</p>
</div>`;
}).join('\n')}

<div class="footer">
  <p>${language === 'fr' ? 'Généré par AlleNest – Application de suivi de santé pédiatrique' :
      language === 'ar' ? 'تم إنشاؤه بواسطة AlleNest – تطبيق تتبع صحة الأطفال' :
      'Generated by AlleNest – Pediatric Health Tracking App'}</p>
  <p>${language === 'fr' ? 'Ce rapport est à titre informatif et ne remplace pas un avis médical.' :
      language === 'ar' ? 'هذا التقرير لأغراض إعلامية ولا يحل محل الاستشارة الطبية.' :
      'This report is for informational purposes and does not replace medical advice.'}</p>
</div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `allenest-report-${childName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setReportUrl(url);
    setIsGenerating(false);
    toast.success(
      language === 'fr' ? 'Rapport téléchargé avec succès ! 📄' :
      language === 'ar' ? 'تم تنزيل التقرير بنجاح! 📄' :
      'Report downloaded successfully! 📄'
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setLocation('/settings')} className="p-2 rounded-full hover:bg-muted transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <FileText className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-foreground">
          {language === 'fr' ? 'Exporter un rapport' : language === 'ar' ? 'تصدير تقرير' : 'Export Report'}
        </h1>
        {isPremium && <Crown className="w-5 h-5 text-yellow-500 ml-auto" />}
      </div>

      <div className="px-4 pt-6 space-y-6">
        {/* Premium Gate */}
        {!isPremium && (
          <Card className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {language === 'fr' ? 'Fonctionnalité Premium' : language === 'ar' ? 'ميزة مميزة' : 'Premium Feature'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'fr' ? 'Passez à Premium pour exporter vos rapports' :
                   language === 'ar' ? 'قم بالترقية إلى المميز لتصدير تقاريرك' :
                   'Upgrade to Premium to export your reports'}
                </p>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white" onClick={() => setLocation('/premium')}>
              <Crown className="w-4 h-4 mr-2" />
              {language === 'fr' ? 'Passer à Premium' : language === 'ar' ? 'الترقية إلى المميز' : 'Upgrade to Premium'}
            </Button>
          </Card>
        )}

        {/* Child Info */}
        <Card className="p-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Baby className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{selectedChild?.name ?? 'No child selected'}</p>
            <p className="text-xs text-muted-foreground">
              {language === 'fr' ? 'Rapport pour cet enfant' :
               language === 'ar' ? 'تقرير لهذا الطفل' :
               'Report for this child'}
            </p>
          </div>
          <img src={LOGO_URL} alt="AlleNest" className="w-8 h-8 rounded-lg ml-auto object-cover" />
        </Card>

        {/* Date Range */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            {language === 'fr' ? 'Période du rapport' : language === 'ar' ? 'فترة التقرير' : 'Report Period'}
          </h3>
          <div className="flex gap-2 flex-wrap">
            {dateRanges.map(range => (
              <button
                key={range.id}
                onClick={() => setDateRange(range.id as typeof dateRange)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  dateRange === range.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">
            {language === 'fr' ? 'Sections à inclure' : language === 'ar' ? 'الأقسام المراد تضمينها' : 'Sections to Include'}
          </h3>
          <div className="space-y-2">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  selectedSections.includes(section.id)
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border bg-card'
                }`}
              >
                <div className={`w-10 h-10 ${section.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <section.icon className={`w-5 h-5 ${section.color}`} />
                </div>
                <span className="text-sm font-medium text-foreground flex-1 text-left">{section.label}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedSections.includes(section.id)
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground/30'
                }`}>
                  {selectedSections.includes(section.id) && (
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={handleGenerate}
          disabled={!isPremium || isGenerating || selectedSections.length === 0}
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              {language === 'fr' ? 'Génération en cours...' : language === 'ar' ? 'جاري الإنشاء...' : 'Generating...'}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              {language === 'fr' ? 'Générer et télécharger' : language === 'ar' ? 'إنشاء وتنزيل' : 'Generate & Download'}
            </div>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          {language === 'fr'
            ? 'Le rapport sera téléchargé au format HTML (imprimable en PDF depuis votre navigateur).'
            : language === 'ar'
            ? 'سيتم تنزيل التقرير بتنسيق HTML (قابل للطباعة كـ PDF من متصفحك).'
            : 'Report will be downloaded as HTML (printable as PDF from your browser).'}
        </p>
      </div>
    </div>
  );
}
