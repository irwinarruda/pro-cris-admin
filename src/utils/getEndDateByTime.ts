import { addHours, addMinutes } from 'date-fns';

export function getEndDateByTime(dateStart: Date, time: string): Date {
  const [hour, minute] = time.split(':').map(value => Number(value));
  const dateEnd = addMinutes(addHours(dateStart, hour), minute);
  return dateEnd;
}
