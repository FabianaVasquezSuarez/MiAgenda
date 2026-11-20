import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Calendar, Check, Flag, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { formatLongDateSpanish, getTodayISO, parseISODate } from '../utils/dateUtils';

type PriorityLevel = 'baja' | 'media' | 'alta';

interface ActivityItem {
  id: number;
  name: string;
  date: string; // YYYY-MM-DD
  priority: PriorityLevel;
  completed: boolean;
}

const PRIORITY_OPTIONS: {
  id: PriorityLevel;
  label: string;
  activeClass: string;
  textClass: string;
}[] = [
  {
    id: 'baja',
    label: 'Baja',
    activeClass: 'bg-emerald-50 border-emerald-600 text-emerald-800',
    textClass: 'text-emerald-700',
  },
  {
    id: 'media',
    label: 'Media',
    activeClass: 'bg-amber-50 border-amber-600 text-amber-800',
    textClass: 'text-amber-700',
  },
  {
    id: 'alta',
    label: 'Alta',
    activeClass: 'bg-red-50 border-red-600 text-red-800',
    textClass: 'text-red-700',
  },
];

function formatActivityDate(iso: string, todayISO: string): string {
  const target = iso || todayISO;
  const d = parseISODate(target);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  if (target === todayISO) {
    return `Hoy (${dd}/${mm}/${yyyy})`;
  }
  return `${dd}/${mm}/${yyyy}`;
}

