import React, { useState } from 'react';
import { CheckSquare, Code2 } from 'lucide-react';
import { AgendaPreview } from './components/AgendaPreview';
import { KotlinCodePanel } from './components/KotlinCodePanel';

type PhoneTab = 'agenda' | 'codigo';

export default function App() {
  const [activeTab, setActiveTab] = useState<PhoneTab>('agenda');

  return (
    <div className="min-h-screen bg-black flex justify-center">
      {/* Contenedor exclusivo para teléfono móvil con fondo negro */}
      <div className="w-full max-w-[430px] min-h-screen bg-black text-slate-100 flex flex-col sm:border-x sm:border-neutral-800">
        {/* Contenido principal desplazable */}
        <main className="flex-1 pb-24">
          {activeTab === 'agenda' ? <AgendaPreview /> : <KotlinCodePanel />}
        </main>

        {/* Barra de navegación inferior fija para pulgar */}
        <nav
          aria-label="Navegación de la aplicación móvil"
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 pb-safe"
        >
          <div className="grid grid-cols-2 h-16 items-center">
            <button
              type="button"
              onClick={() => setActiveTab('agenda')}
              aria-current={activeTab === 'agenda' ? 'page' : undefined}
              className={`min-h-[56px] flex flex-col items-center justify-center gap-1 transition-colors active:scale-95 ${
                activeTab === 'agenda'
                  ? 'text-blue-400'
                  : 'text-neutral-400 hover:text-neutral-100'
              }`}
            >
              <CheckSquare className="w-[22px] h-[22px] shrink-0" />
              <span className="text-[11px] font-semibold tracking-tight leading-none">
                Mi Agenda
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('codigo')}
              aria-current={activeTab === 'codigo' ? 'page' : undefined}
              className={`min-h-[56px] flex flex-col items-center justify-center gap-1 transition-colors active:scale-95 ${
                activeTab === 'codigo'
                  ? 'text-blue-400'
                  : 'text-neutral-400 hover:text-neutral-100'
              }`}
            >
              <Code2 className="w-[22px] h-[22px] shrink-0" />
              <span className="text-[11px] font-semibold tracking-tight leading-none">
                Código Kotlin
              </span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
