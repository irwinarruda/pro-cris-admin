import { isSameDay, formatISO, parseISO, isPast } from 'date-fns';
import { Accessor, createContext, createMemo, createSignal, JSX, useContext } from 'solid-js';
import Swal from 'sweetalert2';
import { Appointment } from '~/entities/Appointment';
import { AppointmentService } from '~/services/AppointmentService';

export type AppointmentContextProps = {
  appointments: Accessor<Appointment[]>;
  filteredAppointments: Accessor<Appointment[]>;
  finishedAppointments: Accessor<Appointment[]>;
  ammountToReceive: Accessor<number>;
  dateFilter: Accessor<Date>;
  dateTextFilter: Accessor<string>;
  loading: Accessor<boolean>;
  onLeaveLastAppointments: (ammount: number) => Promise<void>;
  onLeaveLastThreeMonths: () => Promise<void>;
  getAppointments: () => Promise<void>;
  onDateFilterChange: (v: string) => void;
};

export const AppointmentContext = createContext({} as AppointmentContextProps);

export const AppointmentProvider = (props: { children: JSX.Element }) => {
  const [appointments, setAppointments] = createSignal<Appointment[]>([]);
  const [dateTextFilter, setDateTextFilter] = createSignal(formatISO(new Date()).split('T')[0]);
  const [loading, setLoading] = createSignal(false);
  const dateFilter = createMemo(() => {
    try {
      return parseISO(dateTextFilter());
    } catch (_) {
      return new Date(-8640000000000000);
    }
  });
  const filteredAppointments = createMemo(() => {
    return appointments().filter(appointment => isSameDay(appointment.date, dateFilter()));
  });
  const finishedAppointments = createMemo(() => {
    return appointments().filter(
      appointment => !appointment.is_cancelled && !appointment.is_paid && isPast(appointment.date),
    );
  });
  const ammountToReceive = createMemo(() => {
    return finishedAppointments().reduce((previous, current) => {
      return previous + Number(current.cost.price.replace('R$', ''));
    }, 0);
  });

  const value = {
    appointments,
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
    async onLeaveLastAppointments(ammount: number) {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        html: `Deseja mesmo deixar apenas as últimas ${ammount} aulas visíveis?`,
        confirmButtonText: 'Excluir',
        confirmButtonColor: '#EE584F',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        reverseButtons: true,
      });
      if (!isConfirmed) return;
      setLoading(true);
      setAppointments([]);
      await AppointmentService.leaveLastAppointments(ammount);
      const a = await AppointmentService.getAppointments();
      setAppointments(a);
      setLoading(false);
    },
    async onLeaveLastThreeMonths() {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        html: `Deseja mesmo deixar apenas os últimos 3 messes?`,
        confirmButtonText: 'Excluir',
        confirmButtonColor: '#EE584F',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        reverseButtons: true,
      });
      if (!isConfirmed) return;
      setLoading(true);
      setAppointments([]);
      await AppointmentService.leaveLastThreeMonths();
      const a = await AppointmentService.getAppointments();
      setAppointments(a);
      setLoading(false);
    },
    onDateFilterChange(v: string) {
      setDateTextFilter(v);
    },
  };
  return <AppointmentContext.Provider value={value}>{props.children}</AppointmentContext.Provider>;
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  return context;
};
