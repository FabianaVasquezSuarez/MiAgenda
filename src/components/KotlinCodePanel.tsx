import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { MAIN_ACTIVITY_KOTLIN, SCREEN_STRUCTURE_STEPS } from '../data/kotlinSource';

export function KotlinCodePanel() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MAIN_ACTIVITY_KOTLIN);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored if blocked
    }
  };

  return (
    <div className="px-4 pt-5 pb-6 space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Código Kotlin
        </h1>
        <p className="text-sm text-slate-600">
          Organización de la pantalla en Jetpack Compose con fecha, prioridad y validación.
        </p>
      </header>

      {/* Estructura en lenguaje sencillo */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          Partes de la pantalla
        </h2>
        <ol className="divide-y divide-slate-200/70">
          {SCREEN_STRUCTURE_STEPS.map((step, index) => (
            <li key={step.component} className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-2.5">
              <span className="text-xs font-bold text-blue-700 tabular-nums shrink-0 mt-1">
                0{index + 1}.
              </span>
              <div className="space-y-0.5 min-w-0">
                <p className="text-sm font-semibold text-slate-900 font-mono break-words">
                  {step.component}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">{step.purpose}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Código fuente completo */}
      <section className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 truncate">MainActivity.kt</h2>
            <p className="text-xs text-slate-500 truncate">Jetpack Compose · Material 3</p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 bg-slate-950 text-slate-100 overflow-x-auto max-h-[460px] overflow-y-auto">
          <pre className="text-xs font-mono leading-relaxed">
            <code>{MAIN_ACTIVITY_KOTLIN}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
