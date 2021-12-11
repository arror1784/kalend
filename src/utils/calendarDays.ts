/* tslint:disable:no-magic-numbers */
import { CALENDAR_NAVIGATION_DIRECTION, CALENDAR_VIEW } from '../common/enums';
import { CalendarDay } from '../common/interface';
import { DateTime } from 'luxon';
import { getArrayEnd, getArrayStart } from './common';
import LuxonHelper from './luxonHelper';

const ONE_DAY = 1;
const THREE_DAYS = 3;
const SEVEN_DAYS = 7;
export const CALENDAR_OFFSET_LEFT = 24;

export const formatIsoStringDate = (stringDate: string) =>
  stringDate.slice(0, stringDate.indexOf('T'));

export const hoursArray = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24,
];

export const hoursArrayString = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
];

export const calendarColors: any = {
  red: { dark: '#ef9a9a', light: '#e53935' },
  pink: { dark: '#f48fb1', light: '#d81b60' },
  purple: { dark: '#ce93d8', light: '#8e24aa' },
  'deep purple': { dark: '#b39ddb', light: '#5e35b1' },
  indigo: { dark: '#9fa8da', light: '#3949ab' },
  blue: { dark: '#90caf9', light: '#1e88e5' },
  'light blue': { dark: '#81d4fa', light: '#039be5' },
  cyan: { dark: '#80deea', light: '#00acc1' },
  teal: { dark: '#80cbc4', light: '#00897b' },
  green: { dark: '#a5d6a7', light: '#43a047' },
  'light green': { dark: '#c5e1a5', light: '#7cb342' },
  yellow: { dark: '#fff59d', light: '#fdd835' },
  amber: { dark: '#ffe082', light: '#ffb300' },
  orange: { dark: '#ffcc80', light: '#fb8c00' },
  'deep orange': { dark: '#ffab91', light: '#f4511e' },
  brown: { dark: '#bcaaa4', light: '#6d4c41' },
  'blue grey': { dark: '#b0bec5', light: '#546e7a' },
};

export const parseEventColor = (
  colorString: string,
  isDark?: boolean
): string =>
  calendarColors[colorString]
    ? calendarColors[colorString][isDark ? 'dark' : 'light']
    : colorString;

export const daysText = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const calculateOneDay = (date: DateTime): DateTime => {
  return date;
};

export const destructCalendarDayID = (
  calendarDay: CalendarDay
): { day: DateTime; count: number } => {
  const array: string[] = calendarDay.id.split('_');

  return {
    day: DateTime.fromISO(array[0]),
    count: Number(array[1]),
  };
};

export const incrementCalendarDayID = (
  calendarDay: CalendarDay
): CalendarDay => {
  const destructedCalendarDay = destructCalendarDayID(calendarDay);
  return {
    id: `${calendarDay.date}_${destructedCalendarDay.count + 1}`,
    date: calendarDay.date,
  };
};

export const initCalendarDays = (dates: DateTime[]): CalendarDay[] =>
  dates.map((date: DateTime) => ({
    id: `${date.toString()}_1`,
    date,
  }));

export const getWeekDays = (
  date: DateTime,
  calendarView: CALENDAR_VIEW,
  setSelectedDate?: any
): CalendarDay[] => {
  // Set state
  if (setSelectedDate && calendarView !== CALENDAR_VIEW.MONTH) {
    setSelectedDate(date);
  }

  const days = [];
  const dayInWeek = date.weekday;
  const startDate = date.minus({ days: dayInWeek - 1 });

  if (calendarView === CALENDAR_VIEW.MONTH) {
    if (dayInWeek === 0) {
      for (let i = 6; i > 0; i--) {
        days.push(date.minus({ days: i }));
      }
      days.push(date);
    } else {
      days.push(startDate);
      for (let i = 1; i < 7; i++) {
        days.push(startDate.plus({ days: i }));
      }
    }
  } else {
    for (let i = 0; i < 7; i++) {
      days.push(startDate.plus({ days: i }));
    }
  }

  return initCalendarDays(days);
};

export const getThreeDays = (
  date: DateTime,
  setSelectedDate: any,
  isGoingForward?: boolean | null
): CalendarDay[] => {
  const days = [];

  if (isGoingForward === null || isGoingForward === undefined) {
    for (let i = 0; i <= 2; i++) {
      days.push(date.plus({ days: i }));
    }
  } else if (isGoingForward) {
    for (let i = 1; i <= 3; i++) {
      days.push(date.plus({ days: i }));
    }
  } else {
    for (let i = 3; i > 0; i--) {
      days.push(date.minus({ days: i }));
    }
  }

  // Set state
  if (setSelectedDate) {
    setSelectedDate(days[1]);
  }

  return initCalendarDays(days);
};

export const getDaysNum = (calendarView: CALENDAR_VIEW): number => {
  switch (calendarView) {
    case CALENDAR_VIEW.WEEK:
      return SEVEN_DAYS;
    case CALENDAR_VIEW.THREE_DAYS:
      return THREE_DAYS;
    case CALENDAR_VIEW.DAY:
      return ONE_DAY;
    default:
      return SEVEN_DAYS;
  }
};

const getOneDay = (date: DateTime, setSelectedDate: any): CalendarDay[] => {
  const refDate: DateTime = calculateOneDay(date);

  // Set state
  if (setSelectedDate) {
    setSelectedDate(refDate);
  }

  return initCalendarDays([refDate]);
};

export const calculateAgendaDays = (refDate: DateTime): DateTime[] => {
  const firstDayInMonth: DateTime = LuxonHelper.getFirstDayOfMonth(refDate);
  const daysInMonth: number = refDate.daysInMonth;
  const monthDays: DateTime[] = [];

  // Add missing days to month view
  for (let i = 0; i <= daysInMonth; i += 1) {
    const day: DateTime = firstDayInMonth.plus({ days: i });
    monthDays.push(day);
  }

  return monthDays;
};

