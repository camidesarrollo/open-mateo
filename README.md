# 🧪 Prueba Técnica Frontend: El Observatorio
## Panel del Cronista Climático

**Tecnologías:** React, TypeScript, Vite y Open-Meteo .  
**Tiempo recomendado:** 6-8 horas para la versión base.  
**Nivel:** Intermedio-avanzado.  
**Modalidad:** Desarrollo individual.

## 1. Contexto: La misión del Cronista

El Observatorio es una organización dedicada a registrar fenómenos climáticos para descubrir patrones que permitan anticipar acontecimientos inusuales.

Como nuevo integrante del equipo de desarrollo, tu misión es construir el **Panel del Cronista**, una aplicación que permita explorar una línea temporal de eventos climáticos, identificar anomalías, comparar jornadas y registrar descubrimientos.

No buscamos una aplicación meteorológica convencional.

El objetivo es construir una herramienta interactiva que permita responder preguntas como:

- ¿Cuál fue el día más frío de las últimas jornadas?
- ¿Qué día presentó las condiciones climáticas más inusuales?
- ¿Existe una diferencia significativa entre un día pasado y uno futuro?
- ¿Qué jornadas merecen una investigación más detallada?
- ¿Qué patrones aparecen al comparar temperatura, precipitación y viento?

La aplicación debe funcionar como una pequeña herramienta de análisis, no como una simple pantalla de consulta del clima.

---

# 2. Objetivo general

Desarrollar una Single Page Application (SPA) utilizando React y TypeScript que consuma la  pública de Open-Meteo y permita explorar, filtrar, comparar e investigar datos climáticos de una ciudad seleccionada.

La aplicación deberá mostrar una línea temporal de **14 días: siete días anteriores a la fecha actual y siete días posteriores, incluyendo el día actual únicamente una vez**.

Cada jornada debe representarse mediante una cápsula visual que permita consultar sus datos, reconocer anomalías y acceder a funcionalidades de investigación.

La aplicación deberá incorporar gestión de estado, carga asíncrona, manejo de errores, accesibilidad, persistencia local y pruebas automatizadas.

## Objetivos técnicos

Durante la evaluación se prestará especial atención a:

1. La organización y separación de responsabilidades.
2. El uso correcto de los hooks de React.
3. La gestión de estados asíncronos y errores.
4. La eficiencia del renderizado.
5. La capacidad de combinar filtros y cálculos derivados.
6. La accesibilidad y la experiencia de usuario.
7. La calidad de los tipos y las pruebas automatizadas.

---

# 3. Requisitos funcionales

## RF-01. Línea temporal climática

La pantalla principal debe mostrar una línea temporal de 14 jornadas.

El usuario podrá visualizarla horizontalmente o verticalmente, pero la navegación deberá resultar cómoda tanto en escritorio como en dispositivos móviles.

### Cada cápsula debe mostrar

- Fecha y día de la semana.
- Temperatura máxima.
- Temperatura mínima.
- Precipitación acumulada en milímetros.
- Velocidad máxima del viento.
- Indicador del tipo de clima.
- Estado de investigación.
- Indicador de anomalía, cuando corresponda.

Ejemplo conceptual:

```text
┌──────────────────────────────┐
│       JUEVES, 22 OCT         │
│                              │
│          ☀️ 23 °C            │
│                              │
│       Máx. 23 °C             │
│       Mín. 14 °C             │
│       Lluvia: 0 mm           │
│       Viento: 12 km/h        │
│                              │
│       ✓ Investigado          │
└──────────────────────────────┘
```

Los valores anteriores son ilustrativos, no datos meteorológicos reales.

### Estados de la cápsula

Cada jornada debe contemplar los siguientes estados visuales:

| Estado | Comportamiento esperado |
|---|---|
| `idle` | La jornada todavía no ha iniciado su carga. |
| `loading` | Se muestra un skeleton mientras se obtienen los datos. |
| `success` | Se muestran los datos meteorológicos. |
| `error` | Se informa que los datos no están disponibles y se permite reintentar. |
| `investigado` | Se identifica visualmente que el usuario ya examinó la jornada. |

El estado de investigación no debe confundirse con el estado de carga.

Por ejemplo, una jornada investigada puede seguir teniendo sus datos disponibles sin necesidad de volver a consultar la .

**Criterio importante:** no es necesario volver a consultar el servidor cada vez que el usuario selecciona, investiga o filtra una jornada.

Estas operaciones deben trabajar sobre los datos existentes en memoria.

---

## RF-02. Investigación de jornadas

El usuario debe poder investigar una jornada seleccionando su cápsula.

Al hacerlo, la aplicación debe:

1. Marcar la jornada como investigada.
2. Mostrar un cambio visual que confirme la acción.
3. Actualizar los contadores correspondientes.
4. Evaluar si se ha desbloqueado algún logro.
5. Conservar el estado de investigación al recargar la página.

Se considerará investigada una jornada cuando el usuario abra su detalle o active explícitamente la acción de investigación.

La implementación deberá evitar que investigar repetidamente el mismo día incremente varias veces los contadores de descubrimientos.

### Panel de detalle

Al investigar una jornada, debe poder consultarse información ampliada:

