import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
} from 'lucide-react';
import { CourseClass, CourseTask } from '../types';
import {
  addDaysISO,
  formatLongDateSpanish,
  formatWeekRangeSpanish,
  getTodayISO,
  getWeekDays,
} from '../utils/dateUtils';

interface CalendarViewProps {
  classes: CourseClass[];
  tasks: CourseTask[];
  onAddClassForDate: (dateISO: string) => void;
  onAddTaskForDate: (dateISO: string) => void;
  onEditClass: (cls: CourseClass) => void;
  onDeleteClass: (cls: CourseClass) => void;
  onEditTask: (task: CourseTask) => void;
  onDeleteTask: (task: CourseTask) => void;
  onToggleTaskStatus: (taskId: string) => void;
}

export function CalendarView({
  classes,
  tasks,
  onAddClassForDate,
  onAddTaskForDate,
  onEditClass,
  onDeleteClass,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
}: CalendarViewProps) {
  const today = getTodayISO();
  const [viewMode, setViewMode] = useState<'dia' | 'semana'>('dia');
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const weekDays = getWeekDays(selectedDate);
  const weekRangeLabel = formatWeekRangeSpanish(selectedDate);

  const goPrevWeek = () => setSelectedDate((prev) => addDaysISO(prev, -7));
  const goNextWeek = () => setSelectedDate((prev) => addDaysISO(prev, 7));
  const goToday = () => setSelectedDate(today);

  const classesForDate = (iso: string) =>
    classes
      .filter((c) => c.date === iso)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const tasksForDate = (iso: string) => tasks.filter((t) => t.dueDate === iso);

  const dayClasses = classesForDate(selectedDate);
  const dayTasks = tasksForDate(selectedDate);

  return (
    <div className="space-y-6">
      {/* Encabezado y selector Día / Semana */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Calendario de actividades</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-0.5 capitalize">
              {weekRangeLabel}
            </p>
          </div>

          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl sm:w-auto">
            <button
              type="button"
              onClick={() => setViewMode('dia')}
              className={`min-h-[44px] px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors whitespace-nowrap ${
                viewMode === 'dia'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vista por día
            </button>
            <button
              type="button"
              onClick={() => setViewMode('semana')}
              className={`min-h-[44px] px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors whitespace-nowrap ${
                viewMode === 'semana'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vista semanal
            </button>
          </div>
        </div>

        {/* Navegación de semana */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={goPrevWeek}
            aria-label="Semana anterior"
            className="min-h-[44px] px-3 sm:px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Semana anterior</span>
            <span className="sm:hidden">Anterior</span>
          </button>

          <button
            type="button"
            onClick={goToday}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-800 text-sm font-semibold hover:bg-blue-100 transition-colors whitespace-nowrap"
          >
            Ir a hoy
          </button>

          <button
            type="button"
            onClick={goNextWeek}
            aria-label="Semana siguiente"
            className="min-h-[44px] px-3 sm:px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
          >
            <span className="hidden sm:inline">Siguiente semana</span>
            <span className="sm:hidden">Siguiente</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Tira de días de la semana */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekDays.map((day) => {
            const count = classesForDate(day.iso).length + tasksForDate(day.iso).length;
            const isSelected = day.iso === selectedDate && viewMode === 'dia';
            const isToday = day.iso === today;

            return (
              <button
                key={day.iso}
                type="button"
                onClick={() => {
                  setSelectedDate(day.iso);
                  setViewMode('dia');
                }}
                className={`min-h-[64px] py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600'
                    : isToday
                    ? 'bg-blue-50 text-blue-900 border-blue-300'
                    : 'bg-slate-50 text-slate-800 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {day.weekdayShort}
                </span>
                <span className="text-base sm:text-lg font-bold tabular-nums leading-none">
                  {day.dayNumber}
                </span>
                <span
                  className={`text-[11px] font-medium tabular-nums ${
                    isSelected
                      ? 'text-blue-100'
                      : count > 0
                      ? 'text-blue-700'
                      : 'text-slate-400'
                  }`}
                >
                  {count > 0 ? `${count} act.` : '—'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Vista por día */}
      {viewMode === 'dia' ? (
        <section className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 capitalize">
                {formatLongDateSpanish(selectedDate)}
              </h2>
              <p className="text-sm text-slate-600 tabular-nums">
                {dayClasses.length} {dayClasses.length === 1 ? 'clase' : 'clases'} y{' '}
                {dayTasks.length} {dayTasks.length === 1 ? 'entrega' : 'entregas'} para este día
              </p>
            </div>

            <div className="grid grid-cols-2 sm:flex gap-2">
              <button
                type="button"
                onClick={() => onAddClassForDate(selectedDate)}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Nueva clase</span>
              </button>
              <button
                type="button"
                onClick={() => onAddTaskForDate(selectedDate)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva tarea</span>
              </button>
            </div>
          </div>

          {dayClasses.length === 0 && dayTasks.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-base font-medium text-slate-700">
                No hay actividades registradas para este día.
              </p>
              <p className="text-sm text-slate-500">
                Usa los botones de arriba para programar una clase o una entrega de tarea.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {dayClasses.map((cls) => (
                <div key={cls.id} className="p-5 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 tabular-nums">
                      <Clock className="w-4 h-4" />
                      <span>
                        Clase · {cls.startTime} – {cls.endTime}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                      {cls.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {cls.module} · {cls.instructor} · {cls.modality}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditClass(cls)}
                      className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 inline-flex items-center gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Editar clase</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteClass(cls)}
                      className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 text-red-700 text-sm font-semibold hover:bg-red-50 inline-flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}

              {dayTasks.map((task) => {
                const isDone = task.status === 'completada';
                return (
                  <div key={task.id} className="p-5 space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        {isDone ? (
                          <span className="text-emerald-700 inline-flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            Tarea completada
                          </span>
                        ) : (
                          <span className="text-amber-700 inline-flex items-center gap-1.5">
                            <Circle className="w-4 h-4" />
                            Entrega pendiente
                          </span>
                        )}
                        <span className="text-slate-400" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-slate-600 font-normal">{task.module}</span>
                      </div>
                      <h3
                        className={`text-base sm:text-lg font-semibold ${
                          isDone ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {task.name}
                      </h3>
                      <p className="text-sm text-slate-600">{task.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleTaskStatus(task.id)}
                        className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-2 ${
                          isDone
                            ? 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isDone ? 'Marcar pendiente' : 'Marcar completada'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditTask(task)}
                        className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 inline-flex items-center gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task)}
                        className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 text-red-700 text-sm font-semibold hover:bg-red-50 inline-flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        /* Vista semanal */
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weekDays.map((day) => {
            const cList = classesForDate(day.iso);
            const tList = tasksForDate(day.iso);
            const isToday = day.iso === today;

            return (
              <div
                key={day.iso}
                className={`bg-white rounded-2xl border p-5 space-y-3 ${
                  isToday ? 'border-blue-400' : 'border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {day.weekdayLong} {day.dayNumber} {day.monthShort}
                      {isToday ? ' · Hoy' : ''}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDate(day.iso);
                      setViewMode('dia');
                    }}
                    className="min-h-[40px] px-3 py-1.5 rounded-lg text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors whitespace-nowrap"
                  >
                    Ver día
                  </button>
                </div>

                {cList.length === 0 && tList.length === 0 ? (
                  <p className="text-sm text-slate-500 py-2">Sin actividades programadas.</p>
                ) : (
                  <ul className="space-y-3">
                    {cList.map((cls) => (
                      <li key={cls.id} className="space-y-1">
                        <p className="text-xs font-semibold text-blue-700 tabular-nums">
                          Clase · {cls.startTime} – {cls.endTime}
                        </p>
                        <p className="text-sm font-semibold text-slate-900">{cls.title}</p>
                        <p className="text-xs text-slate-600">{cls.module}</p>
                      </li>
                    ))}
                    {tList.map((task) => {
                      const isDone = task.status === 'completada';
                      return (
                        <li key={task.id} className="space-y-1">
                          <p
                            className={`text-xs font-semibold ${
                              isDone ? 'text-emerald-700' : 'text-amber-700'
                            }`}
                          >
                            {isDone ? 'Tarea completada' : 'Entrega de tarea'}
                          </p>
                          <p
                            className={`text-sm font-semibold ${
                              isDone ? 'line-through text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            {task.name}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
