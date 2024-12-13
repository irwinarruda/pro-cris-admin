import { collection, query, getDocs, doc, orderBy, setDoc, deleteDoc, where } from 'firebase/firestore';
import { isAfter, startOfMonth, subMonths } from 'date-fns';
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

  public static async listAppointmentsByStudent(sudentId: string): Promise<Appointment[]> {
    if (!auth.currentUser) {
      throw { message: 'Usuário não autenticado' };
    }
    const appointmentsColl = collection(firestore, `users/${auth.currentUser.uid}/appointments`);
    const appointmentsSnp = await getDocs(
      query(appointmentsColl, orderBy('date', 'asc'), where('id_student', '==', sudentId)),
    );
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
    const deletedAppointments: Appointment[] = [];
    for (let i = ammountLeft; i < appointments.length - 1; i++) {
      deletedAppointments.push(appointments[i]);
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
    console.log(JSON.stringify(deletedAppointments));
    navigator.clipboard.writeText(JSON.stringify(deletedAppointments));
  }

  public static async leaveLastThreeMonths() {
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

    let date = new Date();
    date = subMonths(date, 2);
    const limitDate = startOfMonth(date);
    const deletedAppointments: Appointment[] = [];
    for (const appointment of appointments) {
      if (isAfter(appointment.date, limitDate)) continue;
      deletedAppointments.push(appointment);
      const appointmentsDoc = doc(firestore, `users/${auth.currentUser.uid}/appointments/${appointment.id}`);
      const oldAppointmentsDoc = doc(firestore, `users/${auth.currentUser.uid}/old_appointments/${appointment.id}`);
      const { id, ...oldAppointment } = appointment;
      try {
        await setDoc(oldAppointmentsDoc, oldAppointment);
        await deleteDoc(appointmentsDoc);
      } catch (err) {
        console.log('err', err);
      }
    }
    console.log(JSON.stringify(deletedAppointments));
    navigator.clipboard.writeText(JSON.stringify(deletedAppointments));
  }

  public static async deleteAppointments(appointments: Appointment[]) {
    if (!auth.currentUser) {
      throw new ProCrisError({ title: 'Usuário não autenticado', message: 'Faça login para continuar' });
    }
    const deletedAppointments: Appointment[] = [];
    for (const appointment of appointments) {
      deletedAppointments.push(appointment);
      const appointmentsDoc = doc(firestore, `users/${auth.currentUser.uid}/appointments/${appointment.id}`);
      const oldAppointmentsDoc = doc(firestore, `users/${auth.currentUser.uid}/old_appointments/${appointment.id}`);
      const { id, ...oldAppointment } = appointment;
      try {
        await setDoc(oldAppointmentsDoc, oldAppointment);
        await deleteDoc(appointmentsDoc);
      } catch (err) {
        console.log('err', err);
      }
    }
    console.log(JSON.stringify(deletedAppointments));
    navigator.clipboard.writeText(JSON.stringify(deletedAppointments));
  }
}
