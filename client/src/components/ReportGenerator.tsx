/**
 * ReportGenerator – generates a PDF summary report for the selected child
 * and offers sharing options (download, email via server, WhatsApp, Web Share API).
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAppContext } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Download, Mail, Share2, Loader2, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

// WhatsApp icon (SVG path)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface ReportGeneratorProps {
  /** If true, renders as a full-width button; otherwise an icon button */
  variant?: "full" | "icon";
}

export default function ReportGenerator({ variant = "full" }: ReportGeneratorProps) {
  const { selectedChild } = useAppContext();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfName, setPdfName] = useState("allenest-report.pdf");
  const [emailInput, setEmailInput] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const isRTL = language === "ar";

  // Fetch data for the report
  const { data: symptoms = [] } = trpc.symptoms.list.useQuery(
    { childId: selectedChild?.id ?? 0 },
    { enabled: !!selectedChild }
  );
  const { data: meals = [] } = trpc.meals.list.useQuery(
    { childId: selectedChild?.id ?? 0 },
    { enabled: !!selectedChild }
  );
  const { data: doctorsList = [] } = trpc.doctors.list.useQuery(
    { childId: selectedChild?.id },
    { enabled: !!selectedChild }
  );

  // Server-side email mutation
  const sendEmailMutation = trpc.report.sendByEmail.useMutation({
    onSuccess: () => {
      setEmailSent(true);
      toast.success(
        language === "ar"
          ? `تم إرسال التقرير إلى ${emailInput} ✉️`
          : language === "fr"
          ? `Rapport envoyé à ${emailInput} ✉️`
          : `Report sent to ${emailInput} ✉️`
      );
    },
    onError: (err) => {
      toast.error(
        language === "ar"
          ? `فشل الإرسال: ${err.message}`
          : language === "fr"
          ? `Échec de l'envoi : ${err.message}`
          : `Send failed: ${err.message}`
      );
    },
  });

  const labels = {
    btn: language === "ar" ? "تصدير تقرير PDF" : language === "fr" ? "Générer rapport PDF" : "Generate PDF Report",
    title: language === "ar" ? "تقرير صحة الطفل" : language === "fr" ? "Rapport de santé" : "Health Report",
    generating: language === "ar" ? "جاري إنشاء التقرير..." : language === "fr" ? "Génération en cours..." : "Generating report...",
    download: language === "ar" ? "تحميل" : language === "fr" ? "Télécharger" : "Download",
    emailPlaceholder: language === "ar" ? "أدخل البريد الإلكتروني" : language === "fr" ? "Entrez l'adresse email" : "Enter email address",
    sendEmail: language === "ar" ? "إرسال بالبريد" : language === "fr" ? "Envoyer par email" : "Send by email",
    sending: language === "ar" ? "جاري الإرسال..." : language === "fr" ? "Envoi en cours..." : "Sending...",
    emailSent: language === "ar" ? "تم الإرسال ✓" : language === "fr" ? "Envoyé ✓" : "Sent ✓",
    whatsapp: "WhatsApp",
    share: language === "ar" ? "مشاركة" : language === "fr" ? "Partager" : "Share",
    ready: language === "ar" ? "التقرير جاهز!" : language === "fr" ? "Rapport prêt !" : "Report ready!",
    close: language === "ar" ? "إغلاق" : language === "fr" ? "Fermer" : "Close",
    emailSection: language === "ar" ? "إرسال مباشر بالبريد الإلكتروني" : language === "fr" ? "Envoi direct par email" : "Direct email delivery",
    emailNote: language === "ar"
      ? "سيتم إرسال التقرير كملف PDF مرفق مباشرةً إلى البريد المحدد."
      : language === "fr"
      ? "Le rapport PDF sera envoyé directement en pièce jointe à l'adresse indiquée."
      : "The PDF report will be sent directly as an attachment to the specified address.",
  };

  const generatePDF = async () => {
    if (!selectedChild) return;
    setGenerating(true);
    setEmailSent(false);
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 15;
      let y = 20;

      // ── Header ──────────────────────────────────────────────────────────
      doc.setFillColor(79, 195, 247); // #4FC3F7
      doc.rect(0, 0, pageW, 30, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("AlleNest – Health Report", pageW / 2, 13, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(new Date().toLocaleDateString(), pageW / 2, 22, { align: "center" });
      y = 40;

      // ── Child info ───────────────────────────────────────────────────────
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Child Information", margin, y);
      y += 7;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${selectedChild.name}`, margin, y); y += 6;
      if (selectedChild.birthDate) {
        doc.text(`Date of birth: ${selectedChild.birthDate}`, margin, y); y += 6;
      }
      doc.text(`Gender: ${selectedChild.gender}`, margin, y); y += 6;
      if (selectedChild.allergies?.length) {
        doc.text(`Known allergies: ${selectedChild.allergies.join(", ")}`, margin, y); y += 6;
      }
      y += 4;

      // ── Symptoms (last 30 days) ──────────────────────────────────────────
      const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const recentSymptoms = (symptoms as any[]).filter(
        (s) => new Date(s.createdAt).getTime() > cutoff
      );
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(239, 83, 80); // #EF5350
      doc.text(`Symptoms (last 30 days) – ${recentSymptoms.length} entries`, margin, y);
      y += 7;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      if (recentSymptoms.length === 0) {
        doc.text("No symptoms recorded.", margin, y); y += 6;
      } else {
        recentSymptoms.slice(0, 20).forEach((s: any) => {
          if (y > 270) { doc.addPage(); y = 20; }
          const date = new Date(s.createdAt).toLocaleDateString();
          doc.text(
            `• ${date}  |  ${s.symptomType}  |  Severity: ${s.severity}/10${s.notes ? "  – " + s.notes : ""}`,
            margin, y
          );
          y += 5.5;
        });
      }
      y += 4;

      // ── Meals (last 30 days) ─────────────────────────────────────────────
      const recentMeals = (meals as any[]).filter(
        (m) => new Date(m.createdAt).getTime() > cutoff
      );
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(79, 195, 247); // #4FC3F7
      doc.text(`Meals (last 30 days) – ${recentMeals.length} entries`, margin, y);
      y += 7;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      if (recentMeals.length === 0) {
        doc.text("No meals recorded.", margin, y); y += 6;
      } else {
        recentMeals.slice(0, 20).forEach((m: any) => {
          if (y > 270) { doc.addPage(); y = 20; }
          const date = new Date(m.createdAt).toLocaleDateString();
          const foods = Array.isArray(m.foods) ? m.foods.join(", ") : m.foodName ?? "";
          doc.text(`• ${date}  |  ${foods}`, margin, y);
          y += 5.5;
        });
      }
      y += 4;

      // ── Doctors ──────────────────────────────────────────────────────────
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(219, 112, 147);
      doc.text(`Doctors – ${doctorsList.length} contacts`, margin, y);
      y += 7;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      if (doctorsList.length === 0) {
        doc.text("No doctors added.", margin, y); y += 6;
      } else {
        (doctorsList as any[]).forEach((d: any) => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(
            `• ${d.name}${d.specialty ? "  –  " + d.specialty : ""}${d.phone ? "  |  " + d.phone : ""}`,
            margin, y
          );
          y += 5.5;
        });
      }

      // ── Footer ───────────────────────────────────────────────────────────
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(180, 180, 180);
        doc.text(
          "Generated by AlleNest – For informational purposes only. Not a medical document.",
          pageW / 2,
          doc.internal.pageSize.getHeight() - 8,
          { align: "center" }
        );
      }

      const blob = doc.output("blob");
      const filename = `allenest-${selectedChild.name.replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`;
      setPdfBlob(blob);
      setPdfName(filename);
      setOpen(true);
      toast(labels.ready);
    } catch (err) {
      toast.error("Failed to generate PDF");
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = pdfName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = () => {
    if (!selectedChild || !emailInput.trim()) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.trim())) {
      toast.error(
        language === "ar" ? "البريد الإلكتروني غير صالح" : language === "fr" ? "Adresse email invalide" : "Invalid email address"
      );
      return;
    }
    sendEmailMutation.mutate({
      childId: selectedChild.id,
      recipientEmail: emailInput.trim(),
      language: language as "fr" | "en" | "ar",
    });
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `AlleNest Health Report for ${selectedChild?.name ?? ""}. Generated on ${new Date().toLocaleDateString()}.`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleWebShare = async () => {
    if (!pdfBlob) return;
    if (navigator.share) {
      try {
        const file = new File([pdfBlob], pdfName, { type: "application/pdf" });
        await navigator.share({
          title: `AlleNest – ${selectedChild?.name ?? ""}`,
          text: "Health report generated by AlleNest",
          files: [file],
        });
      } catch {
        // User cancelled
      }
    } else {
      handleDownload();
    }
  };

  return (
    <>
      {variant === "full" ? (
        <Button
          onClick={generatePDF}
          disabled={generating || !selectedChild}
          className="w-full bg-gradient-to-r from-[#4FC3F7] to-[#29B6F6] text-white rounded-2xl h-12 font-semibold flex items-center gap-2"
        >
          {generating ? (
            <><Loader2 size={18} className="animate-spin" />{labels.generating}</>
          ) : (
            <><FileText size={18} />{labels.btn}</>
          )}
        </Button>
      ) : (
        <button
          onClick={generatePDF}
          disabled={generating || !selectedChild}
          className="p-2 rounded-xl bg-blue-50 text-[#4FC3F7] hover:bg-blue-100 transition disabled:opacity-50"
          title={labels.btn}
        >
          {generating ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm mx-auto rounded-2xl" dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="text-[#4FC3F7] flex items-center gap-2">
              <FileText size={20} />
              {labels.ready}
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-500 text-center py-1">
            {pdfName}
          </p>

          {/* ── Direct email section ───────────────────────────────────── */}
          <div className="bg-blue-50 rounded-xl p-3 space-y-2">
            <p className="text-xs font-semibold text-[#0288D1] flex items-center gap-1">
              <Mail size={13} />
              {labels.emailSection}
            </p>
            <p className="text-xs text-gray-500">{labels.emailNote}</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder={labels.emailPlaceholder}
                value={emailInput}
                onChange={(e) => { setEmailInput(e.target.value); setEmailSent(false); }}
                className="flex-1 h-9 text-sm rounded-xl border-blue-200 focus:border-[#4FC3F7]"
                disabled={sendEmailMutation.isPending}
                onKeyDown={(e) => e.key === "Enter" && handleSendEmail()}
              />
              <Button
                onClick={handleSendEmail}
                disabled={sendEmailMutation.isPending || !emailInput.trim() || emailSent}
                className={`h-9 px-3 rounded-xl text-white flex items-center gap-1 text-xs ${
                  emailSent
                    ? "bg-green-500 hover:bg-green-500"
                    : "bg-[#0288D1] hover:bg-[#0277BD]"
                }`}
              >
                {sendEmailMutation.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : emailSent ? (
                  <><CheckCircle2 size={14} />{labels.emailSent}</>
                ) : (
                  <><Send size={14} />{labels.sendEmail}</>
                )}
              </Button>
            </div>
          </div>

          {/* ── Other sharing options ──────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <Button
              onClick={handleDownload}
              className="rounded-xl bg-gradient-to-r from-[#4FC3F7] to-[#29B6F6] text-white flex items-center gap-1 text-xs px-2"
            >
              <Download size={14} />
              {labels.download}
            </Button>

            <Button
              onClick={handleWhatsApp}
              className="rounded-xl bg-[#25D366] text-white flex items-center gap-1 hover:bg-[#1ebe57] text-xs px-2"
            >
              <WhatsAppIcon />
              WhatsApp
            </Button>

            <Button
              onClick={handleWebShare}
              variant="outline"
              className="rounded-xl flex items-center gap-1 text-xs px-2"
            >
              <Share2 size={14} />
              {labels.share}
            </Button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-1">
            {language === "ar"
              ? "هذا التقرير للمعلومات فقط وليس وثيقة طبية."
              : language === "fr"
              ? "Ce rapport est informatif uniquement, pas un document médical."
              : "This report is for informational purposes only, not a medical document."}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