export const calculateMonthDays = (date: DateTime): CalendarDay[] => {
  const FIVE_WEEKS_DAYS_COUNT = 36;
  // Get reference date for calculating new month

  // Get first week of current month
  const firstDayOfCurrentMonth: DateTime = LuxonHelper.getFirstDayOfMonth(date);

  const firstWeekOfCurrentMonth: CalendarDay[] = getWeekDays(
    firstDayOfCurrentMonth,
    CALENDAR_VIEW.WEEK,
    undefined
  );

  const monthDays: DateTime[] = firstWeekOfCurrentMonth.map(
    (item) => item.date
  );

  // Add missing days to month view
  for (let i = 1; i < FIVE_WEEKS_DAYS_COUNT; i += 1) {
    const day: DateTime = firstWeekOfCurrentMonth[6].date.plus({ days: i });
    monthDays.push(day);
  }

  return initCalendarDays(monthDays);
};

export const getAgendaDays = (
  date: DateTime,
  setSelectedDate: any
): CalendarDay[] => {
  const monthDays: DateTime[] = calculateAgendaDays(date);

  // Set state
  if (setSelectedDate) {
    setSelectedDate(monthDays[15]);
  }

  return initCalendarDays(monthDays);
};

export const getMonthDays = (date: DateTime, setSelectedDate: any) => {
  const monthDays: CalendarDay[] = calculateMonthDays(date);

  // Set state
  if (setSelectedDate) {
    setSelectedDate(monthDays[15].date);
  }

  return monthDays;
};

// TODO dark theme support for parsing colors
// export const mapCalendarColors = (calendars: any) => {
//   const result: any = {};
//   for (const calendar of calendars) {
//     result[calendar.id] = {
//       color: {
//         light: calendar.color.light,
//         dark: calendar.color.dark,
//       },
//     };
//   }
//
//   return result;
// };

export const parseToDate = (item: string | DateTime): DateTime =>
  typeof item === 'string' ? DateTime.fromISO(item) : item;

export const parseDateToString = (item: string | DateTime): string =>
  typeof item === 'string' ? item : item.toString();

export const checkIfSwipingForward = (
  oldIndex: number,
  newIndex: number
): boolean =>
  (oldIndex === 0 && newIndex === 1) ||
  (oldIndex === 1 && newIndex === 2) ||
  (oldIndex === 2 && newIndex === 0);

export const chooseSelectedDateIndex = (
  calendarView: CALENDAR_VIEW
): number => {
  switch (calendarView) {
    case CALENDAR_VIEW.MONTH:
      return 15;
    case CALENDAR_VIEW.AGENDA:
      return 15;
    case CALENDAR_VIEW.WEEK:
      return 2;
    case CALENDAR_VIEW.THREE_DAYS:
      return 0;
    case CALENDAR_VIEW.DAY:
      return 0;
    default:
      return 2;
  }
};

export const getCalendarDays = (
  calendarView: CALENDAR_VIEW,
  date: DateTime,
  setSelectedDate?: any
): CalendarDay[] => {
  switch (calendarView) {
    case CALENDAR_VIEW.WEEK:
      return getWeekDays(date, calendarView, setSelectedDate);
    case CALENDAR_VIEW.THREE_DAYS:
      return getThreeDays(date, setSelectedDate);
    case CALENDAR_VIEW.DAY:
      return getOneDay(date, setSelectedDate);
    case CALENDAR_VIEW.MONTH:
      return getMonthDays(date, setSelectedDate);
    case CALENDAR_VIEW.AGENDA:
      return getAgendaDays(date, setSelectedDate);
    default:
      return getWeekDays(date, calendarView, setSelectedDate);
  }
};

const getReferenceDate = (
  direction: CALENDAR_NAVIGATION_DIRECTION,
  calendarView: CALENDAR_VIEW,
  calendarDays: CalendarDay[]
): DateTime => {
  if (direction === CALENDAR_NAVIGATION_DIRECTION.TODAY) {
    return DateTime.now();
  }

  if (calendarView === CALENDAR_VIEW.THREE_DAYS) {
    if (direction === CALENDAR_NAVIGATION_DIRECTION.FORWARD) {
      return getArrayEnd(calendarDays).date.plus({ days: 1 });
    } else {
      return getArrayStart(calendarDays).date.minus({ days: 3 });
    }
  }

  if (
    calendarView === CALENDAR_VIEW.WEEK ||
    calendarView === CALENDAR_VIEW.DAY
  ) {
    if (direction === CALENDAR_NAVIGATION_DIRECTION.FORWARD) {
      return getArrayEnd(calendarDays).date.plus({ days: 1 });
    } else {
      return getArrayStart(calendarDays).date.minus({ days: 1 });
    }
  }

  if (
    calendarView === CALENDAR_VIEW.MONTH ||
    calendarView === CALENDAR_VIEW.AGENDA
  ) {
    if (direction === CALENDAR_NAVIGATION_DIRECTION.FORWARD) {
      return calendarDays[15].date.plus({ months: 1 });
    } else {
      return calendarDays[15].date.minus({ months: 1 });
    }
  }

  return DateTime.now();
};

export const calculateCalendarDays = (
  direction: CALENDAR_NAVIGATION_DIRECTION,
  calendarDays: CalendarDay[],
  calendarView: CALENDAR_VIEW,
  setSelectedDate: any
): CalendarDay[] => {
  return getCalendarDays(
    calendarView,
    getReferenceDate(direction, calendarView, calendarDays),
    setSelectedDate
  );
};
