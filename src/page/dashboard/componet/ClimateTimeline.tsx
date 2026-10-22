import { useMemo, useState } from 'react';
import { getOffsetLabel } from '../../../helper/time';
import type { WeatherDay } from '../../../types/weather';
import { computeAnomalies } from '../../../utils/anomalies';
import { DayCapsule } from './DayCapsule';
import { Button } from '../../../components/ui/Button';
import { applyFilters, type TimelineFilters } from '../../../utils/filters';
import { DateFilter } from './DateFilter';
import type { ParametroDatos } from '../DashboardPage';

interface ClimateTimelineProps {
  datos: ParametroDatos;
  weatherDay: WeatherDay[];
  loading: boolean;
  /** "Hoy" en la zona horaria de la ciudad */
  today: string;
  filters: TimelineFilters;
  onFiltersChange: (next: TimelineFilters) => void;
}

export const ClimateTimeline = ({
  datos,
  weatherDay,
  loading,
  today,
  filters,
  onFiltersChange,
}: ClimateTimelineProps) => {
  const { cantidadDias, error } = datos;
  // 7 pasados + hoy + 6 futuros = 14 (cantidadDias * 2)
  const totalDias = cantidadDias * 2;

  const [isCompact, setIsCompact] = useState(false);

  // Anomalías SIEMPRE sobre todas las jornadas (filtros no deben alterarlas)
  const anomalies = useMemo(() => computeAnomalies(weatherDay), [weatherDay]);

  // Filtrado (usa las anomalías como parámetro, no las recalcula)
  const visibleDays = useMemo(
    () => applyFilters(weatherDay, anomalies, filters),
    [weatherDay, anomalies, filters],
  );

  // Placeholder hasta que exista el reducer de selección (RT-01)
  const canCompare = !loading && weatherDay.length >= 2;

  const handleToggleCompact = () => setIsCompact((prev) => !prev);

  const handleOpenComparison = () => {
    // TODO: abrir panel React.lazy + Suspense (RT-07)
    alert('Función de comparación A/B aún no implementada.');
  };

  return (
    <>
      {error && (
        <div
          role="alert"
          className="bg-error-container text-on-error-container p-2 rounded"
        >
          Error: {error}
        </div>
      )}

      <div className="flex flex-col gap-space-md">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="material-symbols-outlined text-primary text-[22px]">
              timeline
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Línea temporal climática
            </h2>
            <span className="font-mono-badge text-mono-badge text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded">
              {totalDias} jornadas · {cantidadDias} ant. · Hoy · {cantidadDias - 1} post.
            </span>
            {weatherDay.length > 0 && visibleDays.length !== weatherDay.length && (
              <span className="font-mono-badge text-mono-badge text-secondary bg-surface-container-low px-2 py-0.5 rounded">
                Mostrando {visibleDays.length} de {weatherDay.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm">
            <DateFilter
              dates={weatherDay.map((d) => d.date)}
              value={filters.dateRange}
              onChange={(dateRange) => onFiltersChange({ ...filters, dateRange })}
              today={today}
            />
            <Button
              variant="subtle"
              size="md"
              icon="splitscreen"
              onClick={handleToggleCompact}
              aria-pressed={isCompact}
            >
              {isCompact ? 'Expandir' : 'Compacta'}
            </Button>
            <Button
              variant="accent"
              size="md"
              icon="compare_arrows"
              onClick={handleOpenComparison}
              disabled={!canCompare}
            >
              Comparar [A / B]
            </Button>
          </div>
        </div>

        {/* Skeletons mientras carga (CA-16) */}
        {loading && weatherDay.length === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-space-sm">
            {Array.from({ length: totalDias }).map((_, i) => (
              <div
                key={i}
                className="bg-surface-container-low p-space-sm rounded-xl h-40 animate-pulse"
                aria-hidden="true"
              />
            ))}
          </div>
        )}

        {/* Estado vacío por filtros (RF-06) */}
        {!loading && weatherDay.length > 0 && visibleDays.length === 0 && (
          <div className="flex items-center gap-space-sm bg-surface-container-low text-on-surface-variant p-space-md rounded-lg font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[20px]">filter_alt_off</span>
            Ninguna jornada coincide con los filtros seleccionados.
          </div>
        )}

        {/* Grid de cápsulas */}
        {!loading && visibleDays.length > 0 && (
          <div
            className={
              isCompact
                ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-space-xs'
                : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-space-sm'
            }
          >
            {visibleDays.map((day) => (
              <DayCapsule
                key={day.date}
                day={day}
                anomaly={anomalies.byDate[day.date]}
                isToday={day.date === today}
                offsetLabel={getOffsetLabel(day.date, today)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};