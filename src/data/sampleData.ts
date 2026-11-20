import { AgendaState } from '../types';
import { addDaysISO, getTodayISO } from '../utils/dateUtils';

export function createInitialSampleData(): AgendaState {
  const today = getTodayISO();

  return {
    classes: [
      {
        id: 'clase-1',
        title: 'Espacio de trabajo en Google AI Studio',
        module: 'Módulo 1: Fundamentos',
        date: today,
        startTime: '18:00',
        endTime: '19:30',
        instructor: 'Prof. Laura Mendoza',
        modality: 'En vivo · Sala Virtual',
      },
      {
        id: 'clase-2',
        title: 'Diseño de System Instructions y ejemplos Few-Shot',
        module: 'Módulo 2: Ingeniería de Prompts',
        date: addDaysISO(today, 1),
        startTime: '18:30',
        endTime: '20:00',
        instructor: 'Prof. Laura Mendoza',
        modality: 'En vivo · Laboratorio práctico',
      },
      {
        id: 'clase-3',
        title: 'Entrada multimodal: imágenes, audio y PDF con Gemini',
        module: 'Módulo 3: Multimodal',
        date: addDaysISO(today, 3),
        startTime: '19:00',
        endTime: '20:30',
        instructor: 'Prof. Carlos Ríos',
        modality: 'En vivo · Demostración guiada',
      },
      {
        id: 'clase-4',
        title: 'Salidas JSON estructuradas y exportación con Get Code',
        module: 'Módulo 4: API y Código',
        date: addDaysISO(today, 5),
        startTime: '18:00',
        endTime: '19:30',
        instructor: 'Prof. Carlos Ríos',
        modality: 'En vivo · Taller de cierre',
      },
      {
        id: 'clase-5',
        title: 'Introducción a modelos Gemini Flash y Pro',
        module: 'Módulo 1: Fundamentos',
        date: addDaysISO(today, -2),
        startTime: '18:00',
        endTime: '19:15',
        instructor: 'Prof. Laura Mendoza',
        modality: 'Clase grabada',
      },
    ],
    tasks: [
      {
        id: 'tarea-1',
        name: 'Crear tu primer prompt libre en AI Studio',
        description:
          'Abrir Google AI Studio, elegir el modelo Gemini Flash y probar un resumen de texto guardando el proyecto en Google Drive.',
        dueDate: addDaysISO(today, -2),
        status: 'completada',
        module: 'Módulo 1: Fundamentos',
      },
      {
        id: 'tarea-2',
        name: 'Definir System Instructions para un tutor de estudio',
        description:
          'Escribir instrucciones claras de tono, formato de respuesta y límites para guiar el comportamiento del asistente.',
        dueDate: addDaysISO(today, -1),
        status: 'completada',
        module: 'Módulo 2: Ingeniería de Prompts',
      },
      {
        id: 'tarea-3',
        name: 'Comparar parámetros de Temperatura y Top-P',
        description:
          'Ejecutar el mismo prompt usando temperatura 0.2 y 1.0 para observar diferencias entre precisión y creatividad.',
        dueDate: today,
        status: 'pendiente',
        module: 'Módulo 2: Ingeniería de Prompts',
      },
      {
        id: 'tarea-4',
        name: 'Extraer datos clave de una imagen o PDF',
        description:
          'Subir un documento visual a Google AI Studio y pedir una lista ordenada con fecha, resumen y conceptos principales.',
        dueDate: addDaysISO(today, 2),
        status: 'pendiente',
        module: 'Módulo 3: Multimodal',
      },
      {
        id: 'tarea-5',
        name: 'Configurar salida JSON estructurada',
        description:
          'Activar Structured Outputs en el panel derecho y definir un esquema con título, dificultad y pasos recomendados.',
        dueDate: addDaysISO(today, 4),
        status: 'pendiente',
        module: 'Módulo 4: API y Código',
      },
      {
        id: 'tarea-6',
        name: 'Exportar snippet de código y revisar clave API',
        description:
          'Usar el botón Get Code para generar el ejemplo en TypeScript con @google/genai y revisar cómo proteger la clave en variables de entorno.',
        dueDate: addDaysISO(today, 6),
        status: 'pendiente',
        module: 'Módulo 4: API y Código',
      },
    ],
    notes: [
      {
        id: 'nota-1',
        title: 'Tipos de prompts en Google AI Studio',
        module: 'Módulo 1: Fundamentos',
        updatedAt: addDaysISO(today, -2),
        content:
          '1. Chat prompt: ideal para conversaciones de varios turnos donde se mantiene el contexto.\n2. Freeform / Prompt único: útil para tareas puntuales como resumir, clasificar o traducir.\n3. Recuerda revisar el contador de tokens en la barra superior antes de probar textos largos.',
      },
      {
        id: 'nota-2',
        title: 'Estructura recomendada para System Instructions',
        module: 'Módulo 2: Ingeniería de Prompts',
        updatedAt: addDaysISO(today, -1),
        content:
          'Para lograr respuestas consistentes:\n- Define el rol y la audiencia con claridad.\n- Indica qué debe evitar el modelo (por ejemplo, no inventar datos).\n- Agrega 2 ejemplos breves de entrada y salida esperada (few-shot) cuando necesites un formato específico.',
      },
      {
        id: 'nota-3',
        title: 'Cuándo ajustar la Temperatura',
        module: 'Módulo 2: Ingeniería de Prompts',
        updatedAt: today,
        content:
          '- Temperatura baja (0.0 a 0.3): extracción de datos, clasificación, respuestas objetivas.\n- Temperatura media (0.5 a 0.7): explicaciones didácticas y redacción cotidiana.\n- Temperatura alta (0.9 a 1.2): lluvia de ideas y escritura creativa.',
      },
      {
        id: 'nota-4',
        title: 'Buenas prácticas al subir archivos multimodales',
        module: 'Módulo 3: Multimodal',
        updatedAt: today,
        content:
          'Google AI Studio permite adjuntar imágenes, PDFs, audios y clips cortos de video directamente en el área de prompt.\nConsejo práctico: coloca la instrucción específica después del archivo adjunto para que el modelo sepa exactamente qué analizar.',
      },
    ],
  };
}
