/**
 * ReportGenerator – generates a PDF summary report for the selected child
 * and offers sharing options (download, email, WhatsApp, Web Share API).
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAppContext } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Download, Mail, Share2, Loader2 } from "lucide-react";
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

  const labels = {
    btn: language === "ar" ? "تصدير تقرير PDF" : language === "fr" ? "Générer rapport PDF" : "Generate PDF Report",
    title: language === "ar" ? "تقرير صحة الطفل" : language === "fr" ? "Rapport de santé" : "Health Report",
    generating: language === "ar" ? "جاري إنشاء التقرير..." : language === "fr" ? "Génération en cours..." : "Generating report...",
    download: language === "ar" ? "تحميل" : language === "fr" ? "Télécharger" : "Download",
    email: "Email",
    whatsapp: "WhatsApp",
    share: language === "ar" ? "مشاركة" : language === "fr" ? "Partager" : "Share",
    ready: language === "ar" ? "التقرير جاهز!" : language === "fr" ? "Rapport prêt !" : "Report ready!",
    close: language === "ar" ? "إغلاق" : language === "fr" ? "Fermer" : "Close",
  };

  const generatePDF = async () => {
    if (!selectedChild) return;
    setGenerating(true);
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
          const foods = Array.isArray(m.foods) ? m.foods.join(", ") : m.foods ?? "";
          doc.text(`• ${date}  |  ${foods}`, margin, y);
          y += 5.5;
        });
      }
      y += 4;

      // ── Doctors ──────────────────────────────────────────────────────────
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(248, 187, 208); // #F8BBD0 – too light, use darker pink
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

  const handleEmail = () => {
    const subject = encodeURIComponent(`AlleNest Health Report – ${selectedChild?.name ?? ""}`);
    const body = encodeURIComponent("Please find the attached health report generated by AlleNest.");
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
    // Note: mailto: cannot attach files; user must download first then attach manually
    toast(language === "ar" ? "قم بتحميل الملف ثم أرفقه بالبريد الإلكتروني" : language === "fr" ? "Téléchargez le fichier puis joignez-le à l'email" : "Download the file then attach it to the email");
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
        <DialogContent className="max-w-xs mx-auto rounded-2xl" dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="text-[#4FC3F7] flex items-center gap-2">
              <FileText size={20} />
              {labels.ready}
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-500 text-center py-2">
            {pdfName}
          </p>

          <div className="grid grid-cols-2 gap-3 py-2">
            <Button
              onClick={handleDownload}
              className="rounded-xl bg-gradient-to-r from-[#4FC3F7] to-[#29B6F6] text-white flex items-center gap-2"
            >
              <Download size={16} />
              {labels.download}
            </Button>

            <Button
              onClick={handleEmail}
              variant="outline"
              className="rounded-xl flex items-center gap-2"
            >
              <Mail size={16} />
              {labels.email}
            </Button>

            <Button
              onClick={handleWhatsApp}
              className="rounded-xl bg-[#25D366] text-white flex items-center gap-2 hover:bg-[#1ebe57]"
            >
              <WhatsAppIcon />
              WhatsApp
            </Button>

            <Button
              onClick={handleWebShare}
              variant="outline"
              className="rounded-xl flex items-center gap-2"
            >
              <Share2 size={16} />
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
