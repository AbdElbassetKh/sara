import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppContext } from '@/contexts/AppContext';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import {
  Calendar, Clock, MapPin, User, Plus, ChevronLeft,
  CheckCircle2, XCircle, Bell, BellOff, Stethoscope,
  Trash2, Edit3, AlertCircle
} from 'lucide-react';
import { useLocation } from 'wouter';

type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

interface AppointmentForm {
  doctorName: string;
  specialty: string;
  appointmentDate: string;
  appointmentTime: string;
  location: string;
  notes: string;
  enableReminder: boolean;
}

const SPECIALTIES = {
  fr: ['Pédiatre', 'Généraliste', 'Allergologue', 'Dermatologue', 'ORL', 'Ophtalmologue', 'Nutritionniste', 'Autre'],
  ar: ['طبيب أطفال', 'طبيب عام', 'أخصائي حساسية', 'طبيب جلدية', 'أخصائي أنف وأذن وحنجرة', 'طبيب عيون', 'أخصائي تغذية', 'أخرى'],
  en: ['Pediatrician', 'General Practitioner', 'Allergist', 'Dermatologist', 'ENT', 'Ophthalmologist', 'Nutritionist', 'Other'],
};

function formatDate(date: Date | string, language: string): string {
  const d = new Date(date);
  if (language === 'ar') {
    return d.toLocaleDateString('ar-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  if (language === 'fr') {
    return d.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function getDaysUntil(date: Date | string, language: string): string {
  const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return language === 'fr' ? "Aujourd'hui" : language === 'ar' ? 'اليوم' : 'Today';
  if (diff === 1) return language === 'fr' ? 'Demain' : language === 'ar' ? 'غداً' : 'Tomorrow';
  if (diff < 0) return language === 'fr' ? `Il y a ${Math.abs(diff)}j` : language === 'ar' ? `منذ ${Math.abs(diff)} أيام` : `${Math.abs(diff)}d ago`;
  return language === 'fr' ? `Dans ${diff} jours` : language === 'ar' ? `بعد ${diff} أيام` : `In ${diff} days`;
}

export default function Appointments() {
  const { t, language } = useLanguage();
  const { selectedChild } = useAppContext();
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'all'>('upcoming');
  const [form, setForm] = useState<AppointmentForm>({
    doctorName: '',
    specialty: '',
    appointmentDate: '',
    appointmentTime: '09:00',
    location: '',
    notes: '',
    enableReminder: true,
  });

  const childId = selectedChild?.id ?? 0;
  const utils = trpc.useUtils();

  const { data: allAppointments = [], isLoading } = trpc.appointments.list.useQuery(
    { childId },
    { enabled: childId > 0 }
  );

  const createMutation = trpc.appointments.create.useMutation({
    onSuccess: () => {
      toast.success(
        language === 'fr' ? 'Rendez-vous ajouté ✅' :
        language === 'ar' ? 'تم إضافة الموعد ✅' :
        'Appointment added ✅'
      );
      utils.appointments.list.invalidate({ childId });
      utils.appointments.getNext.invalidate({ childId });
      resetForm();
    },
    onError: () => toast.error(language === 'fr' ? 'Erreur lors de l\'ajout' : language === 'ar' ? 'خطأ في الإضافة' : 'Error adding appointment'),
  });

  const updateStatusMutation = trpc.appointments.updateStatus.useMutation({
    onSuccess: () => {
      utils.appointments.list.invalidate({ childId });
      utils.appointments.getNext.invalidate({ childId });
    },
  });

  const deleteMutation = trpc.appointments.delete.useMutation({
    onSuccess: () => {
      toast.success(
        language === 'fr' ? 'Rendez-vous supprimé' :
        language === 'ar' ? 'تم حذف الموعد' :
        'Appointment deleted'
      );
      utils.appointments.list.invalidate({ childId });
      utils.appointments.getNext.invalidate({ childId });
    },
  });

  const resetForm = () => {
    setForm({ doctorName: '', specialty: '', appointmentDate: '', appointmentTime: '09:00', location: '', notes: '', enableReminder: true });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.doctorName.trim()) {
      toast.error(language === 'fr' ? 'Le nom du médecin est requis' : language === 'ar' ? 'اسم الطبيب مطلوب' : 'Doctor name is required');
      return;
    }
    if (!form.appointmentDate) {
      toast.error(language === 'fr' ? 'La date est requise' : language === 'ar' ? 'التاريخ مطلوب' : 'Date is required');
      return;
    }
    const isoDate = `${form.appointmentDate}T${form.appointmentTime}:00`;
    createMutation.mutate({
      childId,
      doctorName: form.doctorName,
      specialty: form.specialty || undefined,
      appointmentDate: isoDate,
      location: form.location || undefined,
      notes: form.notes || undefined,
      enableReminder: form.enableReminder,
    });
  };

  const upcomingAppointments = allAppointments.filter(
    (a) => a.status === 'upcoming' && new Date(a.appointmentDate) >= new Date()
  );
  const displayedAppointments = activeTab === 'upcoming' ? upcomingAppointments : allAppointments;

  const statusColor: Record<AppointmentStatus, string> = {
    upcoming: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const statusLabel = (status: AppointmentStatus) => {
    if (language === 'fr') return status === 'upcoming' ? 'À venir' : status === 'completed' ? 'Terminé' : 'Annulé';
    if (language === 'ar') return status === 'upcoming' ? 'قادم' : status === 'completed' ? 'مكتمل' : 'ملغى';
    return status === 'upcoming' ? 'Upcoming' : status === 'completed' ? 'Completed' : 'Cancelled';
  };

  const specialties = SPECIALTIES[language as keyof typeof SPECIALTIES] ?? SPECIALTIES.en;

  if (!selectedChild) {
    return (
      <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
        <div className="text-center p-8">
          <Stethoscope className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {language === 'fr' ? 'Sélectionnez un enfant pour voir les rendez-vous' :
             language === 'ar' ? 'اختر طفلاً لعرض المواعيد' :
             'Select a child to view appointments'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 overflow-x-hidden">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="page-header-gradient px-4 pt-10 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => setLocation('/')}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-white">
                {language === 'fr' ? 'Rendez-vous' : language === 'ar' ? 'المواعيد الطبية' : 'Appointments'}
              </h1>
              <p className="text-sm text-white/80">
                {selectedChild.name} · {upcomingAppointments.length}{' '}
                {language === 'fr' ? 'à venir' : language === 'ar' ? 'قادم' : 'upcoming'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Medical disclaimer */}
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              {language === 'fr' ? "Cette application est une aide, pas un remplacement d'un avis médical." :
               language === 'ar' ? 'هذا التطبيق أداة مساعدة وليس بديلاً عن الاستشارة الطبية.' :
               'This app is a health aid tool, not a replacement for medical advice.'}
            </p>
          </div>

          {/* Add button */}
          <Button
            className="w-full h-12 bg-gradient-to-r from-sky-500 to-indigo-500 hover:opacity-90 text-white font-semibold rounded-2xl flex items-center gap-2"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus className="w-5 h-5" />
            {language === 'fr' ? 'Nouveau rendez-vous' : language === 'ar' ? 'موعد جديد' : 'New Appointment'}
          </Button>

          {/* Form */}
          {showForm && (
            <Card className="p-4 space-y-4 border-2 border-sky-200 bg-sky-50/30">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-sky-500" />
                {language === 'fr' ? 'Nouveau rendez-vous' : language === 'ar' ? 'موعد جديد' : 'New Appointment'}
              </h3>

              <div className="space-y-3">
                {/* Doctor name */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {language === 'fr' ? 'Nom du médecin *' : language === 'ar' ? 'اسم الطبيب *' : 'Doctor Name *'}
                  </Label>
                  <Input
                    value={form.doctorName}
                    onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                    placeholder={language === 'fr' ? 'Dr. Nom Prénom' : language === 'ar' ? 'د. الاسم' : 'Dr. Name'}
                    className="mt-1"
                  />
                </div>

                {/* Specialty */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {language === 'fr' ? 'Spécialité' : language === 'ar' ? 'التخصص' : 'Specialty'}
                  </Label>
                  <select
                    value={form.specialty}
                    onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <option value="">
                      {language === 'fr' ? '-- Choisir --' : language === 'ar' ? '-- اختر --' : '-- Select --'}
                    </option>
                    {specialties.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {language === 'fr' ? 'Date *' : language === 'ar' ? 'التاريخ *' : 'Date *'}
                    </Label>
                    <Input
                      type="date"
                      value={form.appointmentDate}
                      onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {language === 'fr' ? 'Heure' : language === 'ar' ? 'الوقت' : 'Time'}
                    </Label>
                    <Input
                      type="time"
                      value={form.appointmentTime}
                      onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {language === 'fr' ? 'Lieu / Adresse' : language === 'ar' ? 'المكان / العنوان' : 'Location / Address'}
                  </Label>
                  <Input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder={language === 'fr' ? 'Cabinet, hôpital...' : language === 'ar' ? 'عيادة، مستشفى...' : 'Clinic, hospital...'}
                    className="mt-1"
                  />
                </div>

                {/* Notes */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {language === 'fr' ? 'Notes' : language === 'ar' ? 'ملاحظات' : 'Notes'}
                  </Label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder={language === 'fr' ? 'Motif de consultation, questions...' : language === 'ar' ? 'سبب الزيارة، أسئلة...' : 'Reason for visit, questions...'}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
                    rows={3}
                  />
                </div>

                {/* Reminder toggle */}
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${form.enableReminder ? 'bg-sky-50 border border-sky-200' : 'bg-muted/30 border border-border'}`}
                  onClick={() => setForm({ ...form, enableReminder: !form.enableReminder })}
                >
                  {form.enableReminder ? (
                    <Bell className="w-5 h-5 text-sky-500" />
                  ) : (
                    <BellOff className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {language === 'fr' ? 'Rappel 24h avant' : language === 'ar' ? 'تذكير قبل 24 ساعة' : 'Reminder 24h before'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {form.enableReminder
                        ? (language === 'fr' ? 'Activé — notification dans les alertes' : language === 'ar' ? 'مفعّل — إشعار في التنبيهات' : 'Enabled — notification in alerts')
                        : (language === 'fr' ? 'Désactivé' : language === 'ar' ? 'معطّل' : 'Disabled')}
                    </p>
                  </div>
                  <div className={`w-10 h-6 rounded-full transition-colors ${form.enableReminder ? 'bg-sky-500' : 'bg-muted'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm mt-0.5 transition-transform ${form.enableReminder ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={resetForm}>
                  {language === 'fr' ? 'Annuler' : language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 text-white"
                  onClick={handleSubmit}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending
                    ? (language === 'fr' ? 'Enregistrement...' : language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                    : (language === 'fr' ? 'Enregistrer' : language === 'ar' ? 'حفظ' : 'Save')}
                </Button>
              </div>
            </Card>
          )}

          {/* Tabs */}
          <div className="flex bg-muted rounded-2xl p-1">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'upcoming' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
            >
              {language === 'fr' ? `À venir (${upcomingAppointments.length})` :
               language === 'ar' ? `القادمة (${upcomingAppointments.length})` :
               `Upcoming (${upcomingAppointments.length})`}
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
            >
              {language === 'fr' ? `Tous (${allAppointments.length})` :
               language === 'ar' ? `الكل (${allAppointments.length})` :
               `All (${allAppointments.length})`}
            </button>
          </div>

          {/* Appointments list */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 bg-muted/40 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : displayedAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">
                {language === 'fr' ? 'Aucun rendez-vous' : language === 'ar' ? 'لا توجد مواعيد' : 'No appointments'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'fr' ? 'Ajoutez votre premier rendez-vous ci-dessus' :
                 language === 'ar' ? 'أضف موعدك الأول أعلاه' :
                 'Add your first appointment above'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedAppointments.map((appt) => {
                const isUpcoming = appt.status === 'upcoming' && new Date(appt.appointmentDate) >= new Date();
                const daysUntil = getDaysUntil(appt.appointmentDate, language);
                return (
                  <Card
                    key={appt.id}
                    className={`p-4 space-y-3 border-2 transition-all ${isUpcoming ? 'border-sky-200 bg-gradient-to-br from-sky-50/50 to-indigo-50/50' : 'border-border'}`}
                  >
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${isUpcoming ? 'bg-sky-100' : 'bg-muted'}`}>
                          <Stethoscope className={`w-5 h-5 ${isUpcoming ? 'text-sky-600' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">{appt.doctorName}</p>
                          {appt.specialty && (
                            <p className="text-xs text-muted-foreground">{appt.specialty}</p>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor[appt.status as AppointmentStatus]}`}>
                        {statusLabel(appt.status as AppointmentStatus)}
                      </span>
                    </div>

                    {/* Date & time */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-sky-500 flex-shrink-0" />
                        <span className="text-foreground">{formatDate(appt.appointmentDate, language)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        <span className="text-foreground">{formatTime(appt.appointmentDate)}</span>
                        {isUpcoming && (
                          <span className="ml-auto text-xs font-semibold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">
                            {daysUntil}
                          </span>
                        )}
                      </div>
                      {appt.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
                          <span className="text-muted-foreground">{appt.location}</span>
                        </div>
                      )}
                      {appt.reminderAt && appt.reminderSent === 0 && isUpcoming && (
                        <div className="flex items-center gap-2 text-xs text-amber-600">
                          <Bell className="w-3.5 h-3.5" />
                          <span>
                            {language === 'fr' ? 'Rappel prévu le ' : language === 'ar' ? 'تذكير مجدول في ' : 'Reminder on '}
                            {formatDate(appt.reminderAt, language)}
                          </span>
                        </div>
                      )}
                    </div>

                    {appt.notes && (
                      <p className="text-xs text-muted-foreground bg-muted/40 rounded-xl px-3 py-2">{appt.notes}</p>
                    )}

                    {/* Actions */}
                    {appt.status === 'upcoming' && (
                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => updateStatusMutation.mutate({ id: appt.id, status: 'completed' })}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          {language === 'fr' ? 'Terminé' : language === 'ar' ? 'مكتمل' : 'Done'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => updateStatusMutation.mutate({ id: appt.id, status: 'cancelled' })}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          {language === 'fr' ? 'Annuler' : language === 'ar' ? 'إلغاء' : 'Cancel'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-400 border-red-100 hover:bg-red-50 px-3"
                          onClick={() => deleteMutation.mutate({ id: appt.id })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
