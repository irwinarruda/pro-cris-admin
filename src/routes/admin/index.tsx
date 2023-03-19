import { createEffect, For } from 'solid-js';
import { AdjustmentsIcon } from '~/components/atoms/AdjustmentsIcon';
import { Button } from '~/components/atoms/Button';
import { TextField } from '~/components/molecules/TextField';
import { ProCrisHeader } from '~/components/organisms/ProCrisHeader';
import { useStudent } from '~/providers/Student';

export default function Admin() {
  const { filteredStudents, loading, textFilter, onTextFilterChange, getStudents } = useStudent();

  createEffect(() => {
    getStudents();
  });

  return (
    <>
      <ProCrisHeader />
      <div class="flex items-stretch justify-start max-w-7xl max-h-[calc(100vh-theme(space.16))] mx-auto p-6 overflow-hidden">
        <div class="flex flex-col w-1/2">
          <div class="flex">
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
                        Aluno: <span class="font-bold">{student.name}</span>
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
      </div>
    </>
  );
}
