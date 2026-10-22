import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { DataToggle } from "../../../components/ui/DataToggle";
import { WeatherFilterGroup } from "./WeatherFilterGroup";
import { RangeSlider } from "../../../components/ui/RangeSlider";
import { isDefaultFilters, TEMP_BOUNDS, type SortKey, type TimelineFilters } from "../../../utils/filters";

interface ThermalRangeProps {
    filters: TimelineFilters;
    onChange: (next: TimelineFilters) => void;
    onReset: () => void;
}

export const ThermalRange = ({ filters, onChange, onReset }: ThermalRangeProps) => {
    // Actualiza solo una propiedad y conserva el resto de filtros
    const update = <K extends keyof TimelineFilters>(key: K, value: TimelineFilters[K]) =>
        onChange({ ...filters, [key]: value });

    return (
        <div
            className="bg-surface-container-low p-space-md rounded-xl flex flex-col xl:flex-row items-center justify-between gap-space-md shadow-sm">
            <div className="w-full xl:w-auto flex flex-col md:flex-row items-start md:items-center gap-space-lg flex-1">
                <RangeSlider
                    label="Rango térmico"
                    min={TEMP_BOUNDS[0]}
                    max={TEMP_BOUNDS[1]}
                    value={filters.range}
                    onChange={(range) => update('range', range)}
                    format={(v) => `${v}°C`}
                    ticks={[0, 22, 45]}
                    className="w-full md:w-64"
                />

                <div
                    className="flex items-center bg-surface-container-lowest p-1 rounded-lg gap-1 overflow-x-auto max-w-full">
                    <WeatherFilterGroup value={filters.weather} onChange={(weather) => update('weather', weather)} />
                </div>
            </div>
            <div className="w-full xl:w-auto flex flex-wrap items-center justify-between xl:justify-end gap-space-sm">
                <DataToggle
                    label="Solo anomalías"
                    checked={filters.onlyAnomalies}
                    onChange={(checked) => update('onlyAnomalies', checked)}
                />
                <div className="relative flex items-center">
                  <Select
                        options={[
                            { value: 'fecha', label: 'Ordenar por: Fecha (Cronológica)' },
                            { value: 'tempMax', label: 'Temperatura máx.' },
                            { value: 'precipitacion', label: 'Precipitación' },
                            { value: 'rareza', label: 'Rareza estadística' },
                        ]}
                        value={filters.sortKey}
                        onChange={(e) => update('sortKey', e.target.value as SortKey)}
                        variant="subtle"
                        chevron="unfold_more"
                        className="w-full md:w-auto"
                    />
                </div>
                <Button
                    variant="subtle"
                    iconOnly
                    icon="swap_vert"
                    title={filters.sortDirection === 'asc' ? 'Orden ascendente' : 'Orden descendente'}
                    aria-label="Cambiar orden"
                    aria-pressed={filters.sortDirection === 'desc'}
                    onClick={() => update('sortDirection', filters.sortDirection === 'asc' ? 'desc' : 'asc')}
                />
                <Button
                    variant="quiet"
                    size="xs"
                    icon="restart_alt"
                    title="Restablecer filtros"
                    onClick={onReset}
                    disabled={isDefaultFilters(filters)}
                >
                    <span className="hidden sm:inline">Restablecer</span>
                </Button>
            </div>
        </div>
    )
}
