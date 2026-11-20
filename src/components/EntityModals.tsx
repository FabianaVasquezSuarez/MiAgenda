import React, { useState, useEffect } from 'react';
import {
  COURSE_MODULES,
  CourseClass,
  CourseModule,
  CourseNote,
  CourseTask,
  TaskStatus,
} from '../types';
import { getTodayISO } from '../utils/dateUtils';
import { BottomSheetModal } from './BottomSheetModal';

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialClass: CourseClass | null;
  defaultDate?: string;
  onSave: (data: Omit<CourseClass, 'id'>, existingId?: string) => void;
}

export function ClassFormModal({
  isOpen,
  onClose,
  initialClass,
  defaultDate,
  onSave,
}: ClassFormModalProps) {
  const [title, setTitle] = useState('');
  const [module, setModule] = useState<CourseModule>(COURSE_MODULES[0]);
  const [date, setDate] = useState(getTodayISO());
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('19:30');
  const [instructor, setInstructor] = useState('Prof. Laura Mendoza');
  const [modality, setModality] = useState('En vivo · Sala Virtual');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (initialClass) {
      setTitle(initialClass.title);
      setModule(initialClass.module);
      setDate(initialClass.date);
      setStartTime(initialClass.startTime);
      setEndTime(initialClass.endTime);
      setInstructor(initialClass.instructor);
      setModality(initialClass.modality);
    } else {
      setTitle('');
      setModule(COURSE_MODULES[0]);
      setDate(defaultDate || getTodayISO());
      setStartTime('18:00');
      setEndTime('19:30');
      setInstructor('Prof. Laura Mendoza');
      setModality('En vivo · Sala Virtual');
    }
    setError('');
  }, [isOpen, initialClass, defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor escribe el nombre de la clase.');
      return;
    }
    if (!date) {
      setError('Selecciona una fecha para la clase.');
      return;
    }
    onSave(
      {
        title: title.trim(),
        module,
        date,
        startTime: startTime || '18:00',
        endTime: endTime || '19:30',
        instructor: instructor.trim() || 'Por confirmar',
        modality: modality.trim() || 'En vivo',
      },
      initialClass?.id
    );
    onClose();
  };

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialClass ? 'Editar clase' : 'Nueva clase'}
      footer={
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-base font-medium hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="class-form"
            className="min-h-[48px] px-4 py-3 rounded-xl bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition-colors"
          >
            {initialClass ? 'Guardar cambios' : 'Guardar clase'}
          </button>
        </div>
      }
    >
      <form id="class-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm font-medium text-red-800">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="class-title" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Nombre de la clase
          </label>
          <input
            id="class-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Taller de Prompts en Google AI Studio"
            className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>

        <div>
          <label htmlFor="class-module" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Tema o módulo del curso
          </label>
          <select
            id="class-module"
            value={module}
            onChange={(e) => setModule(e.target.value as CourseModule)}
            className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          >
            {COURSE_MODULES.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="class-date" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Fecha
          </label>
          <input
            id="class-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-base text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="class-start" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Hora de inicio
            </label>
            <input
              id="class-start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-base text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>
          <div>
            <label htmlFor="class-end" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Hora de fin
            </label>
            <input
              id="class-end"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-base text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="class-instructor" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Docente
            </label>
            <input
              id="class-instructor"
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="Ej. Prof. Laura Mendoza"
              className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>
          <div>
            <label htmlFor="class-modality" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Modalidad
            </label>
            <input
              id="class-modality"
              type="text"
              value={modality}
              onChange={(e) => setModality(e.target.value)}
              placeholder="Ej. En vivo · Sala Virtual"
              className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>
        </div>
      </form>
    </BottomSheetModal>
  );
}

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask: CourseTask | null;
  defaultDate?: string;
  onSave: (data: Omit<CourseTask, 'id'>, existingId?: string) => void;
}