- Fecha completa.
- Temperaturas máximas y mínimas.
- Precipitación.
- Velocidad máxima del viento.
- Clasificación meteorológica.
- Indicador de anomalía.
- Motivo por el cual se considera anómala, cuando corresponda.

Si no existen datos para esa jornada, el sistema deberá mostrar un estado de error comprensible, sin presentar valores ficticios como si fueran datos reales.

---

## RF-03. Modo Detective: comparación de jornadas

La aplicación debe permitir seleccionar hasta dos jornadas para compararlas.

La selección se realizará mediante interacción con las cápsulas y también deberá poder gestionarse con el teclado.

### Comportamiento

- Al seleccionar una jornada, esta queda marcada visualmente.
- Al seleccionar una segunda, se habilita la comparación.
- No se permite seleccionar una tercera jornada.
- El usuario puede quitar una selección y elegir otra.
- Si una jornada no tiene datos válidos, no podrá utilizarse para calcular una comparación.
- La comparación puede cerrarse sin perder los datos de la línea temporal.

La interfaz debe explicar claramente cómo continuar cuando el usuario haya seleccionado solo una jornada.

### Panel de comparación

El panel deberá mostrar ambas jornadas y comparar:

| Indicador | Día A | Día B | Resultado |
|---|---:|---:|---|
| Temperatura máxima | Valor real | Valor real | Más cálido |
| Temperatura mínima | Valor real | Valor real | Diferencia |
| Precipitación | Valor real | Valor real | Más lluvioso |
| Viento máximo | Valor real | Valor real | Más ventoso |

Los resultados deben calcularse a partir de los datos reales de la .

Cuando ambos días tengan el mismo valor, se mostrará un empate.

### Visualización

Se debe incorporar al menos una representación gráfica que permita interpretar las diferencias.

Puede utilizarse un gráfico de barras con una biblioteca como Recharts o una solución propia con HTML y CSS.

La visualización deberá contar con etiquetas legibles y una alternativa textual para usuarios que no puedan interpretar el gráfico visual.

### Carga diferida

El panel de comparación deberá cargarse mediante `React.lazy` y `Suspense`.

Mientras se carga el módulo, la interfaz mostrará un indicador de carga.

El objetivo es evitar cargar componentes que el usuario todavía no necesita.

---

## RF-04. Radar de anomalías

El Observatorio debe identificar automáticamente jornadas cuya temperatura máxima sea inusual respecto del conjunto de días analizados.

La detección deberá calcularse mediante estado derivado, sin duplicar innecesariamente los resultados en el estado global.

### Fórmula

Primero se calcula la media de las temperaturas máximas:

\[
\mu = \frac{1}{n}\sum_{i=1}^{n} x_i
\]

Después se calcula la desviación estándar poblacional:

\[
\sigma = \sqrt{\frac{1}{n}\sum_{i=1}^{n}(x_i-\mu)^2}
\]

Una jornada se considerará anómala cuando:

\[
|x_i-\mu| > \sigma
\]

Donde:

- \(x_i\) representa la temperatura máxima de una jornada.
- \(\mu\) es la temperatura máxima media.
- \(\sigma\) es la desviación estándar poblacional.
- \(n\) es el número de jornadas con temperaturas máximas válidas.

### Reglas de cálculo

Para evitar resultados incorrectos:

1. Se utilizarán exclusivamente temperaturas máximas válidas.
2. Los días con errores o datos incompletos no se tratarán como temperaturas iguales a cero.
3. La anomalía se recalculará cuando cambie el conjunto de datos válidos.
4. El cálculo deberá actualizarse al cambiar de ciudad.
5. Los filtros de presentación no modificarán el conjunto utilizado para calcular las anomalías.

Esta última regla es importante: **una anomalía se calcula sobre el conjunto completo de jornadas cargadas, no sobre el resultado filtrado por el usuario**.

De lo contrario, una misma jornada podría aparecer como anómala y dejar de serlo dependiendo del filtro aplicado.

### Presentación visual

Las jornadas anómalas deben destacarse mediante:

- Un indicador visual distintivo.
- Una etiqueta que indique «Anomalía».
- Una explicación accesible del motivo.
- Un estilo que no dependa exclusivamente del color.

### Filtro de anomalías

Se debe incluir un control para mostrar únicamente las jornadas anómalas.

Este filtro debe poder combinarse con los filtros de temperatura, tipo de clima y ordenamiento.

Si no existen anomalías, la aplicación debe mostrar un estado vacío explicativo.

---

## RF-05. Clasificación meteorológica

Cada jornada deberá clasificarse en una de las siguientes categorías:

- Soleado.
- Nublado.
- Lluvioso.
- Ventoso.

La clasificación deberá derivarse de los datos meteorológicos disponibles.

Se recomienda utilizar los códigos meteorológicos de Open-Meteo para distinguir las condiciones despejadas, nubosas y de precipitación.

Para identificar jornadas ventosas, se deberá establecer un umbral explícito de velocidad máxima del viento.

### Reglas de clasificación

Las reglas deben estar centralizadas en una función independiente y ser fáciles de probar.

Por ejemplo:

```ts
type WeatherType =
  | "sunny"
  | "cloudy"
  | "rainy"
  | "windy";
```

