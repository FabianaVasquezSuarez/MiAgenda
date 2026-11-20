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
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Código Kotlin
        </h1>
        <p className="text-sm text-neutral-400">
          Organización de la pantalla en Jetpack Compose con fondo negro, fecha y prioridad.
        </p>
      </header>

      {/* Estructura en lenguaje sencillo */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-3">
        <h2 className="text-base font-bold text-white">
          Partes de la pantalla
        </h2>
        <ol className="divide-y divide-neutral-800/80">
          {SCREEN_STRUCTURE_STEPS.map((step, index) => (
            <li key={step.component} className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-2.5">
              <span className="text-xs font-bold text-blue-400 tabular-nums shrink-0 mt-1">
                0{index + 1}.
              </span>
              <div className="space-y-0.5 min-w-0">
                <p className="text-sm font-semibold text-neutral-100 font-mono break-words">
                  {step.component}
                </p>
                <p className="text-sm text-neutral-400 leading-relaxed">{step.purpose}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Código fuente completo */}
      <section className="rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-950">
        <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white truncate">MainActivity.kt</h2>
            <p className="text-xs text-neutral-400 truncate">Jetpack Compose · Material 3 Oscuro</p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="min-h-[44px] px-3.5 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-neutral-100 text-sm font-semibold hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
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

        <div className="p-4 bg-black text-neutral-100 overflow-x-auto max-h-[460px] overflow-y-auto">
          <pre className="text-xs font-mono leading-relaxed">
            <code>{MAIN_ACTIVITY_KOTLIN}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
