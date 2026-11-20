import React from 'react';
import { CheckCircle2, Circle, RotateCcw } from 'lucide-react';
import { COURSE_MODULES, CourseClass, CourseNote, CourseTask } from '../types';
import { formatShortDateSpanish } from '../utils/dateUtils';

interface ProgressViewProps {
  tasks: CourseTask[];
  classes: CourseClass[];
  notes: CourseNote[];
  onToggleTaskStatus: (taskId: string) => void;
  onRequestResetSampleData: () => void;
}

export function ProgressView({
  tasks,
  classes,
  notes,
  onToggleTaskStatus,
  onRequestResetSampleData,
}: ProgressViewProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completada');
  const pendingTasks = tasks.filter((t) => t.status === 'pendiente');
  const percentage = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Tarjeta principal de resumen */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Anillo visual de progreso */}
          <div className="flex items-center gap-5">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 108 108" aria-hidden="true">
                <circle
                  cx="54"
                  cy="54"
                  r={radius}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                />
                <circle
                  cx="54"
                  cy="54"
                  r={radius}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              </svg>
              <span className="absolute text-xl font-bold text-slate-900 tabular-nums">
                {percentage}%
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">Tu progreso</h1>
              <p className="text-base text-slate-600 mt-1 tabular-nums">
                Has completado {completedTasks.length} de {totalTasks}{' '}
                {totalTasks === 1 ? 'tarea' : 'tareas'}.
              </p>
            </div>
          </div>

          {/* Métricas clave */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <p className="text-sm font-medium text-slate-600">Completadas</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
                {completedTasks.length}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <p className="text-sm font-medium text-slate-600">Pendientes</p>
              <p className="text-2xl font-bold text-amber-700 mt-1 tabular-nums">
                {pendingTasks.length}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <p className="text-sm font-medium text-slate-600">Clases</p>
              <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                {classes.length}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <p className="text-sm font-medium text-slate-600">Notas</p>
              <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                {notes.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Progreso por módulo del curso */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Avance por tema del curso</h2>
        <div className="space-y-4">
          {COURSE_MODULES.map((mod) => {
            const modTasks = tasks.filter((t) => t.module === mod);
            const modDone = modTasks.filter((t) => t.status === 'completada').length;
            const modPct =
              modTasks.length > 0 ? Math.round((modDone / modTasks.length) * 100) : 0;

            return (
              <div key={mod} className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-sm sm:text-base">
                  <span className="font-semibold text-slate-800">{mod}</span>
                  <span className="text-slate-600 tabular-nums shrink-0">
                    {modDone}/{modTasks.length} tareas · {modPct}%
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${modPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Detalle de tareas pendientes y completadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 tabular-nums">
              Tareas pendientes ({pendingTasks.length})
            </h2>
          </div>

          {pendingTasks.length === 0 ? (
            <p className="p-5 text-base text-slate-600">
              No quedan tareas pendientes por completar.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {pendingTasks.map((task) => (
                <li key={task.id} className="p-4 sm:p-5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-slate-900 truncate">{task.name}</p>
                    <p className="text-sm text-slate-500 tabular-nums">
                      Entrega: {formatShortDateSpanish(task.dueDate)} · {task.module}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleTaskStatus(task.id)}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <Circle className="w-4 h-4" />
                    <span>Completar</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 tabular-nums">
              Tareas completadas ({completedTasks.length})
            </h2>
          </div>

          {completedTasks.length === 0 ? (
            <p className="p-5 text-base text-slate-600">
              Aún no has completado ninguna tarea.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {completedTasks.map((task) => (
                <li key={task.id} className="p-4 sm:p-5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-slate-600 line-through truncate">
                      {task.name}
                    </p>
                    <p className="text-sm text-slate-500 tabular-nums">
                      {task.module} · {formatShortDateSpanish(task.dueDate)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleTaskStatus(task.id)}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Reabrir</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Opción para restaurar datos iniciales */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Datos de ejemplo del curso</h2>
          <p className="text-sm text-slate-600">
            Si editaste o borraste información y quieres volver al ejemplo inicial, puedes
            restaurarlo aquí.
          </p>
        </div>
        <button
          type="button"
          onClick={onRequestResetSampleData}
          className="min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restaurar datos de ejemplo</span>
        </button>
      </section>
    </div>
  );
}
