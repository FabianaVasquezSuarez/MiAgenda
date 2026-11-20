export const MAIN_ACTIVITY_KOTLIN = `package com.ejemplo.miagenda

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

// Niveles de prioridad disponibles para cada actividad (colores optimizados para fondo negro)
enum class Prioridad(val etiqueta: String, val color: Color) {
    BAJA("Baja", Color(0xFF4ADE80)),   // Verde claro legible sobre negro
    MEDIA("Media", Color(0xFFFBBF24)), // Ámbar claro legible sobre negro
    ALTA("Alta", Color(0xFFF87171))    // Rojo claro legible sobre negro
}

// Modelo de actividad en memoria
data class Actividad(
    val id: Int,
    val nombre: String,
    val fecha: String,
    val prioridad: Prioridad = Prioridad.MEDIA,
    val completada: Boolean = false
)

private val EsquemaColorNegro = darkColorScheme(
    primary = Color(0xFF3B82F6),
    onPrimary = Color.White,
    background = Color.Black,
    onBackground = Color.White,
    surface = Color(0xFF0A0A0C),
    onSurface = Color.White,
    surfaceVariant = Color(0xFF18181B),
    onSurfaceVariant = Color(0xFFA1A1AA),
    outline = Color(0xFF3F3F46)
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(colorScheme = EsquemaColorNegro) {
                MiAgendaPantalla()
            }
        }
    }
}

private fun obtenerFechaHoyTexto(): String {
    val formato = SimpleDateFormat("dd/MM/yyyy", Locale("es", "ES"))
    return formato.format(Date())
}

private fun formatearMilisegundosUTC(milis: Long): String {
    val formato = SimpleDateFormat("dd/MM/yyyy", Locale("es", "ES"))
    formato.timeZone = TimeZone.getTimeZone("UTC")
    return formato.format(Date(milis))
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MiAgendaPantalla() {
    // Estado temporal en memoria (solo mientras la app está abierta)
    var textoActividad by remember { mutableStateOf("") }
    var mensajeError by remember { mutableStateOf<String?>(null) }
    var fechaSeleccionada by remember { mutableStateOf(obtenerFechaHoyTexto()) }
    var mostrarSelectorFecha by remember { mutableStateOf(false) }
    var prioridadSeleccionada by remember { mutableStateOf(Prioridad.MEDIA) }
    var siguienteId by remember { mutableIntStateOf(1) }
    val actividades = remember { mutableStateListOf<Actividad>() }
    var textoBusqueda by remember { mutableStateOf("") }
    // null representa "Todas" las prioridades
    var filtroPrioridad by remember { mutableStateOf<Prioridad?>(null) }

    val consultaLimpia = textoBusqueda.trim()
    val actividadesFiltradas = actividades.filter { actividad ->
        val coincideTexto = consultaLimpia.isEmpty() ||
            actividad.nombre.contains(consultaLimpia, ignoreCase = true)
        val coincidePrioridad = filtroPrioridad == null || actividad.prioridad == filtroPrioridad
        coincideTexto && coincidePrioridad
    }

    // Estado para editar una actividad existente
    var actividadEnEdicion by remember { mutableStateOf<Actividad?>(null) }
    var nombreEditado by remember { mutableStateOf("") }
    var fechaEditada by remember { mutableStateOf("") }
    var errorEdicion by remember { mutableStateOf<String?>(null) }
    var mostrarSelectorFechaEdicion by remember { mutableStateOf(false) }

    val datePickerState = rememberDatePickerState()
    val editDatePickerState = rememberDatePickerState()

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        containerColor = Color.Black
    ) { paddingInterno ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingInterno)
                .padding(horizontal = 20.dp, vertical = 20.dp)
        ) {
            // 1. Título principal de la pantalla
            Text(
                text = "Mi Agenda",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(14.dp))

            // 2. Campo de texto con validación de vacío / solo espacios
            OutlinedTextField(
                value = textoActividad,
                onValueChange = {
                    textoActividad = it
                    if (mensajeError != null) mensajeError = null
                },
                label = { Text("Escribe una actividad") },
                isError = mensajeError != null,
                supportingText = mensajeError?.let { error ->
                    { Text(text = error) }
                },
                singleLine = true,
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(10.dp))

            // 3. Selector de fecha (usa hoy si el usuario no elige otra)
            OutlinedButton(
                onClick = { mostrarSelectorFecha = true },
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.DateRange,
                    contentDescription = "Elegir fecha"
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(text = "Fecha: \$fechaSeleccionada")
            }

            Spacer(modifier = Modifier.height(12.dp))

            // 4. Selector de prioridad (Baja, Media, Alta)
            Text(
                text = "Prioridad",
                style = MaterialTheme.typography.labelLarge,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.height(6.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Prioridad.entries.forEach { nivel ->
                    val seleccionada = nivel == prioridadSeleccionada
                    OutlinedButton(
                        onClick = { prioridadSeleccionada = nivel },
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .weight(1f)
                            .height(44.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            containerColor = if (seleccionada) {
                                nivel.color.copy(alpha = 0.14f)
                            } else {
                                Color.Transparent
                            },
                            contentColor = if (seleccionada) {
                                nivel.color
                            } else {
                                MaterialTheme.colorScheme.onSurface
                            }
                        )
                    ) {
                        Text(
                            text = nivel.etiqueta,
                            fontWeight = if (seleccionada) FontWeight.Bold else FontWeight.Normal
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // 5. Botón para agregar la actividad
            Button(
                onClick = {
                    val nombreLimpio = textoActividad.trim()
                    if (nombreLimpio.isEmpty()) {
                        mensajeError = "Debes escribir una actividad antes de agregarla."
                    } else {
                        actividades.add(
                            Actividad(
                                id = siguienteId,
                                nombre = nombreLimpio,
                                fecha = fechaSeleccionada.ifBlank { obtenerFechaHoyTexto() },
                                prioridad = prioridadSeleccionada
                            )
                        )
                        siguienteId++
                        textoActividad = ""
                        mensajeError = null
                    }
                },
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
            ) {
                Text(text = "Agregar actividad")
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 6. Tarjeta pequeña de resumen de progreso encima de la lista
            val totalTareas = actividades.size
            val tareasCompletadas = actividades.count { it.completada }
            TarjetaResumenProgreso(
                completadas = tareasCompletadas,
                total = totalTareas
            )

            Spacer(modifier = Modifier.height(12.dp))

            // 7. Barra de búsqueda en tiempo real sobre la lista
            OutlinedTextField(
                value = textoBusqueda,
                onValueChange = { textoBusqueda = it },
                placeholder = { Text("Buscar actividad por nombre...") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Buscar"
                    )
                },
                trailingIcon = {
                    if (textoBusqueda.isNotEmpty()) {
                        IconButton(onClick = { textoBusqueda = "" }) {
                            Icon(
                                imageVector = Icons.Default.Clear,
                                contentDescription = "Limpiar búsqueda"
                            )
                        }
                    }
                },
                singleLine = true,
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(10.dp))

            // 8. Selector de filtros por prioridad (Todas, Alta, Media, Baja)
            val opcionesFiltro: List<Pair<String, Prioridad?>> = listOf(
                "Todas" to null,
                "Alta" to Prioridad.ALTA,
                "Media" to Prioridad.MEDIA,
                "Baja" to Prioridad.BAJA
            )
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                opcionesFiltro.forEach { (etiqueta, prioridadObjetivo) ->
                    val activo = filtroPrioridad == prioridadObjetivo
                    val colorActivo = prioridadObjetivo?.color ?: MaterialTheme.colorScheme.primary
                    OutlinedButton(
                        onClick = { filtroPrioridad = prioridadObjetivo },
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .weight(1f)
                            .height(42.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            containerColor = if (activo) {
                                colorActivo.copy(alpha = 0.14f)
                            } else {
                                Color.Transparent
                            },
                            contentColor = if (activo) {
                                colorActivo
                            } else {
                                MaterialTheme.colorScheme.onSurfaceVariant
                            }
                        )
                    ) {
                        Text(
                            text = etiqueta,
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = if (activo) FontWeight.Bold else FontWeight.Medium
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // 9. Lista de actividades agregadas (filtradas por búsqueda y prioridad)
            if (actividades.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Aún no tienes actividades.\\nEscribe una arriba para comenzar.",
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else if (actividadesFiltradas.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "No hay actividades que coincidan con los filtros actuales.",
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(
                        items = actividadesFiltradas,
                        key = { it.id }
                    ) { actividad ->
                        FilaActividad(
                            actividad = actividad,
                            onCambiarCompletada = { marcada ->
                                val indice = actividades.indexOfFirst { it.id == actividad.id }
                                if (indice != -1) {
                                    actividades[indice] = actividad.copy(completada = marcada)
                                }
                            },
                            onEditar = {
                                actividadEnEdicion = actividad
                                nombreEditado = actividad.nombre
                                fechaEditada = actividad.fecha
                                errorEdicion = null
                            },
                            onEliminar = {
                                actividades.removeAll { it.id == actividad.id }
                            }
                        )
                    }
                }
            }
        }
    }

    // Selector de fecha para nueva actividad
    if (mostrarSelectorFecha) {
        DatePickerDialog(
            onDismissRequest = { mostrarSelectorFecha = false },
            confirmButton = {
                TextButton(
                    onClick = {
                        val milis = datePickerState.selectedDateMillis
                        fechaSeleccionada = if (milis != null) {
                            formatearMilisegundosUTC(milis)
                        } else {
                            obtenerFechaHoyTexto()
                        }
                        mostrarSelectorFecha = false
                    }
                ) {
                    Text("Aceptar")
                }
            },
            dismissButton = {
                TextButton(onClick = { mostrarSelectorFecha = false }) {
                    Text("Cancelar")
                }
            }
        ) {
            DatePicker(state = datePickerState)
        }
    }

    // Diálogo sencillo para editar el nombre y la fecha de una actividad
    if (actividadEnEdicion != null) {
        AlertDialog(
            onDismissRequest = { actividadEnEdicion = null },
            title = {
                Text(
                    text = "Editar actividad",
                    fontWeight = FontWeight.Bold
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    OutlinedTextField(
                        value = nombreEditado,
                        onValueChange = {
                            nombreEditado = it
                            if (errorEdicion != null) errorEdicion = null
                        },
                        label = { Text("Nombre de la actividad") },
                        isError = errorEdicion != null,
                        supportingText = errorEdicion?.let { error ->
                            { Text(text = error) }
                        },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedButton(
                        onClick = { mostrarSelectorFechaEdicion = true },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.DateRange,
                            contentDescription = "Cambiar fecha"
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(text = "Fecha: \$fechaEditada")
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val nombreLimpio = nombreEditado.trim()
                        if (nombreLimpio.isEmpty()) {
                            errorEdicion = "Debes escribir un nombre para la actividad."
                        } else {
                            val actual = actividadEnEdicion
                            if (actual != null) {
                                val indice = actividades.indexOfFirst { it.id == actual.id }
                                if (indice != -1) {
                                    actividades[indice] = actual.copy(
                                        nombre = nombreLimpio,
                                        fecha = fechaEditada.ifBlank { obtenerFechaHoyTexto() }
                                    )
                                }
                            }
                            actividadEnEdicion = null
                        }
                    }
                ) {
                    Text("Guardar")
                }
            },
            dismissButton = {
                TextButton(onClick = { actividadEnEdicion = null }) {
                    Text("Cancelar")
                }
            }
        )
    }

    // Selector de fecha durante la edición
    if (mostrarSelectorFechaEdicion) {
        DatePickerDialog(
            onDismissRequest = { mostrarSelectorFechaEdicion = false },
            confirmButton = {
                TextButton(
                    onClick = {
                        val milis = editDatePickerState.selectedDateMillis
                        fechaEditada = if (milis != null) {
                            formatearMilisegundosUTC(milis)
                        } else {
                            obtenerFechaHoyTexto()
                        }
                        mostrarSelectorFechaEdicion = false
                    }
                ) {
                    Text("Aceptar")
                }
            },
            dismissButton = {
                TextButton(onClick = { mostrarSelectorFechaEdicion = false }) {
                    Text("Cancelar")
                }
            }
        ) {
            DatePicker(state = editDatePickerState)
        }
    }
}

@Composable
fun FilaActividad(
    actividad: Actividad,
    onCambiarCompletada: (Boolean) -> Unit,
    onEditar: () -> Unit,
    onEliminar: () -> Unit
) {
    val fondoCard by animateColorAsState(
        targetValue = if (actividad.completada) {
            MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.28f)
        } else {
            MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.55f)
        },
        label = "fondoActividad"
    )

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = fondoCard)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Control para marcar como completada
            Checkbox(
                checked = actividad.completada,
                onCheckedChange = onCambiarCompletada
            )

            // Nombre, fecha y prioridad
            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 6.dp)
            ) {
                Text(
                    text = actividad.nombre,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Medium,
                    textDecoration = if (actividad.completada) {
                        TextDecoration.LineThrough
                    } else {
                        TextDecoration.None
                    }
                )
                Spacer(modifier = Modifier.height(2.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = actividad.fecha,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .clip(CircleShape)
                                .background(actividad.prioridad.color)
                        )
                        Text(
                            text = "Prioridad \${actividad.prioridad.etiqueta}",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.SemiBold,
                            color = actividad.prioridad.color
                        )
                    }
                }
            }

            // Botón para editar nombre y fecha
            IconButton(onClick = onEditar) {
                Icon(
                    imageVector = Icons.Default.Edit,
                    contentDescription = "Editar actividad",
                    tint = MaterialTheme.colorScheme.primary
                )
            }

            // Botón para eliminar
            IconButton(onClick = onEliminar) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Eliminar actividad",
                    tint = MaterialTheme.colorScheme.error
                )
            }
        }
    }
}

@Composable
fun TarjetaResumenProgreso(
    completadas: Int,
    total: Int
) {
    val proporcionObjetivo = if (total > 0) completadas.toFloat() / total.toFloat() else 0f
    val proporcionAnimada by animateFloatAsState(
        targetValue = proporcionObjetivo,
        label = "progresoTareas"
    )
    val porcentaje = (proporcionObjetivo * 100).toInt()

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.45f)
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 14.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Círculo visual con porcentaje completado
            Box(
                modifier = Modifier.size(52.dp),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(
                    progress = { proporcionAnimada },
                    modifier = Modifier.fillMaxSize(),
                    strokeWidth = 5.dp,
                    trackColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f),
                    strokeCap = StrokeCap.Round
                )
                Text(
                    text = "\$porcentaje%",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold
                )
            }

            // Resumen y barra horizontal simple
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Progreso de tareas",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "\$completadas/\$total",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                LinearProgressIndicator(
                    progress = { proporcionAnimada },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp)),
                    trackColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f),
                    strokeCap = StrokeCap.Round
                )

                Text(
                    text = if (total == 0) {
                        "Agrega una tarea para medir tu avance"
                    } else {
                        "\$completadas de \$total tareas completadas"
                    },
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun MiAgendaPreview() {
    MaterialTheme(colorScheme = EsquemaColorNegro) {
        MiAgendaPantalla()
    }
}`;

export const SCREEN_STRUCTURE_STEPS = [
  {
    component: 'enum class Prioridad + data class Actividad',
    purpose:
      'Guarda id, nombre, fecha, prioridad (Baja, Media, Alta) y estado completada en memoria.',
  },
  {
    component: 'OutlinedTextField con validación',
    purpose:
      'Impide agregar o guardar nombres vacíos o con solo espacios y muestra un mensaje claro de aviso.',
  },
  {
    component: 'DatePickerDialog + Prioridad',
    purpose:
      'Permite elegir fecha (usando hoy por defecto) y nivel de prioridad antes de agregar.',
  },
  {
    component: 'AlertDialog ("Editar actividad")',
    purpose:
      'Formulario sencillo para modificar el nombre y la fecha de una actividad con botones Guardar y Cancelar.',
  },
  {
    component: 'TarjetaResumenProgreso',
    purpose:
      'Tarjeta compacta encima de la lista con círculo de porcentaje y barra lineal animada de tareas completadas.',
  },
  {
    component: 'Búsqueda + Filtro de prioridad + LazyColumn',
    purpose:
      'Combina el filtro por nombre en tiempo real con el selector de prioridad (Todas, Alta, Media, Baja).',
  },
];
