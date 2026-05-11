import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Crown, CreditCard, Smartphone, CheckCircle, Clock, XCircle, ArrowLeft, Copy } from "lucide-react";
import { Link } from "wouter";

const PLANS = {
  monthly: { price: 500, days: 30 },
  yearly: { price: 4000, days: 365 },
};

const t = {
  ar: {
    title: "الاشتراك المميز",
    subtitle: "احصل على وصول كامل لجميع الميزات",
    monthly: "شهري",
    yearly: "سنوي",
    monthlyPrice: "500 دج / شهر",
    yearlyPrice: "4000 دج / سنة",
    savingsLabel: "وفر 33%",
    choosePlan: "اختر الخطة",
    paymentMethod: "طريقة الدفع",
    ccp: "CCP",
    baridimob: "BaridiMob",
    ccpInstructions: "تعليمات الدفع عبر CCP",
    baridimobInstructions: "تعليمات الدفع عبر BaridiMob",
    ccpNumber: "رقم CCP",
    ccpKey: "المفتاح",
    recipient: "اسم المستفيد",
    baridimobNumber: "رقم BaridiMob",
    transactionRef: "رقم المرجع / الإيصال",
    transactionRefPlaceholder: "أدخل رقم الإيصال بعد الدفع",
    submit: "إرسال طلب الاشتراك",
    submitting: "جارٍ الإرسال...",
    history: "سجل المعاملات",
    date: "التاريخ",
    amount: "المبلغ",
    type: "النوع",
    status: "الحالة",
    pending: "قيد المراجعة",
    completed: "مكتمل",
    failed: "مرفوض",
    refunded: "مسترجع",
    noHistory: "لا توجد معاملات بعد",
    premiumActive: "اشتراكك المميز نشط",
    premiumExpiry: "صالح حتى",
    premiumFeatures: "الميزات المتاحة",
    feature1: "تحليل الذكاء الاصطناعي غير محدود",
    feature2: "محادثة الذكاء الاصطناعي",
    feature3: "تقارير PDF متقدمة",
    feature4: "تنبيهات الحساسية الفورية",
    copied: "تم النسخ!",
    back: "رجوع",
    required: "مطلوب",
    successMsg: "تم إرسال طلبك بنجاح! سيتم مراجعته خلال 24 ساعة.",
  },
  fr: {
    title: "Abonnement Premium",
    subtitle: "Accès complet à toutes les fonctionnalités",
    monthly: "Mensuel",
    yearly: "Annuel",
    monthlyPrice: "500 DA / mois",
    yearlyPrice: "4 000 DA / an",
    savingsLabel: "Économisez 33%",
    choosePlan: "Choisissez votre formule",
    paymentMethod: "Mode de paiement",
    ccp: "CCP",
    baridimob: "BaridiMob",
    ccpInstructions: "Instructions de paiement CCP",
    baridimobInstructions: "Instructions de paiement BaridiMob",
    ccpNumber: "Numéro CCP",
    ccpKey: "Clé",
    recipient: "Nom du destinataire",
    baridimobNumber: "Numéro BaridiMob",
    transactionRef: "Référence / N° de reçu",
    transactionRefPlaceholder: "Entrez le numéro de reçu après paiement",
    submit: "Soumettre la demande",
    submitting: "Envoi en cours...",
    history: "Historique des transactions",
    date: "Date",
    amount: "Montant",
    type: "Type",
    status: "Statut",
    pending: "En attente",
    completed: "Validé ✅",
    failed: "Rejeté ❌",
    refunded: "Remboursé",
    noHistory: "Aucune transaction pour le moment",
    premiumActive: "Votre abonnement Premium est actif",
    premiumExpiry: "Valable jusqu'au",
    premiumFeatures: "Fonctionnalités incluses",
    feature1: "Analyses IA illimitées",
    feature2: "Chat IA",
    feature3: "Rapports PDF avancés",
    feature4: "Alertes allergènes instantanées",
    copied: "Copié !",
    back: "Retour",
    required: "Requis",
    successMsg: "Votre demande a été soumise ! Elle sera examinée sous 24h.",
  },
  en: {
    title: "Premium Subscription",
    subtitle: "Full access to all features",
    monthly: "Monthly",
    yearly: "Yearly",
    monthlyPrice: "500 DA / month",
    yearlyPrice: "4,000 DA / year",
    savingsLabel: "Save 33%",
    choosePlan: "Choose your plan",
    paymentMethod: "Payment method",
    ccp: "CCP",
    baridimob: "BaridiMob",
    ccpInstructions: "CCP Payment Instructions",
    baridimobInstructions: "BaridiMob Payment Instructions",
    ccpNumber: "CCP Number",
    ccpKey: "Key",
    recipient: "Recipient name",
    baridimobNumber: "BaridiMob Number",
    transactionRef: "Reference / Receipt number",
    transactionRefPlaceholder: "Enter receipt number after payment",
    submit: "Submit subscription request",
    submitting: "Submitting...",
    history: "Transaction history",
    date: "Date",
    amount: "Amount",
    type: "Type",
    status: "Status",
    pending: "Pending review",
    completed: "Validated ✅",
    failed: "Rejected ❌",
    refunded: "Refunded",
    noHistory: "No transactions yet",
    premiumActive: "Your Premium subscription is active",
    premiumExpiry: "Valid until",
    premiumFeatures: "Included features",
    feature1: "Unlimited AI analyses",
    feature2: "AI Chat",
    feature3: "Advanced PDF reports",
    feature4: "Instant allergen alerts",
    copied: "Copied!",
    back: "Back",
    required: "Required",
    successMsg: "Your request has been submitted! It will be reviewed within 24h.",
  },
};

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text).then(() => {
    toast.success(label);
  });
}

