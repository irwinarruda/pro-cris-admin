import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { Appointment } from '~/entities/Appointment';
import { ProCrisError } from '~/entities/ProCrisError';

import { firestore, auth } from './firebaseConfig';

export class AppointmentService {
  public static async getAppointments() {
    if (!auth.currentUser) {
      throw new ProCrisError({ title: 'Usuário não autenticado', message: 'Faça login para continuar' });
    }
    const appointmentsColl = collection(firestore, `users/${auth.currentUser.uid}/appointments`);
    const appointmentsSnp = await getDocs(query(appointmentsColl, orderBy('date', 'asc')));

    const appointments = [] as Appointment[];
    for (let doc of appointmentsSnp.docs) {
      const data = doc.data();
      const obj = {
        ...data,
        id: doc.id,
        date: data.date.toDate(),
      } as Appointment;
      appointments.push(obj);
    }
    return appointments;
  }
  public static async leaveLastAppointments(ammountLeft: number) {
    if (!auth.currentUser) {
      throw new ProCrisError({ title: 'Usuário não autenticado', message: 'Faça login para continuar' });
    }
    const appointmentsColl = collection(firestore, `users/${auth.currentUser.uid}/appointments`);
    const appointmentsSnp = await getDocs(query(appointmentsColl, orderBy('date', 'asc')));
    const appointments = [] as Appointment[];
    for (let doc of appointmentsSnp.docs) {
      const data = doc.data();
      const obj = {
        ...data,
        id: doc.id,
        date: data.date.toDate(),
      } as Appointment;
      appointments.push(obj);
    }
    console.log('appointments', appointments);
    console.log('appointmentsLength', appointments.length);
    const appointmentsToDelete = [] as Appointment[];
    for (let i = ammountLeft; i < appointments.length - 1; i++) {
      appointmentsToDelete.push(appointments[i]);
    }
    console.log('appointmentsToDelete ', appointmentsToDelete);
    console.log('appointmentsToDeleteLength', appointmentsToDelete.length);
  }
}
