class WeekDays {
  public static enum = {
    Monday: '1',
    Tuesday: '2',
    Wednesday: '3',
    Thursday: '4',
    Friday: '5',
    Saturday: '6',
    Sunday: '0',
  };
  private static labels = {
    [this.enum.Monday]: 'Segunda',
    [this.enum.Tuesday]: 'Terça',
    [this.enum.Wednesday]: 'Quarta',
    [this.enum.Thursday]: 'Quinta',
    [this.enum.Friday]: 'Sexta',
    [this.enum.Saturday]: 'Sábado',
    [this.enum.Sunday]: 'Domingo',
  };
  public static getLabel(day: keyof typeof this.enum & string) {
    return this.labels[day];
  }
}

export { WeekDays };
