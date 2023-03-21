import { isSameDay, formatISO, parseISO, isPast } from 'date-fns';
import { Accessor, createContext, createMemo, createSignal, JSX, useContext } from 'solid-js';
import { Appointment } from '~/entities/Appointment';
import { AppointmentService } from '~/services/AppointmentService';

export type AppointmentContextProps = {
  appointment: Accessor<Appointment[]>;
  filteredAppointments: Accessor<Appointment[]>;
  finishedAppointments: Accessor<Appointment[]>;
  ammountToReceive: Accessor<number>;
  dateFilter: Accessor<Date>;
  dateTextFilter: Accessor<string>;
  loading: Accessor<boolean>;
  onLeaveLast100Appointments: () => Promise<void>;
  getAppointments: () => Promise<void>;
  onDateFilterChange: (v: string) => void;
};

export const AppointmentContext = createContext({} as AppointmentContextProps);

export const AppointmentProvider = (props: { children: JSX.Element }) => {
  const [appointment, setAppointments] = createSignal<Appointment[]>([]);
  const [dateFilter, setDateFilter] = createSignal(new Date());
  const [loading, setLoading] = createSignal(false);
  const dateTextFilter = createMemo(() => {
    return formatISO(dateFilter()).split('T')[0];
  });
  const filteredAppointments = createMemo(() => {
    return appointment().filter(appointment => isSameDay(appointment.date, dateFilter()));
  });
  const finishedAppointments = createMemo(() => {
    return appointment().filter(
      appointment => !appointment.is_cancelled && !appointment.is_paid && isPast(appointment.date),
    );
  });
  const ammountToReceive = createMemo(() => {
    return finishedAppointments().reduce((previous, current) => {
      return previous + Number(current.cost.price.replace('R$', ''));
    }, 0);
  });

  const value = {
    appointment,
    filteredAppointments,
    finishedAppointments,
    ammountToReceive,
    dateFilter,
    dateTextFilter,
    loading,
    async getAppointments() {
      setLoading(true);
      setAppointments([]);
      const a = await AppointmentService.getAppointments();
      setAppointments(a);
      setLoading(false);
    },
    async onLeaveLast100Appointments() {
      await AppointmentService.leaveLastAppointments(100);
    },
    onDateFilterChange(v: string) {
      setDateFilter(parseISO(v));
    },
  };
  return <AppointmentContext.Provider value={value}>{props.children}</AppointmentContext.Provider>;
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  return context;
};
