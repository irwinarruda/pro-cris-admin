import { createEffect, createMemo, For } from 'solid-js';
import { format, isAfter } from 'date-fns';
import { AiFillMinusCircle, AiFillCheckCircle, AiFillCloseSquare } from 'solid-icons/ai';
import { AdjustmentsIcon } from '~/components/atoms/AdjustmentsIcon';
import { Button } from '~/components/atoms/Button';
import { TextField } from '~/components/molecules/TextField';
import { ProCrisHeader } from '~/components/organisms/ProCrisHeader';
import { useAppointment } from '~/providers/Appointment';
import { useStudent } from '~/providers/Student';
import { getEndDateByTime } from '~/utils/getEndDateByTime';
import { isBetweenDates } from '~/utils/isBetweenDates';

export default function Admin() {
  return (
    <>
      <ProCrisHeader />
      <ActionsList />
      <div class="flex gap-8 items-stretch justify-start max-w-7xl max-h-[calc(100vh-theme(space.16)-theme(space.16))] mx-auto px-6 pb-6 overflow-hidden">
        <AppointmentsList />
        <StudentsList />
      </div>
    </>
  );
}

function ActionsList() {
  const { loading, onLeaveLast100Appointments } = useAppointment();

  return (
    <div class="flex items-center justify-center max-w-7xl mx-auto h-16 px-6 overflow-hidden">
      <Button onClick={onLeaveLast100Appointments} disabled={loading()}>
        Deixar apenas últimas 100 aulas
      </Button>
    </div>
  );
}

function StudentsList() {
  const { filteredStudents, loading, textFilter, onTextFilterChange, getStudents } = useStudent();
  const { finishedAppointments, ammountToReceive } = useAppointment();

  createEffect(() => {
    getStudents();
  });

  return (
    <div class="flex flex-col w-1/2">
      <h2 class="text-black text-2xl font-semibold">
        Alunos{' '}
        <span class="text-md">
          | {finishedAppointments().length} aulas | {ammountToReceive().toLocaleString('pt-BR')} reais |{' '}
          {filteredStudents().length} alunos
        </span>
      </h2>
      <div class="flex mt-2">
        <TextField placeholder="Buscar aluno..." value={textFilter()} onChange={onTextFilterChange} />
        <Button class="ml-3" onClick={getStudents}>
          Refresh
        </Button>
      </div>
      <div class="flex-1 h-full mt-5 [&>div+div]:mt-2 overflow-auto">
        {loading() &&
          Array.from({ length: 8 }).map(() => <div class="w-full h-14 bg-gray-100 rounded-md animate-pulse" />)}
        <For each={filteredStudents()}>
          {student => (
            <div
              class="flex items-center justify-center h-14 px-4 rounded-md"
              style={{ 'background-color': student.color }}
            >
              <div class="flex flex-[1.5] items-center justify-start">
                <img class="w-10 rounded-full" src={student.avatar || '/emoji-placeholder.png'} />
                <div class="ml-2 overflow-hidden">
                  <p class="text-md truncate">
                    Aluno(a): <span class="font-bold">{student.name}</span>
                  </p>
                  <p class="text-sm truncate">
                    Responsável: <span class="font-bold">{student.phone}</span>
                  </p>
                </div>
              </div>
              <button class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-500 hover:bg-opacity-50 focus:bg-gray-500 focus:bg-opacity-50 focus:shadow-solid focus:shadow-gray-500">
                <AdjustmentsIcon class="w-5" />
              </button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
const AppointmentStatus = {
  ongoing: { icon: AiFillMinusCircle, text: 'Andamento' },
  finished: { icon: AiFillCheckCircle, text: 'Finalizada' },
  undone: { icon: AiFillCloseSquare, text: 'Restantes' },
};

function checkDateStatus(date: Date, dateBegin: Date, dateEnd: Date): keyof typeof AppointmentStatus {
  if (
    isBetweenDates(date, {
      start: dateBegin,
      end: dateEnd,
    })
  ) {
    return 'ongoing';
  } else if (isAfter(date, dateBegin)) {
    return 'finished';
  } else {
    return 'undone';
  }
}

function AppointmentsList() {
  const { appointments, filteredAppointments, getAppointments, loading, dateTextFilter, onDateFilterChange } =
    useAppointment();
  const { students } = useStudent();
  const appointmentWithStudent = createMemo(() => {
    return filteredAppointments().map(appointment => ({
      ...appointment,
      student: students().find(s => s.id === appointment.id_student),
    }));
  });

  createEffect(() => {
    getAppointments();
  });

  return (
    <div class="flex flex-col w-1/2">
      <h2 class="text-black text-2xl font-semibold">
        Rotina <span class="text-md">| {appointments().length} aulas</span>
      </h2>
      <div class="flex mt-2">
        <TextField type="date" value={dateTextFilter()} onChange={onDateFilterChange} />
        <Button class="ml-3" onClick={getAppointments}>
          Refresh
        </Button>
      </div>
      <div class="flex-1 h-full mt-5 [&>div+div]:mt-2 overflow-auto">
        {loading() &&
          Array.from({ length: 8 }).map(() => <div class="w-full h-14 bg-gray-100 rounded-md animate-pulse" />)}
        <For each={appointmentWithStudent()}>
          {appointment => {
            const dateBegin = appointment.date || new Date();
            const dateEnd = getEndDateByTime(appointment.date || new Date(), appointment.cost.time);
            const Icon = AppointmentStatus[checkDateStatus(new Date(), dateBegin, dateEnd)].icon;
            const text = AppointmentStatus[checkDateStatus(new Date(), dateBegin, dateEnd)].text;
            return (
              <div class="flex items-center">
                <div class="flex flex-col flex-[0.15] items-center">
                  <p class="text-black text-md font-semibold">{format(dateBegin, 'HH:mm')}</p>
                  <div class="w-3 h-0.5 bg-black rounded-full" />
                  <p class="text-black text-sm font-semibold">{format(dateEnd, 'HH:mm')}</p>
                </div>
                <div
                  class="flex-1 flex items-center justify-center h-14 px-4 rounded-md"
                  style={{ 'background-color': appointment.student?.color }}
                >
                  <div class="flex flex-[1.5] items-center justify-start">
                    <img class="w-10 rounded-full" src={appointment.student?.avatar || '/emoji-placeholder.png'} />
                    <div class="ml-2 overflow-hidden">
                      <p class="text-md truncate">
                        Aluno(a): <span class="font-bold">{appointment.student?.name}</span>
                      </p>
                      <p class="text-sm truncate">
                        Observation:{' '}
                        <span class="font-bold">{appointment.student?.observation || 'Sem observação'}</span>
                      </p>
                    </div>
                  </div>
                  <div class="flex flex-col items-center justify-center flex-[0.05]">
                    <Icon class="w-5 h-5 text-black" />
                    <p class="text-black text-xs">{text}</p>
                  </div>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
