import { Accessor, createContext, createSignal, JSX, useContext } from 'solid-js';
import { Appointment } from '~/entities/Appointment';
import { AppointmentService } from '~/services/AppointmentService';

export type AppointmentContextProps = {
  appointment: Accessor<Appointment[]>;
  getAppointments: () => Promise<void>;
};

export const AppointmentContext = createContext({} as AppointmentContextProps);

export const AppointmentProvider = (props: { children: JSX.Element }) => {
  const [appointment, setAppointments] = createSignal<Appointment[]>([]);
  const value = {
    appointment,
    async getAppointments() {
      const s = await AppointmentService.getAppointments();
      setAppointments(s);
    },
  };
  return <AppointmentContext.Provider value={value}>{props.children}</AppointmentContext.Provider>;
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  return context;
};
