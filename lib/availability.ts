export const WEEKDAY_LABELS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const DEFAULT_BUSINESS_HOURS = [
  { weekday: 0, is_closed: true, open_time: '09:00', close_time: '17:00' },
  { weekday: 1, is_closed: false, open_time: '09:00', close_time: '18:00' },
  { weekday: 2, is_closed: false, open_time: '09:00', close_time: '18:00' },
  { weekday: 3, is_closed: false, open_time: '09:00', close_time: '18:00' },
  { weekday: 4, is_closed: false, open_time: '09:00', close_time: '18:00' },
  { weekday: 5, is_closed: false, open_time: '09:00', close_time: '18:00' },
  { weekday: 6, is_closed: false, open_time: '10:00', close_time: '16:00' },
];

export type BusinessHourRow = {
  weekday: number;
  is_closed: boolean;
  open_time: string;
  close_time: string;
};

export function timeToMinutes(value: string | null | undefined) {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const match = value.trim().match(/^(\d{2}):(\d{2})$/);
  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

export function formatTimeDisplay(value: string) {
  const minutes = timeToMinutes(value);
  if (minutes === null) {
    return '--:--';
  }

  const hours24 = Math.floor(minutes / 60);
  const mins = String(minutes % 60).padStart(2, '0');
  const suffix = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${mins} ${suffix}`;
}

export function normalizeBusinessHours(rows: BusinessHourRow[] | null | undefined) {
  const map = new Map<number, BusinessHourRow>();

  (rows || []).forEach((row) => {
    if (typeof row.weekday !== 'number') {
      return;
    }

    map.set(row.weekday, {
      weekday: row.weekday,
      is_closed: Boolean(row.is_closed),
      open_time: row.open_time || '09:00',
      close_time: row.close_time || '17:00',
    });
  });

  return DEFAULT_BUSINESS_HOURS.map((defaultRow) => map.get(defaultRow.weekday) || defaultRow);
}
