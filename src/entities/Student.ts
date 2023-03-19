import { Cost } from '~/entities/Cost';
import { Schedule } from '~/entities/Schedule';
import { Appointment } from '~/entities/Appointment';

interface Student {
  id: string;
  name: string;
  name_caregiver: string;
  phone: string;
  avatar: string;
  date_of_birth: string;
  address: string;
  map_location: string;
  observation: string;
  color: string;
  is_deleted: boolean;
  schedules: Schedule[];
  costs: Cost[];
  appointments: Appointment[];
}

export type { Student };
