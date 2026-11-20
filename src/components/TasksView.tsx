import React, { useState } from 'react';
import { CheckCircle2, Circle, Pencil, Plus, Trash2, Calendar } from 'lucide-react';
import { CourseTask } from '../types';
import { formatRelativeDateLabel, getTodayISO, isOverdue } from '../utils/dateUtils';

interface TasksViewProps {
  tasks: CourseTask[];
  onAddTask: () => void;
  onToggleTaskStatus: (taskId: string) => void;
  onEditTask: (task: CourseTask) => void;
  onDeleteTask: (task: CourseTask) => void;
}

type TaskFilter = 'todas' | 'pendientes' | 'completadas';

export function TasksView({
  tasks,
  onAddTask,
  onToggleTaskStatus,
  onEditTask,
  onDeleteTask,
}: TasksViewProps) {
  const [filter, setFilter] = useState<TaskFilter>('todas');
  const today = getTodayISO();

  const pendingCount = tasks.filter((t) => t.status === 'pendiente').length;
  const completedCount = tasks.filter((t) => t.status === 'completada').length;

  const filteredTasks = [...tasks]
    .filter((t) => {
      if (filter === 'pendientes') return t.status === 'pendiente';
      if (filter === 'completadas') return t.status === 'completada';
      return true;
    })
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === 'pendiente' ? -1 : 1;
      return a.dueDate.localeCompare(b.dueDate);
    });

  return (
    <div className="space-y-6">
      {/* Encabezado y botón principal */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tareas del curso</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-0.5 tabular-nums">
              {pendingCount} {pendingCount === 1 ? 'pendiente' : 'pendientes'} ·{' '}
              {completedCount} {completedCount === 1 ? 'completada' : 'completadas'}
            </p>
          </div>

          <button
            type="button"
            onClick={onAddTask}
            className="min-h-[48px] px-5 py-3 rounded-xl bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Agregar nueva tarea</span>
          </button>
        </div>

        {/* Filtros por estado */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setFilter('todas')}
            className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap tabular-nums ${
              filter === 'todas'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pendientes')}
            className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap tabular-nums ${
              filter === 'pendientes'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completadas')}
            className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap tabular-nums ${
              filter === 'completadas'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completadas ({completedCount})
          </button>
        </div>
      </section>

      {/* Lista de tareas */}
      {filteredTasks.length === 0 ? (
        <section className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3">
          <p className="text-base font-medium text-slate-700">
            {filter === 'pendientes'
              ? 'No tienes tareas pendientes en este momento.'
              : filter === 'completadas'
              ? 'Todavía no has marcado ninguna tarea como completada.'
              : 'Aún no has creado ninguna tarea.'}
          </p>
          <button
            type="button"
            onClick={onAddTask}
            className="min-h-[48px] px-5 py-3 rounded-xl bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Crear primera tarea</span>
          </button>
        </section>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const isDone = task.status === 'completada';
            const overdue = !isDone && isOverdue(task.dueDate, today);

            return (
              <article
                key={task.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  {/* Estado y fecha de entrega como texto limpio */}
                  <div className="flex flex-wrap items-center gap-2 text-sm tabular-nums">
                    {isDone ? (
                      <span className="font-semibold text-emerald-700 inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        Completada
                      </span>
                    ) : (
                      <span
                        className={`font-semibold inline-flex items-center gap-1.5 ${
                          overdue ? 'text-red-700' : 'text-amber-700'
                        }`}
                      >
                        <Circle className="w-4 h-4 shrink-0" />
                        {overdue ? 'Pendiente (vencida)' : 'Pendiente'}
                      </span>
                    )}
                    <span className="text-slate-400" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-slate-600 inline-flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      Entrega: {formatRelativeDateLabel(task.dueDate, today)}
                    </span>
                  </div>

                  <h2
                    className={`text-lg font-bold ${
                      isDone ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}
                  >
                    {task.name}
                  </h2>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {task.description}
                  </p>

                  <p className="text-xs sm:text-sm font-medium text-slate-500 pt-1">
                    {task.module}
                  </p>
                </div>

                {/* Botones grandes de acción */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleTaskStatus(task.id)}
                    className={`min-h-[46px] flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap ${
                      isDone
                        ? 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{isDone ? 'Marcar pendiente' : 'Marcar completada'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onEditTask(task)}
                    className="min-h-[46px] px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-4 h-4 shrink-0" />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteTask(task)}
                    className="min-h-[46px] px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-red-700 text-sm font-semibold hover:bg-red-50 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4 shrink-0" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