export function TaskFormModal({
  isOpen,
  onClose,
  initialTask,
  defaultDate,
  onSave,
}: TaskFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTodayISO());
  const [status, setStatus] = useState<TaskStatus>('pendiente');
  const [module, setModule] = useState<CourseModule>(COURSE_MODULES[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (initialTask) {
      setName(initialTask.name);
      setDescription(initialTask.description);
      setDueDate(initialTask.dueDate);
      setStatus(initialTask.status);
      setModule(initialTask.module);
    } else {
      setName('');
      setDescription('');
      setDueDate(defaultDate || getTodayISO());
      setStatus('pendiente');
      setModule(COURSE_MODULES[0]);
    }
    setError('');
  }, [isOpen, initialTask, defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor escribe el nombre de la tarea.');
      return;
    }
    if (!dueDate) {
      setError('Selecciona una fecha de entrega.');
      return;
    }
    onSave(
      {
        name: name.trim(),
        description: description.trim() || 'Sin descripción adicional.',
        dueDate,
        status,
        module,
      },
      initialTask?.id
    );
    onClose();
  };

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialTask ? 'Editar tarea' : 'Nueva tarea'}
      footer={
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-base font-medium hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="task-form"
            className="min-h-[48px] px-4 py-3 rounded-xl bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition-colors"
          >
            {initialTask ? 'Guardar cambios' : 'Guardar tarea'}
          </button>
        </div>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm font-medium text-red-800">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="task-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Nombre de la tarea
          </label>
          <input
            id="task-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Probar System Instructions en AI Studio"
            className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>

        <div>
          <label htmlFor="task-desc" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Descripción
          </label>
          <textarea
            id="task-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explica brevemente qué debes practicar o entregar..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="task-due" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Fecha de entrega
            </label>
            <input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-base text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div>
            <label htmlFor="task-module" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Módulo del curso
            </label>
            <select
              id="task-module"
              value={module}
              onChange={(e) => setModule(e.target.value as CourseModule)}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            >
              {COURSE_MODULES.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <span className="block text-sm font-semibold text-slate-800 mb-1.5">Estado actual</span>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setStatus('pendiente')}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                status === 'pendiente'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pendiente
            </button>
            <button
              type="button"
              onClick={() => setStatus('completada')}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                status === 'completada'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completada
            </button>
          </div>
        </div>
      </form>
    </BottomSheetModal>
  );
}

interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNote: CourseNote | null;
  onSave: (data: Omit<CourseNote, 'id' | 'updatedAt'>, existingId?: string) => void;
}

export function NoteFormModal({ isOpen, onClose, initialNote, onSave }: NoteFormModalProps) {
  const [title, setTitle] = useState('');
  const [module, setModule] = useState<CourseModule>(COURSE_MODULES[0]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (initialNote) {
      setTitle(initialNote.title);
      setModule(initialNote.module);
      setContent(initialNote.content);
    } else {
      setTitle('');
      setModule(COURSE_MODULES[0]);
      setContent('');
    }
    setError('');
  }, [isOpen, initialNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Escribe un título para tu nota.');
      return;
    }
    if (!content.trim()) {
      setError('Escribe el contenido de tu apunte.');
      return;
    }
    onSave(
      {
        title: title.trim(),
        module,
        content: content.trim(),
      },
      initialNote?.id
    );
    onClose();
  };

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialNote ? 'Editar apunte' : 'Nuevo apunte'}
      footer={
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-base font-medium hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="note-form"
            className="min-h-[48px] px-4 py-3 rounded-xl bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition-colors"
          >
            {initialNote ? 'Guardar cambios' : 'Guardar nota'}
          </button>
        </div>
      }
    >
      <form id="note-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm font-medium text-red-800">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="note-title" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Título del apunte
          </label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Ideas clave sobre System Instructions"
            className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>

        <div>
          <label htmlFor="note-module" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Tema del curso
          </label>
          <select
            id="note-module"
            value={module}
            onChange={(e) => setModule(e.target.value as CourseModule)}
            className="w-full min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          >
            {COURSE_MODULES.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="note-content" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Apuntes
          </label>
          <textarea
            id="note-content"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe aquí tus resúmenes, ejemplos de prompts o recordatorios de clase..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-base text-slate-900 leading-relaxed placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 resize-y"
          />
        </div>
      </form>
    </BottomSheetModal>
  );
}
