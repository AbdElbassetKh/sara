/**
 * DatePicker – sélecteur de date custom (jour / mois / année)
 * Remplace les <input type="date"> natifs du navigateur.
 * Accepte une valeur ISO YYYY-MM-DD et renvoie le même format.
 */
import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DatePickerProps {
  value: string;           // YYYY-MM-DD
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  /** Afficher ou non le sélecteur de jour (false pour mois/année seulement) */
  showDay?: boolean;
  /** Année minimale (défaut : année courante - 120) */
  minYear?: number;
  /** Année maximale (défaut : année courante) */
  maxYear?: number;
}

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

function getMonths(language: string) {
  if (language === 'ar') return MONTHS_AR;
  if (language === 'en') return MONTHS_EN;
  return MONTHS_FR;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export default function DatePicker({
  value,
  onChange,
  label,
  className = '',
  showDay = true,
  minYear,
  maxYear,
}: DatePickerProps) {
  const { language } = useLanguage();
  const months = getMonths(language);
  const currentYear = new Date().getFullYear();
  const yearMin = minYear ?? currentYear - 120;
  const yearMax = maxYear ?? currentYear;

  // Parse current value
  const [yearStr, monthStr, dayStr] = (value || '').split('-');
  const selectedYear = parseInt(yearStr) || currentYear;
  const selectedMonth = parseInt(monthStr) || 1; // 1-based
  const selectedDay = parseInt(dayStr) || 1;

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = yearMax; y >= yearMin; y--) arr.push(y);
    return arr;
  }, [yearMin, yearMax]);

  const days = useMemo(() => {
    const count = daysInMonth(selectedYear, selectedMonth);
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [selectedYear, selectedMonth]);

  const selectClass =
    'flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 ' +
    'focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 ' +
    'appearance-none cursor-pointer transition-all ' +
    'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'%236B7280\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z\' clip-rule=\'evenodd\' /%3E%3C/svg%3E")] ' +
    'bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.25rem] pr-8';

  function handleYear(e: React.ChangeEvent<HTMLSelectElement>) {
    const y = parseInt(e.target.value);
    const maxDay = daysInMonth(y, selectedMonth);
    const d = Math.min(selectedDay, maxDay);
    onChange(`${y}-${String(selectedMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  }

  function handleMonth(e: React.ChangeEvent<HTMLSelectElement>) {
    const m = parseInt(e.target.value);
    const maxDay = daysInMonth(selectedYear, m);
    const d = Math.min(selectedDay, maxDay);
    onChange(`${selectedYear}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  }

  function handleDay(e: React.ChangeEvent<HTMLSelectElement>) {
    const d = parseInt(e.target.value);
    onChange(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
      )}
      <div className="flex gap-2">
        {showDay && (
          <select value={selectedDay} onChange={handleDay} className={selectClass} style={{ minWidth: 0 }}>
            {days.map((d) => (
              <option key={d} value={d}>{String(d).padStart(2, '0')}</option>
            ))}
          </select>
        )}
        <select value={selectedMonth} onChange={handleMonth} className={selectClass} style={{ minWidth: 0, flex: showDay ? 2 : 1 }}>
          {months.map((m, i) => (
            <option key={i + 1} value={i + 1}>{m}</option>
          ))}
        </select>
        <select value={selectedYear} onChange={handleYear} className={selectClass} style={{ minWidth: 0 }}>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
