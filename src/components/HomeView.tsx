import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Pencil,
  Plus,
  Trash2,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { CourseClass, CourseTask, TabId } from '../types';
import {
  formatLongDateSpanish,
  formatRelativeDateLabel,
  getTodayISO,
  isOverdue,
} from '../utils/dateUtils';

interface HomeViewProps {
  classes: CourseClass[];
  tasks: CourseTask[];
  onNavigate: (tab: TabId) => void;
  onAddClass: () => void;
  onEditClass: (cls: CourseClass) => void;
  onDeleteClass: (cls: CourseClass) => void;
  onAddTask: () => void;
  onToggleTaskStatus: (taskId: string) => void;
  onEditTask: (task: CourseTask) => void;
  onDeleteTask: (task: CourseTask) => void;
}

export function HomeView({
  classes,
  tasks,
  onNavigate,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onAddTask,
  onToggleTaskStatus,
  onEditTask,
  onDeleteTask,
}: HomeViewProps) {
  const today = getTodayISO();

  const upcomingClasses = [...classes]
    .filter((c) => c.date >= today)
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
    .slice(0, 4);

  const pendingTasks = [...tasks]
    .filter((t) => t.status === 'pendiente')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const completedCount = tasks.filter((t) => t.status === 'completada').length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Resumen superior */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-700 capitalize">
              {formatLongDateSpanish(today)}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 text-balance">
              Curso de Google AI Studio
            </h1>
            <p className="text-base text-slate-600 mt-1.5 tabular-nums">
              Tienes {upcomingClasses.length}{' '}
              {upcomingClasses.length === 1 ? 'clase próxima' : 'clases próximas'} y{' '}
              {pendingTasks.length}{' '}
              {pendingTasks.length === 1 ? 'tarea pendiente' : 'tareas pendientes'} · Avance:{' '}
              {progressPercent}%
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onAddClass}
              className="min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm sm:text-base font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Agregar clase</span>
            </button>
            <button
              type="button"
              onClick={onAddTask}
              className="min-h-[48px] px-4 py-3 rounded-xl bg-blue-600 text-white text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5 shrink-0" />
              <span>Agregar tarea</span>
            </button>
          </div>
        </div>
      </section>

      {/* Columnas principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Próximas clases */}
        <section className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Próximas clases</h2>
              <p className="text-sm text-slate-500">Sesiones programadas desde hoy</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('calendario')}
              className="min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>Ver calendario</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {upcomingClasses.length === 0 ? (
            <div className="p-6 text-center space-y-3">
              <p className="text-base text-slate-600">
                No tienes clases próximas programadas.
              </p>
              <button
                type="button"
                onClick={onAddClass}
                className="min-h-[48px] px-5 py-3 rounded-xl bg-slate-900 text-white text-base font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Programar una clase</span>
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {upcomingClasses.map((cls) => (
                <li key={cls.id} className="p-5 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-700 tabular-nums">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>{formatRelativeDateLabel(cls.date, today)}</span>
                      <span aria-hidden="true">·</span>
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>
                        {cls.startTime} – {cls.endTime}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                      {cls.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {cls.module} · {cls.instructor} · {cls.modality}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onEditClass(cls)}
                      className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteClass(cls)}
                      className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 bg-white text-red-700 text-sm font-semibold hover:bg-red-50 transition-colors inline-flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Tareas pendientes */}
        <section className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tareas pendientes</h2>
              <p className="text-sm text-slate-500">Actividades por entregar</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('tareas')}
              className="min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="p-6 text-center space-y-3">
              <p className="text-base font-medium text-emerald-700">
                ¡Excelente! No tienes tareas pendientes en este momento.
              </p>
              <button
                type="button"
                onClick={onAddTask}
                className="min-h-[48px] px-5 py-3 rounded-xl bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Agregar nueva tarea</span>
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {pendingTasks.slice(0, 5).map((task) => {
                const overdue = isOverdue(task.dueDate, today);
                return (
                  <li key={task.id} className="p-5 space-y-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-sm tabular-nums">
                        <span
                          className={`font-semibold ${
                            overdue ? 'text-red-700' : 'text-amber-700'
                          }`}
                        >
                          {overdue
                            ? `Vencida · ${formatRelativeDateLabel(task.dueDate, today)}`
                            : `Entrega: ${formatRelativeDateLabel(task.dueDate, today)}`}
                        </span>
                        <span aria-hidden="true" className="text-slate-400">
                          ·
                        </span>
                        <span className="text-slate-600">{task.module}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                        {task.name}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {task.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onToggleTaskStatus(task.id)}
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Marcar completada</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditTask(task)}
                        className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task)}
                        className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 bg-white text-red-700 text-sm font-semibold hover:bg-red-50 transition-colors inline-flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {pendingTasks.length > 5 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/70">
              <button
                type="button"
                onClick={() => onNavigate('tareas')}
                className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Circle className="w-4 h-4 text-blue-600" />
                <span>Ver las {pendingTasks.length} tareas pendientes</span>
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
