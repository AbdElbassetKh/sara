import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAppContext } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  FileText,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import { useLocation } from "wouter";

const SPECIALTIES_AR = [
  "طب الأطفال",
  "طبيب حساسية",
  "طبيب عام",
  "طبيب جلدية",
  "طبيب أعصاب",
  "طبيب أنف وأذن وحنجرة",
  "طبيب تغذية",
  "أخرى",
];
const SPECIALTIES_FR = [
  "Pédiatrie",
  "Allergologie",
  "Médecine générale",
  "Dermatologie",
  "Neurologie",
  "ORL",
  "Nutrition",
  "Autre",
];
const SPECIALTIES_EN = [
  "Pediatrics",
  "Allergology",
  "General Medicine",
  "Dermatology",
  "Neurology",
  "ENT",
  "Nutrition",
  "Other",
];

interface DoctorForm {
  name: string;
  specialty: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

const emptyForm: DoctorForm = {
  name: "",
  specialty: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
};

export default function Doctors() {
  const { selectedChild } = useAppContext();
  const { language, t } = useLanguage();
  const [, navigate] = useLocation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<DoctorForm>(emptyForm);

  const specialties =
    language === "ar"
      ? SPECIALTIES_AR
      : language === "fr"
      ? SPECIALTIES_FR
      : SPECIALTIES_EN;

  const utils = trpc.useUtils();

  const { data: doctorsList = [], isLoading } = trpc.doctors.list.useQuery(
    { childId: selectedChild?.id },
    { enabled: !!selectedChild }
  );

  const createMutation = trpc.doctors.create.useMutation({
    onSuccess: () => {
      utils.doctors.list.invalidate();
      setShowForm(false);
      setForm(emptyForm);
      toast(language === "ar" ? "تمت الإضافة" : language === "fr" ? "Médecin ajouté" : "Doctor added");
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.doctors.update.useMutation({
    onSuccess: () => {
      utils.doctors.list.invalidate();
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      toast(language === "ar" ? "تم التعديل" : language === "fr" ? "Médecin modifié" : "Doctor updated");
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.doctors.delete.useMutation({
    onSuccess: () => {
      utils.doctors.list.invalidate();
      setDeletingId(null);
      toast(language === "ar" ? "تم الحذف" : language === "fr" ? "Médecin supprimé" : "Doctor deleted");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, ...form });
    } else {
      createMutation.mutate({ childId: selectedChild?.id, ...form });
    }
  };

  const handleEdit = (doc: (typeof doctorsList)[0]) => {
    setEditingId(doc.id);
    setForm({
      name: doc.name,
      specialty: doc.specialty ?? "",
      phone: doc.phone ?? "",
      email: doc.email ?? "",
      address: doc.address ?? "",
      notes: doc.notes ?? "",
    });
    setShowForm(true);
  };

  const isRTL = language === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  const labels = {
    title: language === "ar" ? "قائمة الأطباء" : language === "fr" ? "Mes Médecins" : "My Doctors",
    add: language === "ar" ? "إضافة طبيب" : language === "fr" ? "Ajouter un médecin" : "Add Doctor",
    edit: language === "ar" ? "تعديل الطبيب" : language === "fr" ? "Modifier le médecin" : "Edit Doctor",
    name: language === "ar" ? "الاسم *" : language === "fr" ? "Nom *" : "Name *",
    specialty: language === "ar" ? "التخصص" : language === "fr" ? "Spécialité" : "Specialty",
    phone: language === "ar" ? "الهاتف" : language === "fr" ? "Téléphone" : "Phone",
    email: "Email",
    address: language === "ar" ? "العنوان" : language === "fr" ? "Adresse" : "Address",
    notes: language === "ar" ? "ملاحظات" : language === "fr" ? "Notes" : "Notes",
    save: language === "ar" ? "حفظ" : language === "fr" ? "Enregistrer" : "Save",
    cancel: language === "ar" ? "إلغاء" : language === "fr" ? "Annuler" : "Cancel",
    empty: language === "ar" ? "لا يوجد أطباء مضافون بعد" : language === "fr" ? "Aucun médecin ajouté" : "No doctors added yet",
    deleteTitle: language === "ar" ? "حذف الطبيب" : language === "fr" ? "Supprimer le médecin" : "Delete Doctor",
    deleteDesc: language === "ar" ? "هل أنت متأكد من حذف هذا الطبيب؟" : language === "fr" ? "Voulez-vous vraiment supprimer ce médecin ?" : "Are you sure you want to delete this doctor?",
    confirm: language === "ar" ? "تأكيد" : language === "fr" ? "Confirmer" : "Confirm",
    selectSpecialty: language === "ar" ? "اختر التخصص" : language === "fr" ? "Choisir la spécialité" : "Select specialty",
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]" dir={dir}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4FC3F7] to-[#29B6F6] px-4 pt-10 pb-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1 as never)} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
            <ArrowLeft size={20} className={isRTL ? "rotate-180" : ""} />
          </button>
          <div>
            <h1 className="text-xl font-bold">{labels.title}</h1>
            {selectedChild && (
              <p className="text-sm text-white/80">{selectedChild.name}</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* Add button */}
        <Button
          onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true); }}
          className="w-full mb-4 bg-gradient-to-r from-[#4FC3F7] to-[#29B6F6] text-white rounded-2xl h-12 font-semibold flex items-center gap-2"
        >
          <Plus size={18} />
          {labels.add}
        </Button>

        {/* List */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-[#4FC3F7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : doctorsList.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Stethoscope size={48} className="mx-auto mb-3 opacity-30" />
            <p>{labels.empty}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {doctorsList.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#4FC3F7] to-[#29B6F6] flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{doc.name}</p>
                      {doc.specialty && (
                        <p className="text-sm text-[#4FC3F7] flex items-center gap-1">
                          <Stethoscope size={12} />
                          {doc.specialty}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => handleEdit(doc)} className="p-2 rounded-xl bg-blue-50 text-[#4FC3F7] hover:bg-blue-100 transition">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setDeletingId(doc.id)} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Contact info */}
                <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                  {doc.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-[#4FC3F7]" />
                      <a href={`tel:${doc.phone}`} className="hover:text-[#4FC3F7] transition">{doc.phone}</a>
                    </div>
                  )}
                  {doc.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-[#4FC3F7]" />
                      <a href={`mailto:${doc.email}`} className="hover:text-[#4FC3F7] transition truncate">{doc.email}</a>
                    </div>
                  )}
                  {doc.address && (
                    <div className="flex items-start gap-2">
                      <MapPin size={13} className="text-[#4FC3F7] mt-0.5 flex-shrink-0" />
                      <span>{doc.address}</span>
                    </div>
                  )}
                  {doc.notes && (
                    <div className="flex items-start gap-2">
                      <FileText size={13} className="text-[#4FC3F7] mt-0.5 flex-shrink-0" />
                      <span className="italic text-gray-500">{doc.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={(v) => { if (!v) { setShowForm(false); setEditingId(null); setForm(emptyForm); } }}>
        <DialogContent className="max-w-sm mx-auto rounded-2xl" dir={dir}>
          <DialogHeader>
            <DialogTitle className="text-[#4FC3F7]">
              {editingId !== null ? labels.edit : labels.add}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">{labels.name}</label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder={labels.name}
                className="rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">{labels.specialty}</label>
              <select
                value={form.specialty}
                onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4FC3F7] bg-white"
              >
                <option value="">{labels.selectSpecialty}</option>
                {specialties.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">{labels.phone}</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+213..."
                type="tel"
                className="rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">{labels.email}</label>
              <Input
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="doctor@example.com"
                type="email"
                className="rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">{labels.address}</label>
              <Input
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder={labels.address}
                className="rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">{labels.notes}</label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder={labels.notes}
                className="rounded-xl resize-none"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="rounded-xl flex-1">
              {labels.cancel}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!form.name.trim() || createMutation.isPending || updateMutation.isPending}
              className="rounded-xl flex-1 bg-gradient-to-r from-[#4FC3F7] to-[#29B6F6] text-white"
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : labels.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deletingId !== null} onOpenChange={(v) => { if (!v) setDeletingId(null); }}>
        <AlertDialogContent dir={dir}>
          <AlertDialogHeader>
            <AlertDialogTitle>{labels.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>{labels.deleteDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{labels.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId !== null && deleteMutation.mutate({ id: deletingId })}
              className="bg-red-500 hover:bg-red-600"
            >
              {labels.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