La clasificación deberá seguir una prioridad definida para evitar resultados ambiguos.

Una posible regla es:

1. Si la precipitación supera un umbral o el código meteorológico indica precipitación, clasificar como lluvioso.
2. En caso contrario, si el viento supera el umbral establecido, clasificar como ventoso.
3. En caso contrario, utilizar el código meteorológico para distinguir soleado y nublado.

Los umbrales y las reglas elegidas deberán documentarse en el proyecto.

No se deberá clasificar automáticamente como soleado un día que no tenga información meteorológica suficiente.

---

## RF-06. Filtros combinables y ordenamiento

La aplicación deberá permitir explorar los datos mediante filtros independientes.

### Filtro de temperatura

Se incorporará un control de rango que permita definir la temperatura mínima y máxima de interés.

La regla de filtrado será:

Una jornada se muestra cuando su temperatura máxima está dentro del rango seleccionado.

Los extremos se consideran inclusivos.

Por ejemplo, con un rango de 10 °C a 25 °C, se mostrarán las jornadas cuya temperatura máxima esté entre ambos valores.

El control deberá:

- Mostrar los valores seleccionados.
- Permitir modificar ambos extremos.
- Evitar que el mínimo supere al máximo.
- Adaptarse a pantallas pequeñas.

### Filtro por tipo de clima

El usuario podrá filtrar por:

- Soleado.
- Nublado.
- Lluvioso.
- Ventoso.

Debe poder elegir una categoría concreta o visualizar todas.

### Filtro por anomalías

Se podrá activar o desactivar la visualización exclusiva de jornadas anómalas.

### Ordenamiento

Se deberá poder ordenar por:

- Fecha.
- Temperatura máxima.
- Precipitación.
- Rareza.

El ordenamiento podrá ser ascendente o descendente.

### Definición de rareza

Para esta prueba, se define la rareza como la distancia absoluta entre la temperatura máxima de una jornada y la media del conjunto, expresada en unidades de desviación estándar:

\[
z_i = \frac{|x_i-\mu|}{\sigma}
\]

Cuanto mayor sea el valor, más inusual será la temperatura de esa jornada respecto del conjunto analizado.

Si la desviación estándar es cero, la rareza se considerará cero para todas las jornadas.

Los días sin datos válidos deberán tratarse de forma consistente y no recibir una rareza calculada artificialmente.

### Reglas generales

Todos los filtros deben combinarse entre sí.

Por ejemplo, el usuario debe poder solicitar:

> Mostrar únicamente los días lluviosos que tengan una temperatura máxima entre 10 °C y 25 °C, que sean anómalos y ordenarlos por rareza descendente.

La aplicación deberá calcular el resultado en el cliente, sin realizar nuevas peticiones a la .

Se recomienda utilizar `useMemo` para el filtrado y ordenamiento cuando sea pertinente.

También deberá incluirse un botón para restablecer los filtros.

Si ninguna jornada cumple las condiciones, se mostrará un mensaje de estado vacío con una opción para limpiar los filtros.

---

## RF-07. Sistema de logros

El usuario podrá desbloquear insignias por descubrir determinadas condiciones climáticas o utilizar funcionalidades de la aplicación.

Los logros deberán persistir en `localStorage`.

### Logros obligatorios

| Logro | Condición |
|---|---|
| 🥶 Explorador del frío | Investigar al menos una jornada con temperatura mínima inferior a 5 °C. |
| 🌧️ Cazador de tormentas | Investigar al menos una jornada con precipitación superior a 10 mm. |
| ☀️ Día perfecto | Investigar una jornada con temperatura máxima entre 20 °C y 25 °C, inclusive, y precipitación igual a 0 mm. |
| 🕵️ Detective | Investigar cinco jornadas distintas. |
| 📊 Analista | Completar tres comparaciones entre dos jornadas válidas. |

### Reglas del sistema

- Un logro desbloqueado no vuelve a bloquearse.
- Investigar varias veces una misma jornada no incrementa el contador de días investigados.
- Una comparación se contabiliza cuando el usuario completa la acción, no cuando simplemente selecciona una jornada.
- Abrir y cerrar repetidamente el panel no debe contabilizar varias comparaciones.
- Los logros deben conservarse después de recargar la página.
- Las condiciones deben evaluarse únicamente con datos válidos.

La interfaz debe mostrar los logros desbloqueados y los pendientes.

Se recomienda incorporar una breve explicación de cada insignia para que el usuario entienda cómo conseguirla.

---

## RF-08. Selector de ciudades

La aplicación deberá permitir cambiar entre, al menos, cinco ciudades predefinidas.

| Ciudad | Latitud | Longitud |
|---|---:|---:|
| Madrid | 40.4168 | -3.7038 |
| Barcelona | 41.3851 | 2.1734 |
| Buenos Aires | -34.6037 | -58.3816 |
| Ciudad de México | 19.4326 | -99.1332 |
| Bogotá | 4.7110 | -74.0721 |

Al cambiar de ciudad, la aplicación deberá:

