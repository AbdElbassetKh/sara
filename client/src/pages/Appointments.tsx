import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppContext } from '@/contexts/AppContext';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import {
  Calendar, Clock, MapPin, Plus,
  CheckCircle2, XCircle, Bell, BellOff, Stethoscope,
  Trash2, AlertCircle, X
} from 'lucide-react';
import { useLocation } from 'wouter';
import PageHeader from '@/components/PageHeader';
import DatePicker from '@/components/DatePicker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

  const isAr = language === 'ar';
  const isFr = language === 'fr';

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#F9FAFB', fontFamily: isAr ? "'Tajawal', sans-serif" : "'Poppins', sans-serif" }}
    >
      <div className="max-w-md mx-auto">
        <PageHeader
          title={isAr ? 'المواعيد الطبية' : isFr ? 'Rendez-vous' : 'Appointments'}
          subtitle={`${selectedChild.name} · ${upcomingAppointments.length} ${isAr ? 'قادم' : isFr ? 'à venir' : 'upcoming'}`}
          gradient="linear-gradient(135deg, #80CBC4 0%, #00695C 60%, #00897B 100%)"
          shadowColor="rgba(0,105,92,0.35)"
          icon={Stethoscope}
          backPath="/"
          rightAction={
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm"
            >
              {showForm ? <X size={18} color="white" /> : <Plus size={18} color="white" />}
            </button>
          }
        />

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
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full h-12 text-white font-extrabold rounded-3xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #80CBC4, #00695C)', boxShadow: '0 6px 20px rgba(0,105,92,0.35)' }}
            >
              <Plus size={20} color="white" />
              {isAr ? 'موعد جديد' : isFr ? 'Nouveau rendez-vous' : 'New Appointment'}
            </button>
          )}

          {/* Form */}
          {showForm && (
            <div
              className="p-5 rounded-3xl bg-white space-y-4"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #B2DFDB' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #80CBC4, #00695C)' }}>
                  <Stethoscope size={16} color="white" />
                </div>
                <p className="text-sm font-extrabold text-gray-800">
                  {isAr ? 'موعد جديد' : isFr ? 'Nouveau rendez-vous' : 'New Appointment'}
                </p>
              </div>

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
                    <DatePicker
                      label={language === 'fr' ? 'Date *' : language === 'ar' ? 'التاريخ *' : 'Date *'}
                      value={form.appointmentDate}
                      onChange={(v) => setForm({ ...form, appointmentDate: v })}
                      minYear={new Date().getFullYear()}
                      maxYear={new Date().getFullYear() + 5}
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
                <button
                  className="flex-1 h-11 rounded-2xl font-bold text-sm border-2 border-gray-200 text-gray-600 bg-white transition-all active:scale-95"
                  onClick={resetForm}
                >
                  {isAr ? 'إلغاء' : isFr ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  className="flex-1 h-11 rounded-2xl font-extrabold text-sm text-white transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #80CBC4, #00695C)', boxShadow: '0 4px 12px rgba(0,105,92,0.3)' }}
                  onClick={handleSubmit}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending
                    ? (isAr ? 'جاري الحفظ...' : isFr ? 'Enregistrement...' : 'Saving...')
                    : (isAr ? 'حفظ' : isFr ? 'Enregistrer' : 'Save')}
                </button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-3">
            {[
              { key: 'upcoming' as const, label: isAr ? `القادمة (${upcomingAppointments.length})` : isFr ? `À venir (${upcomingAppointments.length})` : `Upcoming (${upcomingAppointments.length})` },
              { key: 'all' as const, label: isAr ? `الكل (${allAppointments.length})` : isFr ? `Tous (${allAppointments.length})` : `All (${allAppointments.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex-1 py-3 rounded-3xl text-sm font-extrabold transition-all active:scale-95"
                style={{
                  background: activeTab === tab.key ? 'linear-gradient(135deg, #80CBC4, #00695C)' : 'white',
                  color: activeTab === tab.key ? 'white' : '#6B7280',
                  boxShadow: activeTab === tab.key ? '0 6px 20px rgba(0,105,92,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
                  border: activeTab === tab.key ? 'none' : '1.5px solid #F1F5F9',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Appointments list */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 bg-gray-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : displayedAppointments.length === 0 ? (
            <div
              className="py-12 flex flex-col items-center gap-3 rounded-3xl bg-white"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#E0F2F1' }}>
                <Calendar size={30} style={{ color: '#00695C' }} />
              </div>
              <p className="font-extrabold text-gray-700">
                {isAr ? 'لا توجد مواعيد' : isFr ? 'Aucun rendez-vous' : 'No appointments'}
              </p>
              <p className="text-sm text-gray-400 text-center px-6">
                {isAr ? 'أضف موعدك الأول أعلاه' : isFr ? 'Ajoutez votre premier rendez-vous ci-dessus' : 'Add your first appointment above'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedAppointments.map((appt) => {
                const isUpcoming = appt.status === 'upcoming' && new Date(appt.appointmentDate) >= new Date();
                const daysUntil = getDaysUntil(appt.appointmentDate, language);
                return (
                  <div
                    key={appt.id}
                    className="p-4 rounded-3xl bg-white"
                    style={{
                      boxShadow: isUpcoming ? '0 6px 20px rgba(0,105,92,0.12)' : '0 4px 12px rgba(0,0,0,0.05)',
                      border: isUpcoming ? '2px solid #B2DFDB' : '1px solid #F1F5F9',
                    }}
                  >
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{ background: isUpcoming ? 'linear-gradient(135deg, #80CBC4, #00695C)' : '#F3F4F6', boxShadow: isUpcoming ? '0 4px 12px rgba(0,105,92,0.3)' : 'none' }}
                        >
                          <Stethoscope size={18} style={{ color: isUpcoming ? 'white' : '#9CA3AF' }} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">{appt.doctorName}</p>
                          {appt.specialty && (
                            <p className="text-xs text-muted-foreground">{appt.specialty}</p>
                          )}
                        </div>
                      </div>
                      <span
                        className="text-[10px] font-extrabold px-3 py-1 rounded-full flex-shrink-0"
                        style={{
                          background: appt.status === 'upcoming' ? '#E0F2F1' : appt.status === 'completed' ? '#E8F5E9' : '#FFEBEE',
                          color: appt.status === 'upcoming' ? '#00695C' : appt.status === 'completed' ? '#2E7D32' : '#C62828',
                        }}
                      >
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
                      <div className="flex gap-2 pt-2">
                        <button
                          className="flex-1 h-9 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all active:scale-95"
                          style={{ background: '#E8F5E9', color: '#2E7D32', border: '1.5px solid #C8E6C9' }}
                          onClick={() => updateStatusMutation.mutate({ id: appt.id, status: 'completed' })}
                        >
                          <CheckCircle2 size={14} />
                          {isAr ? 'مكتمل' : isFr ? 'Terminé' : 'Done'}
                        </button>
                        <button
                          className="flex-1 h-9 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all active:scale-95"
                          style={{ background: '#FFF8E1', color: '#E65100', border: '1.5px solid #FFE082' }}
                          onClick={() => updateStatusMutation.mutate({ id: appt.id, status: 'cancelled' })}
                        >
                          <XCircle size={14} />
                          {isAr ? 'إلغاء' : isFr ? 'Annuler' : 'Cancel'}
                        </button>
                        <button
                          className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all active:scale-95"
                          style={{ background: '#FFEBEE', border: '1.5px solid #FFCDD2' }}
                          onClick={() => deleteMutation.mutate({ id: appt.id })}
                        >
                          <Trash2 size={14} style={{ color: '#C62828' }} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
