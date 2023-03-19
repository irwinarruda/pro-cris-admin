import { Accessor, createContext, createMemo, createSignal, JSX, useContext } from 'solid-js';
import { Student } from '~/entities/Student';
import { StudentService } from '~/services/StudentService';

export type StudentContextProps = {
  students: Accessor<Student[]>;
  loading: Accessor<boolean>;
  textFilter: Accessor<string>;
  filteredStudents: Accessor<Student[]>;
  getStudents: () => Promise<void>;
  onTextFilterChange: (v: string) => void;
};

export const StudentContext = createContext({} as StudentContextProps);

export const StudentProvider = (props: { children: JSX.Element }) => {
  const [students, setStudents] = createSignal<Student[]>([]);
  const [textFilter, setTextFilter] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const filteredStudents = createMemo(() => {
    return students().filter(s => s.name.toLowerCase().includes(textFilter().toLowerCase()));
  });
  const value = {
    students,
    loading,
    textFilter,
    filteredStudents,
    async getStudents() {
      setLoading(true);
      setStudents([]);
      const s = await StudentService.getStudents();
      setStudents(s);
      setLoading(false);
    },
    onTextFilterChange(v: string) {
      setTextFilter(v);
    },
  };
  return <StudentContext.Provider value={value}>{props.children}</StudentContext.Provider>;
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  return context;
};