1. Actualizar el contexto de ciudad.
2. Cancelar las peticiones anteriores que sigan en curso.
3. Consultar los datos de la nueva ciudad.
4. Mostrar los estados de carga correspondientes.
5. Actualizar la línea temporal y las anomalías.
6. Evitar que una respuesta antigua sobrescriba los datos de la ciudad seleccionada actualmente.

La ciudad seleccionada deberá conservarse al recargar la aplicación.

### Gestión de peticiones

Se deberá utilizar `AbortController` para cancelar las solicitudes cuando corresponda.

Además, se deberá contemplar el caso en que una petición ya haya terminado o una respuesta llegue justo antes de procesar la cancelación.

El manejo de errores debe distinguir entre una cancelación esperada y un fallo real de la .

Una cancelación por cambio de ciudad no deberá mostrarse como un error al usuario.

---

## RF-09. Caché de datos meteorológicos

La aplicación deberá implementar una caché para evitar solicitudes innecesarias.

La clave de caché deberá contemplar, como mínimo:

- Identificador de ciudad o coordenadas.
- Fecha consultada.
- Tipo de dato o fuente, cuando corresponda.

Los datos meteorológicos de una misma ciudad y fecha no deberán volver a solicitarse si existe una entrada válida en la caché.

### Comportamiento esperado

- Al cambiar de ciudad, se consultará la caché antes de realizar una petición.
- Al volver a una ciudad previamente visitada, se reutilizarán los datos almacenados si siguen siendo válidos.
- La caché no deberá mezclar datos de ciudades distintas.
- Una entrada incompleta o fallida no deberá tratarse como un resultado satisfactorio.
- Las peticiones concurrentes de los mismos datos deberán evitar duplicarse cuando sea razonable.

Se deberá documentar la política de expiración de la caché, especialmente para los datos futuros, que pueden cambiar con nuevas actualizaciones del pronóstico.

Como mejora adicional, se puede persistir la caché en `localStorage`, siempre que se controle su tamaño y se valide la información recuperada.

---

# 4. Requisitos técnicos obligatorios

La aplicación debe desarrollarse con React y TypeScript.

Se recomienda utilizar Vite para configurar el entorno de desarrollo.

## RT-01. Estado global con `useReducer`

Se deberá utilizar `useReducer` para gestionar el estado compartido de la aplicación.

Como mínimo, el diseño deberá contemplar:

- Jornadas meteorológicas.
- Estados de carga y error.
- Filtros activos.
- Ordenamiento.
- Selección de jornadas.
- Jornadas investigadas.
- Contadores necesarios para los logros.

No es obligatorio almacenar todos estos datos en un único objeto si la arquitectura propuesta justifica una separación adecuada.

Sin embargo, debe existir una gestión de estado coherente que evite modificaciones dispersas e inconsistentes.

Las acciones del reducer deberán estar tipadas.

Se recomienda utilizar una unión discriminada para definir las acciones permitidas.

## RT-02. Context y Provider

Se deberá crear un contexto de aplicación que gestione:

- Ciudad seleccionada.
- Tema visual.
- Estado compartido que requieran los componentes.

El usuario podrá alternar entre tema claro y oscuro.

El tema deberá aplicarse de manera consistente a toda la interfaz y conservarse al recargar la aplicación.

No se deberá utilizar Context indiscriminadamente para todos los estados locales.

Se valorará que el candidato sepa diferenciar entre estado global, estado derivado y estado local de un componente.

## RT-03. Hooks personalizados

Se deberán implementar, como mínimo, los siguientes hooks.

### `useWeather(city, range)`

Responsable de coordinar la carga meteorológica.

Deberá contemplar:

- Consulta a la .
- Cancelación de peticiones.
- Gestión de estados asíncronos.
- Reintentos.
- Uso de la caché.
- Normalización de los datos recibidos.

La firma concreta puede adaptarse si existe una justificación técnica clara.

### `useLocalStorage`

Responsable de sincronizar un estado con `localStorage`.

Debe contemplar:

- Inicialización desde el almacenamiento.
- Persistencia de cambios.
- Valores iniciales.
- JSON inválido o datos corruptos.
- Acceso no disponible al almacenamiento.
- Compatibilidad con el ciclo de renderizado de React.

No deberá producir errores si la información guardada es inválida.

### `useAchievements`

Responsable de gestionar el desbloqueo y la persistencia de logros.

Debe evitar duplicaciones y separar las reglas de negocio de la presentación visual.

## RT-04. `useMemo` y `useCallback`

Se deberá utilizar memoización donde aporte un beneficio real.

Se espera encontrar, como mínimo:

- Cálculo de anomalías mediante datos derivados.
- Filtrado y ordenamiento de jornadas.
- Funciones de interacción estables cuando beneficien a componentes memoizados.

No se valorará el uso indiscriminado de estos hooks.

El candidato deberá poder explicar por qué los utiliza y qué problema pretenden resolver.

## RT-05. `React.memo`

El componente `DayCapsule` deberá utilizar `React.memo`.

El objetivo es evitar renderizados innecesarios cuando cambien filtros u otros estados que no modifiquen las propiedades de una jornada.

La implementación deberá evitar que las propiedades cambien de referencia sin necesidad.

No se exige que el componente nunca se renderice de nuevo, sino que su estrategia de memoización sea coherente con las propiedades que recibe.

## RT-06. `useRef`