export function AgendaPreview() {
  const todayISO = getTodayISO();

  // Formulario de nueva actividad
  const [activityText, setActivityText] = useState('');
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel>('media');
  const [validationError, setValidationError] = useState('');
  const [nextId, setNextId] = useState(3);

  // Lista en memoria mientras la app está abierta
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 1,
      name: 'Repasar apuntes de Kotlin',
      date: todayISO,
      priority: 'alta',
      completed: false,
    },
    {
      id: 2,
      name: 'Probar mi primera pantalla en Compose',
      date: todayISO,
      priority: 'media',
      completed: true,
    },
  ]);

  // Estado del formulario sencillo de edición (nombre y fecha)
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editDate, setEditDate] = useState(todayISO);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    if (!editingActivity) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingActivity(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editingActivity]);

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = activityText.trim();

    if (cleanName.length === 0) {
      setValidationError('Debes escribir una actividad antes de agregarla.');
      return;
    }

    const finalDate = selectedDate.trim() ? selectedDate : getTodayISO();

    setActivities((prev) => [
      {
        id: nextId,
        name: cleanName,
        date: finalDate,
        priority: selectedPriority,
        completed: false,
      },
      ...prev,
    ]);
    setNextId((prev) => prev + 1);
    setActivityText('');
    setValidationError('');
  };

  const handleToggleCompleted = (id: number) => {
    setActivities((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteActivity = (id: number) => {
    setActivities((prev) => prev.filter((item) => item.id !== id));
  };

  const openEditForm = (item: ActivityItem) => {
    setEditingActivity(item);
    setEditName(item.name);
    setEditDate(item.date || todayISO);
    setEditError('');
  };

  const handleCancelEdit = () => {
    setEditingActivity(null);
    setEditError('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity) return;

    const cleanName = editName.trim();
    if (cleanName.length === 0) {
      setEditError('Debes escribir un nombre para la actividad.');
      return;
    }

    const finalDate = editDate.trim() ? editDate : getTodayISO();

    setActivities((prev) =>
      prev.map((item) =>
        item.id === editingActivity.id
          ? { ...item, name: cleanName, date: finalDate }
          : item
      )
    );
    setEditingActivity(null);
    setEditError('');
  };

  const completedCount = activities.filter((a) => a.completed).length;
  const totalCount = activities.length;
  const progressRatio = totalCount > 0 ? completedCount / totalCount : 0;
  const progressPercent = Math.round(progressRatio * 100);

  const [searchQuery, setSearchQuery] = useState('');
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const filteredActivities = trimmedQuery
    ? activities.filter((item) => item.name.toLowerCase().includes(trimmedQuery))
    : activities;

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      {/* Encabezado principal */}
      <header className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 shadow-md shadow-blue-600/15">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-blue-100 capitalize">
              {formatLongDateSpanish(todayISO)}
            </p>
            <h1 className="text-2xl font-bold tracking-tight mt-0.5">Mi Agenda</h1>
          </div>
          <div className="text-right tabular-nums">
            <p className="text-lg font-bold leading-none">
              {totalCount - completedCount}{' '}
              {totalCount - completedCount === 1 ? 'pendiente' : 'pendientes'}
            </p>
            <p className="text-xs text-blue-100 mt-1">
              {totalCount} en total
            </p>
          </div>
        </div>
      </header>

      {/* Tarjeta de formulario para agregar actividad */}
      <section
        aria-label="Agregar nueva actividad"
        className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-5"
      >
        <form onSubmit={handleAddActivity} noValidate className="space-y-3.5">
          <div>
            <label
              htmlFor="campo-actividad"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Nueva actividad
            </label>
            <input
              id="campo-actividad"
              type="text"
              value={activityText}
              onChange={(e) => {
                const nextVal = e.target.value;
                setActivityText(nextVal);
                if (validationError && nextVal.trim().length > 0) {
                  setValidationError('');
                }
              }}
              aria-invalid={Boolean(validationError)}
              placeholder="Escribe una actividad"
              className={`w-full min-h-[48px] px-4 py-3 rounded-xl border bg-slate-50/70 text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
                validationError
                  ? 'border-red-600 focus:ring-red-600 focus:border-red-600'
                  : 'border-slate-300 focus:ring-blue-600 focus:border-blue-600'
              }`}
            />
            <AnimatePresence>
              {validationError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="mt-1.5 text-sm font-medium text-red-700"
                  role="alert"
                >
                  {validationError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label
              htmlFor="campo-fecha"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Fecha
            </label>
            <div className="relative flex items-center">
              <Calendar className="w-5 h-5 text-slate-500 absolute left-3.5 pointer-events-none" />
              <input
                id="campo-fecha"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value || getTodayISO())}
                className="w-full min-h-[48px] pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50/70 text-base text-slate-900 tabular-nums focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <span className="block text-sm font-semibold text-slate-800 mb-1.5">
              Prioridad
            </span>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Nivel de prioridad">
              {PRIORITY_OPTIONS.map((option) => {
                const isSelected = selectedPriority === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedPriority(option.id)}
                    className={`min-h-[46px] px-3 py-2 rounded-xl border text-sm font-semibold transition-all active:scale-[0.97] flex items-center justify-center gap-1.5 whitespace-nowrap ${
                      isSelected
                        ? option.activeClass
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Flag className="w-4 h-4 shrink-0" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full min-h-[50px] px-5 py-3 rounded-xl bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span>Agregar actividad</span>
          </button>
        </form>
      </section>

      {/* Tarjeta pequeña de resumen encima de la lista de tareas */}
      <section
        aria-label="Resumen de progreso"
        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex items-center gap-4"
      >
        {/* Círculo de porcentaje */}
        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
            <circle
              cx="28"
              cy="28"
              r="22"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="5"
            />
            <motion.circle
              cx="28"
              cy="28"
              r="22"
              fill="none"
              stroke="#2563eb"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 22}
              initial={false}
              animate={{
                strokeDashoffset: 2 * Math.PI * 22 * (1 - progressRatio),
              }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <span className="absolute text-xs font-bold text-slate-900 tabular-nums">
            {progressPercent}%
          </span>
        </div>

        {/* Texto y barra horizontal simple */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-bold text-slate-900 truncate">
              Progreso de tareas
            </h2>
            <span className="text-xs font-semibold text-blue-700 tabular-nums shrink-0">
              {completedCount}/{totalCount}
            </span>
          </div>

          <div
            className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Porcentaje de tareas completadas"
          >
            <motion.div
              className="h-full w-full bg-blue-600 rounded-full origin-left"
              initial={false}
              animate={{ scaleX: progressRatio }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <p className="text-xs text-slate-500 tabular-nums">
            {totalCount === 0
              ? 'Agrega una tarea para comenzar a medir tu avance'
              : `${completedCount} de ${totalCount} ${
                  totalCount === 1 ? 'tarea completada' : 'tareas completadas'
                }`}
          </p>
        </div>
      </section>

      {/* Lista dinámica de actividades */}
      <section aria-label="Lista de actividades" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-700">
            Mis actividades
          </h2>
          <span className="text-xs font-medium text-slate-500 tabular-nums">
            {trimmedQuery
              ? `${filteredActivities.length} de ${totalCount} ${
                  totalCount === 1 ? 'actividad' : 'actividades'
                }`
              : `${totalCount} ${totalCount === 1 ? 'actividad' : 'actividades'}`}
          </span>
        </div>

        {/* Barra de búsqueda en tiempo real */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar actividad por nombre..."
            aria-label="Buscar actividad por nombre"
            className="w-full min-h-[48px] pl-11 pr-11 py-2.5 rounded-2xl border border-slate-200/90 bg-white text-base text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Limpiar búsqueda"
              className="min-h-[44px] min-w-[44px] absolute right-1 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {activities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-10 px-4 text-center rounded-3xl border border-dashed border-slate-300 bg-white"
          >
            <p className="text-base font-semibold text-slate-700">
              Aún no tienes actividades.
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Escribe una arriba y presiona Agregar actividad.
            </p>
          </motion.div>
        ) : filteredActivities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 px-4 text-center rounded-3xl border border-dashed border-slate-300 bg-white space-y-3"
          >
            <p className="text-base font-semibold text-slate-700">
              No se encontraron actividades con "{searchQuery.trim()}".
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Limpiar búsqueda
            </button>
          </motion.div>
        ) : (
          <ul className="space-y-2.5">
            <AnimatePresence initial={false}>
              {filteredActivities.map((item) => {
                const priorityMeta =
                  PRIORITY_OPTIONS.find((p) => p.id === item.priority) ?? PRIORITY_OPTIONS[1];

                return (
                  <motion.li
                    key={item.id}
                    layout="position"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className={`rounded-2xl border px-2.5 py-2.5 flex items-center gap-1.5 transition-colors ${
                      item.completed
                        ? 'bg-slate-50/90 border-slate-200/70'
                        : 'bg-white border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    {/* Control para marcar como completada */}
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={item.completed}
                      aria-label={
                        item.completed
                          ? `Desmarcar "${item.name}" como completada`
                          : `Marcar "${item.name}" como completada`
                      }
                      onClick={() => handleToggleCompleted(item.id)}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-slate-100 active:scale-95 transition-all shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600"
                    >
                      <span
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                          item.completed
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-slate-400 text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    </button>

                    {/* Nombre, fecha y prioridad */}
                    <button
                      type="button"
                      onClick={() => handleToggleCompleted(item.id)}
                      className="flex-1 min-h-[44px] text-left px-1 py-1 space-y-1 min-w-0"
                    >
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span
                          className={`text-base font-semibold break-words transition-colors ${
                            item.completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {item.name}
                        </span>
                        <span className="text-xs font-medium text-slate-500 tabular-nums whitespace-nowrap">
                          · {formatActivityDate(item.date, todayISO)}
                        </span>
                      </div>

                      <div
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                          item.completed ? 'text-slate-400' : priorityMeta.textClass
                        }`}
                      >
                        <Flag className="w-3.5 h-3.5 shrink-0" />
                        <span>Prioridad {priorityMeta.label}</span>
                      </div>
                    </button>

                    {/* Botón para editar nombre y fecha */}
                    <button
                      type="button"
                      onClick={() => openEditForm(item)}
                      aria-label={`Editar "${item.name}"`}
                      className="min-h-[44px] min-w-[44px] rounded-xl text-blue-700 hover:bg-blue-50 active:scale-95 transition-all flex items-center justify-center shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600"
                    >
                      <Pencil className="w-[18px] h-[18px]" />
                    </button>

                    {/* Botón para eliminar actividad */}
                    <button
                      type="button"
                      onClick={() => handleDeleteActivity(item.id)}
                      aria-label={`Eliminar "${item.name}"`}
                      className="min-h-[44px] min-w-[44px] rounded-xl text-red-700 hover:bg-red-50 active:scale-95 transition-all flex items-center justify-center shrink-0 focus-visible:outline-2 focus-visible:outline-red-600"
                    >
                      <Trash2 className="w-[18px] h-[18px]" />
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </section>

      {/* Hoja modal sencilla para editar nombre y fecha */}
      <AnimatePresence>
        {editingActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="editar-titulo"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCancelEdit();
            }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[430px] bg-white rounded-t-3xl border-t border-slate-200 shadow-xl overflow-hidden pb-safe"
            >
              {/* Indicador táctil superior */}
              <div className="pt-3 pb-1 flex justify-center">
                <div className="w-10 h-1.5 bg-slate-300 rounded-full" aria-hidden="true" />
              </div>

              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3">
                <h2 id="editar-titulo" className="text-lg font-bold text-slate-900">
                  Editar actividad
                </h2>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  aria-label="Cerrar edición"
                  className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} noValidate className="p-5 space-y-4">
                <div>
                  <label
                    htmlFor="editar-nombre"
                    className="block text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Nombre de la actividad
                  </label>
                  <input
                    id="editar-nombre"
                    type="text"
                    value={editName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditName(val);
                      if (editError && val.trim().length > 0) {
                        setEditError('');
                      }
                    }}
                    placeholder="Escribe el nuevo nombre"
                    aria-invalid={Boolean(editError)}
                    className={`w-full min-h-[48px] px-4 py-3 rounded-xl border bg-slate-50/70 text-base text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
                      editError
                        ? 'border-red-600 focus:ring-red-600 focus:border-red-600'
                        : 'border-slate-300 focus:ring-blue-600 focus:border-blue-600'
                    }`}
                  />
                  {editError && (
                    <p className="mt-1.5 text-sm font-medium text-red-700" role="alert">
                      {editError}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="editar-fecha"
                    className="block text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Fecha
                  </label>
                  <div className="relative flex items-center">
                    <Calendar className="w-5 h-5 text-slate-500 absolute left-3.5 pointer-events-none" />
                    <input
                      id="editar-fecha"
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value || getTodayISO())}
                      className="w-full min-h-[48px] pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50/70 text-base text-slate-900 tabular-nums focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-base font-semibold hover:bg-slate-50 active:scale-[0.98] transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="min-h-[48px] px-4 py-3 rounded-xl bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all"
                  >
                    Guardar cambios
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
