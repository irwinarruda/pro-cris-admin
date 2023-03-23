import { getDocs, orderBy, query, collection } from 'firebase/firestore';

import { Appointment } from '~/entities/Appointment';
import { Cost } from '~/entities/Cost';
import { ProCrisError } from '~/entities/ProCrisError';
import { Schedule } from '~/entities/Schedule';
import { Student } from '~/entities/Student';
import { auth, firestore } from './firebaseConfig';

type GetStudentsParams = {
  costs?: boolean;
  schedules?: boolean;
  appointments?: boolean;
};

export class StudentService {
  public static async getStudents(args?: GetStudentsParams) {
    const params = args || {
      appointments: false,
      costs: false,
      schedules: false,
    };
    if (!auth.currentUser) {
      throw new ProCrisError({ title: 'Usuário não autenticado', message: 'Faça login para continuar' });
    }
    const studentColl = collection(firestore, `users/${auth.currentUser.uid}/students`);
    const students = [] as Student[];
    const studentSnp = await getDocs(query(studentColl, orderBy('name', 'desc')));
    for (let doc of studentSnp.docs) {
      const obj = {
        id: doc.id,
        ...doc.data(),
      } as Student;
      if (params.appointments) {
        const appointmentsColl = collection(firestore, `${doc.ref.path}/appointments`);
        const appointmentsSnp = await getDocs(appointmentsColl);
        obj.appointments = appointmentsSnp.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      }
      if (params.schedules) {
        const schedulesColl = collection(firestore, `${doc.ref.path}/schedules`);
        const schedulesSnp = await getDocs(schedulesColl);
        obj.schedules = schedulesSnp.docs.map(doc => ({ id: doc.id, ...doc.data() } as Schedule));
      }
      if (params.costs) {
        const costsColl = collection(firestore, `${doc.ref.path}/costs`);
        const costsSnp = await getDocs(costsColl);
        obj.costs = costsSnp.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cost));
      }
      students.push(obj);
    }
    return students;
  }
}