Se deberá utilizar `useRef` para, al menos, dos propósitos:

1. Mantener una referencia al controlador de las peticiones asíncronas.
2. Permitir el desplazamiento programático hasta una jornada concreta.

Al seleccionar una jornada desde un panel auxiliar, la aplicación podrá desplazar la línea temporal hasta su cápsula.

La implementación deberá funcionar tanto con navegación manual como con desplazamiento programático.

## RT-07. `React.lazy` y `Suspense`

El panel de comparación deberá cargarse de forma diferida.

Mientras se descarga el componente, se mostrará un indicador de carga apropiado.

Se valorará la separación del panel en un módulo independiente.

## RT-08. Error Boundary

Se deberá implementar un Error Boundary que capture errores de renderizado en el área de la línea temporal.

Debe proporcionar un mensaje comprensible y una acción de recuperación.

El Error Boundary deberá estar separado del manejo de errores de las peticiones HTTP.

**Importante:** un Error Boundary tradicional no captura automáticamente los errores producidos por una promesa rechazada dentro de un efecto. Por eso, los errores de Open-Meteo deberán gestionarse explícitamente en la capa asíncrona.

## RT-09. Reintentos con backoff exponencial

Las solicitudes que fallen por causas recuperables deberán poder reintentarse automáticamente.

Se permiten como máximo dos reintentos después de la petición inicial.

Por tanto, una operación puede ejecutarse hasta tres veces en total.

La espera entre reintentos deberá crecer exponencialmente.

Por ejemplo:

- Primer fallo: esperar 500 ms.
- Segundo fallo: esperar 1.000 ms.

Los valores son orientativos.

No se deberá reintentar una petición que haya sido cancelada intencionadamente.

Tampoco se recomienda reintentar indefinidamente ante errores que no se resolverán repitiendo la solicitud, como parámetros inválidos.

El usuario deberá poder iniciar un nuevo intento manualmente después de un error recuperable.

---

# 5. Integración con Open-Meteo

La aplicación utilizará los servicios públicos de Open-Meteo.

No es necesario utilizar una  key para los endpoints indicados.

## 5.1. Pronóstico

Endpoint:

```text
https://.open-meteo.com/v1/forecast
```

Parámetros mínimos:

```text
latitude
longitude
daily
timezone
forecast_days
```

Variables requeridas:

```text
temperature_2m_max
temperature_2m_min
precipitation_sum
windspeed_10m_max
weather_code
```

Se recomienda solicitar explícitamente las unidades que utilizará la interfaz cuando corresponda.

Por ejemplo, las temperaturas en grados Celsius y el viento en kilómetros por hora.

## 5.2. Datos históricos

Endpoint:

```text
https://archive-.open-meteo.com/v1/archive
```

Se utilizará para recuperar las jornadas pasadas.

Los parámetros `start_date` y `end_date` deberán calcularse dinámicamente.

No se deben dejar fechas fijas en el código.

### Consideración importante sobre las fechas

La fecha actual debe calcularse utilizando una referencia temporal coherente con la zona horaria de la ciudad.

La aplicación deberá construir una línea temporal con:

- Siete fechas anteriores al día actual.
- El día actual.
- Seis fechas posteriores al día actual.

Esto produce catorce jornadas distintas.

Como los datos históricos pueden presentar retrasos de disponibilidad, el sistema deberá gestionar los datos ausentes sin asumir que una respuesta vacía equivale a un día con temperaturas de cero grados.

## 5.3. Normalización de datos

Las respuestas de ambos endpoints deberán transformarse a un modelo interno común.

Por ejemplo:

```ts
interface WeatherDay {
  date: string;
  temperatureMax: number | null;
  temperatureMin: number | null;
  precipitation: number | null;
  windSpeedMax: number | null;
  weatherCode: number | null;
}
```

Este modelo es orientativo y puede ampliarse.

La normalización deberá evitar que la interfaz dependa directamente de la estructura original de las respuestas HTTP.

También deberá comprobarse que las series diarias estén alineadas correctamente con sus fechas.

No se deberán asociar temperaturas o precipitaciones a una fecha incorrecta por asumir que dos arrays tienen siempre la misma longitud.

## 5.4. Manejo de datos ausentes

Cuando una jornada no tenga información disponible, la interfaz deberá:

- Identificar la jornada por su fecha.
- Mostrar un estado apropiado.
- Evitar cálculos con valores inexistentes.
- Permitir reintentar la carga cuando corresponda.
- Mantener operativas las jornadas que sí tengan datos válidos.

Se valorará especialmente que un fallo parcial no impida visualizar todos los datos que sí se han recuperado.

---

# 6. Accesibilidad y experiencia de usuario

La aplicación deberá ser accesible mediante teclado y proporcionar información comprensible para tecnologías de asistencia.

## Navegación por teclado

La línea temporal deberá implementarse mediante una estructura semántica apropiada.

Si se utiliza el patrón de lista seleccionable, se deberá contemplar:

```tsx
<div role="listbox" aria-label="Línea temporal climática">
  {/* Cápsulas */}
</div>
```

Cada elemento deberá comunicar correctamente su estado de selección.

Se deberán implementar:

- Flecha derecha: avanzar a la siguiente jornada.
- Flecha izquierda: regresar a la jornada anterior.
- Inicio: seleccionar la primera jornada.
- Fin: seleccionar la última jornada.
- Enter o espacio: activar la acción de la jornada.

El comportamiento debe evitar conflictos con los controles internos de la interfaz.

También deberá mantenerse visible el foco del teclado.

Si se utiliza `role="listbox"`, se deberá implementar el patrón de interacción correspondiente, incluyendo una gestión coherente del foco y `aria-selected`. No basta con añadir atributos ARIA sin implementar su comportamiento.

## Diseño adaptable

La aplicación deberá funcionar correctamente en:

- Escritorio.
- Tablet.
- Móvil.

Se evaluará especialmente que los filtros y la comparación sigan siendo utilizables en pantallas pequeñas.

## Estados de la interfaz

Se deberán contemplar, como mínimo:

- Carga inicial.
- Carga parcial.
- Error de .
- Error de renderizado.
- Resultado vacío.
- Datos disponibles.
- Jornada investigada.
- Anomalías encontradas.
- Ninguna anomalía.
- Comparación disponible.
- Logros desbloqueados.

Los skeletons deberán mantener una estructura visual similar a las cápsulas reales para reducir los saltos de diseño durante la carga.

---

# 7. Arquitectura sugerida

La estructura propuesta es una referencia, no una obligación.

Se valorará una arquitectura que separe la integración externa, la lógica de negocio y la interfaz.

```text
src/
├── /
│   └── openMeteo.ts
│
├── components/
│   ├── DayCapsule.tsx
│   ├── Timeline.tsx
│   ├── ComparisonPanel.tsx
│   ├── Filters.tsx
│   ├── AchievementsBar.tsx
│   ├── Skeletons.tsx
│   └── ErrorBoundary.tsx
│
├── context/
│   └── AppContext.tsx
│
├── hooks/
│   ├── useWeather.ts
│   ├── useLocalStorage.ts
│   └── useAchievements.ts
│
├── utils/
│   ├── anomalies.ts
│   ├── weatherClassification.ts
│   ├── dateRange.ts
│   └── achievements.ts
│
├── types/
│   └── weather.ts
│
├── App.tsx
└── main.tsx
```

Se recomienda separar también la lógica de filtrado y ordenamiento si su complejidad lo justifica.

La capa de  no deberá contener código de presentación.

Los componentes visuales no deberán realizar directamente las peticiones a Open-Meteo.

---

# 8. Testing obligatorio

Se utilizará **Vitest y React Testing Library**.

La aplicación deberá incluir al menos cuatro pruebas automatizadas: dos de lógica y dos de integración o interfaz.

Aunque el mínimo exigido sea cuatro, se valorará una cobertura mayor de los casos importantes.

## Test 1. Cálculo de anomalías

Verificar que el cálculo identifique correctamente una temperatura fuera del umbral establecido.

También se deberá probar el comportamiento cuando todas las temperaturas son iguales.

## Test 2. Hook personalizado

Probar `useWeather` o `useLocalStorage`.

Por ejemplo, comprobar que `useWeather`:

- Comienza en estado de carga.
- Devuelve los datos cuando la petición termina correctamente.
- Gestiona los errores.
- No actualiza el estado con una respuesta obsoleta después de cambiar de ciudad.

Se deberán utilizar mocks para evitar depender de la disponibilidad real de Open-Meteo durante las pruebas.

## Test 3. Componente `DayCapsule`

Comprobar que una cápsula muestra correctamente la fecha y las variables meteorológicas.

También se deberá verificar que el estado de anomalía o investigación se comunica adecuadamente.

## Test 4. Filtros o comparación

Verificar que el usuario pueda aplicar un filtro y que la línea temporal muestre únicamente las jornadas que cumplen las condiciones.

Alternativamente, se podrá probar la selección de dos jornadas y la aparición del panel de comparación.

### Requisitos generales

- Las pruebas deberán ser reproducibles.
- No deberán depender de datos meteorológicos cambiantes.
- Los mocks deberán representar respuestas realistas.
- Se deberán probar tanto los casos satisfactorios como los errores relevantes.

No es necesario alcanzar un porcentaje de cobertura específico, pero las pruebas deben validar comportamiento real, no limitarse a comprobar que un componente se renderiza.

---

# 9. Persistencia

La aplicación deberá guardar en `localStorage`:

- Ciudad seleccionada.
- Tema visual.
- Logros desbloqueados.
- Jornadas investigadas.
- Filtros activos, si se decide persistirlos.

Al recargar la aplicación, el usuario deberá recuperar estas preferencias.

No será obligatorio conservar la selección temporal de dos jornadas ni mantener abierto el panel de comparación.

### Validación

La aplicación deberá poder recuperarse cuando:

- No existan datos almacenados.
- Los datos estén corruptos.
- Se haya guardado una versión anterior de la estructura.
- El almacenamiento no esté disponible.

Se valorará que los datos persistidos estén versionados cuando la complejidad del proyecto lo justifique.

---

# 10. Criterios de aceptación

Antes de considerar terminada la prueba, se deberá verificar lo siguiente.

