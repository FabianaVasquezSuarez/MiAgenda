const MONTHS_SHORT = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

const MONTHS_LONG = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const WEEKDAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const WEEKDAYS_LONG = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function getTodayISO(): string {
  return toISODate(new Date());
}

export function addDaysISO(baseISO: string, days: number): string {
  const d = parseISODate(baseISO);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function formatShortDateSpanish(iso: string): string {
  if (!iso) return '';
  const d = parseISODate(iso);
  const weekday = WEEKDAYS_SHORT[d.getDay()];
  const day = d.getDate();
  const month = MONTHS_SHORT[d.getMonth()];
  return `${weekday} ${day} ${month}`;
}

export function formatLongDateSpanish(iso: string): string {
  if (!iso) return '';
  const d = parseISODate(iso);
  const weekday = WEEKDAYS_LONG[d.getDay()];
  const day = d.getDate();
  const month = MONTHS_LONG[d.getMonth()];
  return `${weekday}, ${day} de ${month}`;
}

export function formatRelativeDateLabel(iso: string, todayISO = getTodayISO()): string {
  if (iso === todayISO) return `Hoy · ${formatShortDateSpanish(iso)}`;
  if (iso === addDaysISO(todayISO, 1)) return `Mañana · ${formatShortDateSpanish(iso)}`;
  if (iso === addDaysISO(todayISO, -1)) return `Ayer · ${formatShortDateSpanish(iso)}`;
  return formatShortDateSpanish(iso);
}

export function isOverdue(dueDateISO: string, todayISO = getTodayISO()): boolean {
  return dueDateISO < todayISO;
}

/**
 * Returns the Monday..Sunday ISO dates for the week containing `referenceISO`.
 */
export function getWeekDays(referenceISO: string): {
  iso: string;
  weekdayShort: string;
  weekdayLong: string;
  dayNumber: number;
  monthShort: string;
}[] {
  const ref = parseISODate(referenceISO);
  const jsDay = ref.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  const diffToMonday = jsDay === 0 ? -6 : 1 - jsDay;
  const monday = new Date(ref);
  monday.setDate(ref.getDate() + diffToMonday);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      iso: toISODate(d),
      weekdayShort: WEEKDAYS_SHORT[d.getDay()],
      weekdayLong: WEEKDAYS_LONG[d.getDay()],
      dayNumber: d.getDate(),
      monthShort: MONTHS_SHORT[d.getMonth()],
    };
  });
}

export function formatWeekRangeSpanish(referenceISO: string): string {
  const days = getWeekDays(referenceISO);
  const first = days[0];
  const last = days[6];
  if (first.monthShort === last.monthShort) {
    return `Del ${first.dayNumber} al ${last.dayNumber} de ${MONTHS_LONG[parseISODate(last.iso).getMonth()]}`;
  }
  return `Del ${first.dayNumber} ${first.monthShort} al ${last.dayNumber} ${last.monthShort}`;
}
