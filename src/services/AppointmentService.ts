import { collection, query, getDocs, doc, orderBy, setDoc, deleteDoc } from 'firebase/firestore';
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
    const appointmentsSnp = await getDocs(query(appointmentsColl, orderBy('date', 'desc')));
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
    for (let i = ammountLeft; i < appointments.length - 1; i++) {
      const appointmentsDoc = doc(firestore, `users/${auth.currentUser.uid}/appointments/${appointments[i].id}`);
      const oldAppointmentsDoc = doc(firestore, `users/${auth.currentUser.uid}/old_appointments/${appointments[i].id}`);
      const { id, ...oldAppointment } = appointments[i];
      try {
        await setDoc(oldAppointmentsDoc, oldAppointment);
        await deleteDoc(appointmentsDoc);
      } catch (err) {
        console.log('err', err);
      }
    }
  }
}