| ID | Criterio de aceptación | Prioridad |
|---|---|---|
| CA-01 | Se muestran catorce fechas distintas, incluyendo el día actual una sola vez. | Obligatoria |
| CA-02 | Se muestran los datos meteorológicos disponibles para la ciudad seleccionada. | Obligatoria |
| CA-03 | Los días sin datos se representan sin inventar valores meteorológicos. | Obligatoria |
| CA-04 | Se pueden investigar jornadas y conservar su estado al recargar. | Obligatoria |
| CA-05 | Se pueden seleccionar y comparar dos jornadas válidas. | Obligatoria |
| CA-06 | Las anomalías se calculan mediante media y desviación estándar. | Obligatoria |
| CA-07 | Los filtros pueden combinarse sin nuevas peticiones. | Obligatoria |
| CA-08 | El ordenamiento funciona en todos los criterios establecidos. | Obligatoria |
| CA-09 | Los logros se desbloquean una sola vez y persisten. | Obligatoria |
| CA-10 | El cambio de ciudad cancela o invalida las solicitudes anteriores. | Obligatoria |
| CA-11 | Existe una caché que evita consultas innecesarias. | Obligatoria |
| CA-12 | Se implementan los hooks y patrones técnicos solicitados. | Obligatoria |
| CA-13 | La interfaz permite navegar mediante teclado. | Obligatoria |
| CA-14 | Existen pruebas automatizadas ejecutables. | Obligatoria |
| CA-15 | La aplicación dispone de tema claro y oscuro. | Obligatoria |
| CA-16 | Los estados de carga, error y resultado vacío son comprensibles. | Obligatoria |

---

# 11. Entregables

El candidato deberá entregar:

1. **Repositorio Git** con el código fuente.
2. **README.md** con instrucciones para instalar y ejecutar el proyecto.
3. Descripción breve de la arquitectura elegida.
4. Explicación de las decisiones técnicas más importantes.
5. Instrucciones para ejecutar las pruebas.
6. Evidencias de funcionamiento mediante capturas o una demostración.
7. Enlace a una versión desplegada, si dispone de ella.

El README deberá explicar cómo se gestionan las peticiones, las anomalías y la persistencia.

No es necesario escribir documentación extensa, pero las decisiones que afecten al comportamiento de la aplicación deben quedar claras.

---

# 12. Rúbrica de evaluación

La puntuación total será de 100 puntos.

| Criterio | Peso | Qué se evalúa |
|---|---:|---|
| Funcionalidad | 25 puntos | Línea temporal, filtros, comparación, anomalías y logros. |
| Arquitectura React | 20 puntos | Hooks, Context, reducer, estado derivado y componentes reutilizables. |
| Gestión asíncrona | 15 puntos | Cancelación, caché, errores, reintentos y prevención de condiciones de carrera. |
| UX y accesibilidad | 15 puntos | Responsive, navegación por teclado, semántica, skeletons y estados vacíos. |
| Calidad del código | 10 puntos | TypeScript, separación de responsabilidades, legibilidad y consistencia. |
| Testing | 10 puntos | Calidad y relevancia de las pruebas automatizadas. |
| Documentación y decisiones técnicas | 5 puntos | README y justificación de la implementación. |
| **Total** | **100 puntos** | |

### Interpretación orientativa

| Puntuación | Evaluación |
|---|---|
| 90-100 | Excelente: implementación sólida, mantenible y bien probada. |
| 75-89 | Muy buena: cumple los requisitos con pequeños aspectos mejorables. |
| 60-74 | Aceptable: funcionalidad principal correcta, con algunas carencias técnicas. |
| Menos de 60 | Insuficiente: faltan funcionalidades importantes o existen problemas estructurales. |

La puntuación no deberá basarse exclusivamente en que la aplicación se vea bien. Se evaluará tanto el comportamiento como la calidad de la implementación.

---

# 13. Retos adicionales

Los siguientes retos son opcionales y no forman parte de los requisitos mínimos.

## Bonus 1. Cronista del futuro

Permitir al usuario elegir un intervalo personalizado de fechas.

La aplicación deberá validar el intervalo y adaptar las consultas a los límites de los endpoints utilizados.

## Bonus 2. Animaciones

Utilizar Framer Motion para animar:

- La aparición de jornadas.
- La transición al estado investigado.
- El desbloqueo de logros.
- La apertura del panel de comparación.

Las animaciones no deberán dificultar la interacción ni ignorar las preferencias de movimiento reducido del sistema.

## Bonus 3. Persistencia ampliada

Persistir la caché de datos meteorológicos y restaurar el estado de la aplicación cuando corresponda.

Se deberá gestionar la expiración de los datos y evitar que una caché antigua se presente como si fuera un pronóstico actualizado.

## Bonus 4. PWA

Permitir instalar la aplicación y ofrecer una experiencia básica cuando no haya conexión.

Se deberá distinguir entre datos disponibles sin conexión y datos que requieren una consulta nueva.

## Bonus 5. Storybook

Documentar los componentes principales y demostrar sus estados visuales.

Por ejemplo:

- `DayCapsule` normal.
- `DayCapsule` investigada.
- `DayCapsule` anómala.
- `DayCapsule` en carga.
- `DayCapsule` con error.

