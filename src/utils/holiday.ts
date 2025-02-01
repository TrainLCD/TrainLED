import dayjs from 'dayjs';
import { NATIONAL_HOLIDAYS } from '../constants';

export const isHoliday = (): boolean => {
  const now = dayjs();
  const isNationalHoliday = NATIONAL_HOLIDAYS.some((ev) => {
    const eventDay = dayjs(ev.date);
    return now.isSame(eventDay, 'month') && now.isSame(eventDay, 'date');
  });
  const isWeekend = now.day() === 0 || now.day() === 6;

  return isWeekend || isNationalHoliday;
};
