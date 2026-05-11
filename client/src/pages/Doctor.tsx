const LOGO_URL = '/manus-storage/allenest-logo-v2_33417a5b.jpg';
import { useState } from 'react';
import DatePicker from '@/components/DatePicker';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope, Plus, FileText, Trash2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppContext } from '@/contexts/AppContext';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function Doctor() {
  const { t, language } = useLanguage();
  const { selectedChild } = useAppContext();
  const childId = selectedChild?.id ?? 0;

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const { data: visits = [], isLoading, refetch } = trpc.doctorVisits.list.useQuery(
    { childId },
    { enabled: childId > 0 }
  );

  const createMutation = trpc.doctorVisits.create.useMutation({
    onSuccess: () => {
      refetch();
      setFormData({ doctorName: '', specialty: '', date: new Date().toISOString().split('T')[0], notes: '' });
      setShowForm(false);
      toast.success(language === 'ar' ? 'تم حفظ الزيارة' : language === 'fr' ? 'Visite enregistrée' : 'Visit saved');
    },
    onError: () => {
      toast.error(language === 'ar' ? 'حدث خطأ' : language === 'fr' ? "Erreur lors de l'enregistrement" : 'Error saving visit');
    },
  });

  const deleteMutation = trpc.doctorVisits.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast.success(language === 'ar' ? 'تم الحذف' : language === 'fr' ? 'Supprimé' : 'Deleted');
    },
  });

  const handleSubmit = () => {
    if (!childId) {
      toast.error(language === 'ar' ? 'اختر طفلاً أولاً' : language === 'fr' ? 'Sélectionnez un enfant' : 'Select a child first');
      return;
    }
    if (!formData.doctorName.trim()) {
      toast.error(language === 'ar' ? 'اسم الطبيب مطلوب' : language === 'fr' ? 'Le nom du médecin est requis' : 'Doctor name is required');
      return;
    }
    createMutation.mutate({
      childId,
      doctorName: formData.doctorName.trim(),
      specialty: formData.specialty.trim() || undefined,
      visitDate: formData.date,
      notes: formData.notes.trim() || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <div className="page-header-gradient px-4 pt-10 pb-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-extrabold text-white">{t('doctorVisits')}</h1>
            <p className="text-sm text-white/80 mt-1">
              {language === 'fr'
                ? 'Suivez les rendez-vous médicaux et les dossiers'
                : language === 'ar'
                ? 'تتبع المواعيد الطبية والسجلات'
                : 'Track medical appointments and records'}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center space-y-1 shadow-sm">
            <Stethoscope size={22} className="mx-auto text-primary" />
            <p className="text-xl font-bold text-foreground">
              {isLoading ? '—' : visits.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {language === 'fr' ? 'Visites totales' : language === 'ar' ? 'إجمالي الزيارات' : 'Total Visits'}
            </p>
          </Card>
          <Card className="p-4 text-center space-y-1 shadow-sm">
            <FileText size={22} className="mx-auto text-secondary" />
            <p className="text-xl font-bold text-foreground">
              {isLoading ? '—' : visits.filter(v => v.notes && v.notes.length > 0).length}
            </p>
            <p className="text-xs text-muted-foreground">
              {language === 'fr' ? 'Avec notes' : language === 'ar' ? 'مع ملاحظات' : 'With notes'}
            </p>
          </Card>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && visits.length === 0 && (
          <Card className="p-6 text-center border-0 shadow-sm">
            <Stethoscope className="mx-auto mb-2 text-primary/40" size={32} />
            <p className="text-sm text-muted-foreground">
              {language === 'fr' ? 'Aucune visite enregistrée' : language === 'ar' ? 'لا توجد زيارات مسجلة' : 'No visits recorded yet'}
            </p>
          </Card>
        )}

        {/* Visit History */}
        {!isLoading && visits.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              {language === 'fr' ? 'Visites récentes' : language === 'ar' ? 'الزيارات الأخيرة' : 'Recent Visits'}
            </h2>
            <div className="space-y-3">
              {visits.map((visit) => (
                <Card key={visit.id} className="p-4 space-y-2 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm truncate">{visit.doctorName}</h3>
                      {visit.specialty && (
                        <p className="text-xs text-muted-foreground">{visit.specialty}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-xs font-semibold text-primary whitespace-nowrap">
                        {new Date(visit.visitDate).toLocaleDateString(
                          language === 'ar' ? 'ar-DZ' : language === 'fr' ? 'fr-FR' : 'en-US',
                          { year: 'numeric', month: 'short', day: 'numeric' }
                        )}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/80 h-7 w-7"
                        onClick={() => deleteMutation.mutate({ id: visit.id })}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  {visit.notes && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{visit.notes}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

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
                  onChange={(e) => setFormData(p => ({ ...p, doctorName: e.target.value }))}
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
                  onChange={(e) => setFormData(p => ({ ...p, specialty: e.target.value }))}
                />
              </div>
              <DatePicker
                label={t('visitDate')}
                value={formData.date}
                onChange={(v) => setFormData(p => ({ ...p, date: v }))}
                maxYear={new Date().getFullYear() + 1}
              />
              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-sm font-semibold">{t('notes')}</Label>
                <textarea
                  id="notes"
                  placeholder={language === 'fr' ? 'Notes de la visite...' : language === 'ar' ? 'ملاحظات الزيارة...' : 'Visit notes...'}
                  value={formData.notes}
                  onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                  className="w-full p-3 border border-border rounded-lg text-sm resize-none h-24 bg-background text-foreground"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  className="flex-1 rounded-xl"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : t('save')}
                </Button>
                <Button
                  onClick={() => setShowForm(false)}
                  variant="outline"
                  className="flex-1 rounded-xl"
                >
                  {t('cancel')}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Add Button */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full h-12 text-base font-semibold gap-2 rounded-xl"
          >
            <Plus size={18} />
            {t('addVisit')}
          </Button>
        )}
      </div>
    </div>
  );
}