## Bonus 6. Rendimiento

Demostrar que la aplicación evita renderizados innecesarios mediante herramientas de profiling de React.

No bastará con añadir `React.memo` y `useCallback`: se deberá explicar qué renderizados se evitan y por qué.

---

# 14. Preguntas para la defensa técnica

Una vez entregado el proyecto, el evaluador podrá realizar preguntas sobre las decisiones de implementación.

Estas preguntas no forman parte del desarrollo obligatorio, pero permiten comprobar que el candidato comprende el código.

### React y arquitectura

1. ¿Por qué utilizaste `useReducer` en lugar de varios `useState`?
2. ¿Qué estado decidiste mantener en Context y qué estado dejaste local?
3. ¿Qué diferencia existe entre estado almacenado y estado derivado?
4. ¿Por qué utilizaste `useMemo` para calcular las anomalías?
5. ¿En qué situaciones `React.memo` no evitaría un renderizado?
6. ¿Qué problema puede producir una función que cambia de referencia en cada renderizado?
7. ¿Cómo evitarías que un cambio en el tema visual provocara renderizados innecesarios en toda la aplicación?
8. ¿Qué ventajas y desventajas tiene dividir la aplicación en hooks y componentes más pequeños?

### Peticiones asíncronas

9. ¿Qué problema resuelve `AbortController`?
10. ¿Qué ocurre si una petición antigua termina después de cambiar de ciudad?
11. ¿Cómo distinguirías una cancelación de un error real?
12. ¿Qué errores deberían activar los reintentos?
13. ¿Cómo evitarías que dos componentes soliciten simultáneamente los mismos datos?
14. ¿Qué estrategia utilizarías para determinar cuándo expira la caché?

### Lógica de negocio

15. ¿Por qué las anomalías deben calcularse antes de aplicar los filtros de presentación?
16. ¿Qué sucede si la desviación estándar es cero?
17. ¿Cómo tratarías los días con información incompleta?
18. ¿Cómo evitarías contabilizar varias veces una misma jornada investigada?
19. ¿Qué diferencia existe entre un logro desbloqueado y un contador de progreso?
20. ¿Cómo comprobarías que el ordenamiento por rareza funciona correctamente?

### Accesibilidad y testing

21. ¿Por qué no basta con añadir `role="listbox"` a un contenedor?
22. ¿Qué diferencia existe entre un Error Boundary y el manejo de errores de una petición?
23. ¿Cómo probarías un hook que consume una  sin depender de Internet?
24. ¿Cómo comprobarías que una respuesta antigua no sobrescribe los datos actuales?
25. ¿Qué casos límite probarías antes de entregar la aplicación?

---

# 15. Recomendaciones para el candidato

Se recomienda desarrollar la aplicación en el siguiente orden:

**Fase 1. Fundamentos**
- Configurar React, TypeScript y Vitest.
- Definir los tipos de datos.
- Implementar la integración con Open-Meteo.
- Normalizar las respuestas.
- Construir la línea temporal.

**Fase 2. Lógica**
- Implementar los filtros.
- Calcular anomalías y rareza.
- Incorporar el ordenamiento.
- Implementar el sistema de investigación.

**Fase 3. Interacción**
- Crear la comparación de jornadas.
- Implementar los logros.
- Añadir la selección por teclado.
- Incorporar los estados de carga y error.

**Fase 4. Arquitectura y robustez**
- Integrar `useReducer` y Context.
- Implementar los hooks personalizados.
- Incorporar caché, cancelación y reintentos.
- Aplicar memoización cuando corresponda.
- Implementar la carga diferida y el Error Boundary.

**Fase 5. Calidad**
- Añadir persistencia.
- Completar las pruebas.
- Verificar el diseño responsive.
- Documentar las decisiones técnicas.

Este orden es orientativo. El candidato podrá elegir otro enfoque si mantiene una arquitectura coherente.

---

## Mi recomendación final

Si vas a utilizar esta prueba para evaluar a una persona que postula a un puesto frontend, conservaría **todos los requisitos técnicos como objetivos, pero distinguiría entre lo imprescindible para aprobar y lo que demuestra un nivel avanzado**.

Hay una razón: esta prueba combina integración de s, algoritmos, arquitectura, accesibilidad, persistencia, testing y optimización. Si todos esos aspectos deben implementarse en seis horas, corres el riesgo de evaluar la velocidad de escritura más que la capacidad de ingeniería.

Para una evaluación equilibrada, establecería tres niveles:

- **Nivel 1: funcionalidad:** línea temporal, filtros, anomalías y comparación.
- **Nivel 2: calidad técnica:** hooks, reducer, cancelación, caché, accesibilidad y pruebas.
- **Nivel 3: excelencia:** rendimiento demostrado, persistencia ampliada, PWA y animaciones.

Así podrás identificar a alguien que domina React aunque no termine todos los extras, y diferenciarlo de alguien que entrega una interfaz atractiva pero tiene problemas con la lógica o la arquitectura.

**La principal mejora respecto de la versión original es que ahora cada requisito tiene un comportamiento verificable.** Esto facilita desarrollar la aplicación, revisar soluciones de otros candidatos y defender las decisiones técnicas durante una entrevista.