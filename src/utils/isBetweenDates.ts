export function isBetweenDates(date: Date, { start, end }: { start: Date; end: Date }): boolean {
  if (date >= start && date <= end) {
    return true;
  }
  return false;
}
