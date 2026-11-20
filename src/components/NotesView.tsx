import React, { useState } from 'react';
import { Plus, Search, Pencil, Trash2, BookOpen } from 'lucide-react';
import { COURSE_MODULES, CourseModule, CourseNote } from '../types';
import { formatShortDateSpanish } from '../utils/dateUtils';

interface NotesViewProps {
  notes: CourseNote[];
  onAddNote: () => void;
  onEditNote: (note: CourseNote) => void;
  onDeleteNote: (note: CourseNote) => void;
}

export function NotesView({ notes, onAddNote, onEditNote, onDeleteNote }: NotesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<'todos' | CourseModule>('todos');

  const filteredNotes = notes.filter((note) => {
    const matchesModule = selectedModule === 'todos' || note.module === selectedModule;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q) ||
      note.module.toLowerCase().includes(q);
    return matchesModule && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado, buscador y filtro por módulo */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notas y apuntes</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-0.5 tabular-nums">
              {notes.length} {notes.length === 1 ? 'apunte guardado' : 'apuntes guardados'} sobre
              Google AI Studio
            </p>
          </div>

          <button
            type="button"
            onClick={onAddNote}
            className="min-h-[48px] px-5 py-3 rounded-xl bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Crear nueva nota</span>
          </button>
        </div>

        {/* Buscador */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en tus apuntes..."
            aria-label="Buscar en tus apuntes"
            className="w-full min-h-[48px] pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>

        {/* Filtro por tema */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedModule('todos')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap shrink-0 border ${
              selectedModule === 'todos'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Todos los temas
          </button>
          {COURSE_MODULES.map((mod) => (
            <button
              key={mod}
              type="button"
              onClick={() => setSelectedModule(mod)}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap shrink-0 border ${
                selectedModule === mod
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>
      </section>

      {/* Lista de notas */}
      {filteredNotes.length === 0 ? (
        <section className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-base font-medium text-slate-700">
            No encontramos apuntes con ese filtro o búsqueda.
          </p>
          <button
            type="button"
            onClick={onAddNote}
            className="min-h-[48px] px-5 py-3 rounded-xl bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Crear un nuevo apunte</span>
          </button>
        </section>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <article
              key={note.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 tabular-nums">
                  <span className="font-semibold text-blue-700">{note.module}</span>
                  <span aria-hidden="true">·</span>
                  <span>Actualizada: {formatShortDateSpanish(note.updatedAt)}</span>
                </div>

                <h2 className="text-lg font-bold text-slate-900">{note.title}</h2>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                  {note.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEditNote(note)}
                  className="min-h-[44px] flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Editar nota</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteNote(note)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 bg-white text-red-700 text-sm font-semibold hover:bg-red-50 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