export default function Subscription() {
  const { language } = useLanguage();
  const lang = t[language as keyof typeof t] || t.fr;
  const isRtl = language === "ar";

  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");
  const [paymentMethod, setPaymentMethod] = useState<"ccp" | "baridimob">("ccp");
  const [transactionRef, setTransactionRef] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data: status, isLoading: statusLoading } = trpc.subscriptions.getStatus.useQuery();
  const { data: history, isLoading: historyLoading } = trpc.subscriptions.listHistory.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.subscriptions.create.useMutation({
    onSuccess: (data) => {
      toast.success(lang.successMsg);
      setSubmitted(true);
      setTransactionRef("");
      utils.subscriptions.getStatus.invalidate();
      utils.subscriptions.listHistory.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = () => {
    if (!transactionRef.trim()) {
      toast.error(lang.required);
      return;
    }
    createMutation.mutate({ plan, paymentMethod, transactionRef: transactionRef.trim() });
  };

  const formatStatus = (s: string) => {
    switch (s) {
      case "pending": return lang.pending;
      case "completed": return lang.completed;
      case "failed": return lang.failed;
      case "refunded": return lang.refunded;
      default: return s;
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "pending": return "text-amber-600 bg-amber-50";
      case "completed": return "text-green-600 bg-green-50";
      case "failed": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4FC3F7] to-[#F8BBD0] px-4 pt-10 pb-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/settings">
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-300" />
              {lang.title}
            </h1>
            <p className="text-white/80 text-sm">{lang.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Premium Active Banner */}
        {!statusLoading && status?.isPremium && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8" />
              <div>
                <p className="font-bold text-lg">{lang.premiumActive}</p>
                {status.premiumUntil && (
                  <p className="text-white/90 text-sm">
                    {lang.premiumExpiry}: {new Date(status.premiumUntil).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[lang.feature1, lang.feature2, lang.feature3, lang.feature4].map((f) => (
                <div key={f} className="flex items-center gap-1 text-sm">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Banner */}
        {!statusLoading && status?.status === "pending" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <Clock className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <p className="text-amber-700 text-sm font-medium">{lang.pending} — {lang.successMsg}</p>
          </div>
        )}

        {/* Plan Selection */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-3">{lang.choosePlan}</h2>
          <div className="grid grid-cols-2 gap-3">
            {(["monthly", "yearly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlan(p)}
                className={`relative rounded-xl border-2 p-4 text-center transition-all ${
                  plan === p
                    ? "border-[#4FC3F7] bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                {p === "yearly" && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {lang.savingsLabel}
                  </span>
                )}
                <p className="font-bold text-gray-800">{lang[p]}</p>
                <p className="text-[#4FC3F7] font-semibold text-sm mt-1">
                  {p === "monthly" ? lang.monthlyPrice : lang.yearlyPrice}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-3">{lang.paymentMethod}</h2>
          <div className="grid grid-cols-2 gap-3">
            {(["ccp", "baridimob"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setPaymentMethod(m)}
                className={`rounded-xl border-2 p-3 flex items-center gap-2 transition-all ${
                  paymentMethod === m
                    ? "border-[#F8BBD0] bg-pink-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                {m === "ccp" ? (
                  <CreditCard className="w-5 h-5 text-[#4FC3F7]" />
                ) : (
                  <Smartphone className="w-5 h-5 text-[#F8BBD0]" />
                )}
                <span className="font-semibold text-gray-700">{lang[m]}</span>
              </button>
            ))}
          </div>

          {/* Payment Instructions */}
          <div className="mt-4 bg-gray-50 rounded-xl p-4 space-y-2">
            <p className="font-semibold text-gray-700 text-sm">
              {paymentMethod === "ccp" ? lang.ccpInstructions : lang.baridimobInstructions}
            </p>
            {paymentMethod === "ccp" ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">{lang.ccpNumber}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-800">002 123456 78</span>
                    <button
                      onClick={() => copyToClipboard("002 123456 78", lang.copied)}
                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">{lang.ccpKey}</span>
                  <span className="font-mono font-bold text-gray-800">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">{lang.recipient}</span>
                  <span className="font-bold text-gray-800">SARL AlleNest Services</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">{lang.baridimobNumber}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-800">0550 12 34 56</span>
                    <button
                      onClick={() => copyToClipboard("0550 12 34 56", lang.copied)}
                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">{lang.recipient}</span>
                  <span className="font-bold text-gray-800">AlleNest</span>
                </div>
              </>
            )}
            <div className="pt-1 border-t border-gray-200">
              <p className="text-[#4FC3F7] font-bold text-center text-lg">
                {PLANS[plan].price.toLocaleString()} DA
              </p>
            </div>
          </div>
        </div>

        {/* Transaction Reference */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block font-bold text-gray-800 mb-2">
            {lang.transactionRef} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={transactionRef}
            onChange={(e) => setTransactionRef(e.target.value)}
            placeholder={lang.transactionRefPlaceholder}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4FC3F7] transition-all"
          />
          <button
            onClick={handleSubmit}
            disabled={createMutation.isPending || !transactionRef.trim()}
            className="mt-3 w-full bg-gradient-to-r from-[#4FC3F7] to-[#F8BBD0] text-white font-bold py-3 rounded-xl disabled:opacity-50 transition-all hover:shadow-md active:scale-95"
          >
            {createMutation.isPending ? lang.submitting : lang.submit}
          </button>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#4FC3F7]" />
            {lang.history}
          </h2>
          {historyLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !history || history.length === 0 ? (
            <p className="text-gray-400 text-center py-4 text-sm">{lang.noHistory}</p>
          ) : (
            <div className="space-y-2">
              {history.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {tx.amount.toLocaleString()} {tx.currency}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(tx.createdAt).toLocaleDateString()} · {tx.paymentMethod?.toUpperCase()}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor(tx.status)}`}
                  >
                    {formatStatus(tx.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
