export type TabId = 'inicio' | 'calendario' | 'tareas' | 'notas' | 'progreso';

export type CourseModule =
  | 'Módulo 1: Fundamentos'
  | 'Módulo 2: Ingeniería de Prompts'
  | 'Módulo 3: Multimodal'
  | 'Módulo 4: API y Código';

export const COURSE_MODULES: CourseModule[] = [
  'Módulo 1: Fundamentos',
  'Módulo 2: Ingeniería de Prompts',
  'Módulo 3: Multimodal',
  'Módulo 4: API y Código',
];

export interface CourseClass {
  id: string;
  title: string;
  module: CourseModule;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  instructor: string;
  modality: string;
}

export type TaskStatus = 'pendiente' | 'completada';

export interface CourseTask {
  id: string;
  name: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  module: CourseModule;
}

export interface CourseNote {
  id: string;
  title: string;
  module: CourseModule;
  content: string;
  updatedAt: string; // YYYY-MM-DD
}

export interface AgendaState {
  classes: CourseClass[];
  tasks: CourseTask[];
  notes: CourseNote[];
}
