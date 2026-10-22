import { useEffect, useMemo, useState } from 'react';
import { ClimateTimeline } from './componet/ClimateTimeline';
import { ThermalRange } from './componet/ThermalRange';
import { DEFAULT_FILTERS, type TimelineFilters } from '../../utils/filters';
import { addDays, hoyISO } from '../../helper/time';
import type { Temperatures } from '../../types/temperatures.types';
import { API_CONFIG } from '../../config/api';
import type { ArchiveTemperatures } from '../../types/archiveTemperatures.types';
import { normalizeData } from '../../helper/normalizcionDatos';
import type { WeatherDay } from '../../types/weather';
import { SummaryCard } from './componet/SummaryCard';
import { Icon } from '../../components/ui/Icon';

const TIME_ENDPOINT = API_CONFIG.FORECAST_BASE;
const ARCHIVE_ENDPOINT = API_CONFIG.ARCHIVE_BASE;
const COUNT_DAYS = 7;

export interface ParametroDatos {
    cantidadDias: number;
    error: string | null;
    Tiempo?: Temperatures | null;
    TiempoArchivo?: ArchiveTemperatures | null;
}

export const DashboardPage = () => {
    const [time, setTime] = useState<Temperatures | null>(null);
    const [archiveTime, setArchiveTime] = useState<ArchiveTemperatures | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<TimelineFilters>(DEFAULT_FILTERS);

    useEffect(() => {
        const coordenadas = ['-33.4489', '-70.6693'];

        const archiveStart = addDays(hoyISO, -7);
        const archiveEnd = addDays(hoyISO, -1);

        const dailyVars =
            'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weather_code';

        const controller = new AbortController();

        const forecastURL =
            `${TIME_ENDPOINT}/forecast?latitude=${coordenadas[0]}&longitude=${coordenadas[1]}` +
            `&daily=${dailyVars}&forecast_days=${COUNT_DAYS}&timezone=auto`;

        const archiveURL =
            `${ARCHIVE_ENDPOINT}/archive?latitude=${coordenadas[0]}&longitude=${coordenadas[1]}` +
            `&daily=${dailyVars}&start_date=${archiveStart}&end_date=${archiveEnd}&timezone=auto`;

        setLoading(true);

        Promise.all([
            fetch(forecastURL, { signal: controller.signal }).then((r) => r.json()),
            fetch(archiveURL, { signal: controller.signal }).then((r) => r.json()),
        ])
            .then(([forecastData, archiveData]) => {
                setTime(forecastData);
                setArchiveTime(archiveData);
                setError(null);
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;
                setError(err.message);
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, []);

    // Datos normalizados (14 días ordenados)
    const days: WeatherDay[] = useMemo(() => {
        return [
            ...normalizeData(archiveTime, 'archive'),
            ...normalizeData(time, 'forecast'),
        ].sort((a, b) => a.date.localeCompare(b.date));
    }, [archiveTime, time]);

    // Meta objeto derivado (no es estado, se calcula con useMemo)
    const datos: ParametroDatos = useMemo(
        () => ({
            cantidadDias: COUNT_DAYS,
            error,
            Tiempo: time,
            TiempoArchivo: archiveTime,
        }),
        [error, time, archiveTime],
    );

    return (
        <>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
                <div className="flex flex-col gap-1">
                    <div
                        className="flex items-center gap-space-xs text-secondary font-mono-badge text-mono-badge uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[14px]">public</span>
                        <span>Red Global Copernicus · Nodo Ibérico N-404</span>
                    </div>
                    <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Observatorio climático</h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                        Explora patrones, detecta anomalías y registra descubrimientos en el lienzo bioclimático.
                    </p>
                </div>
                <div
                    className="flex flex-wrap items-center gap-space-sm bg-surface-container-low px-space-md py-2.5 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
                        <span className="w-2 h-2 rounded-full bg-secondary -ml-3.5"></span>
                        <span className="font-label-md text-label-md text-on-surface font-semibold">Madrid</span>
                        <span className="font-mono-data text-mono-data text-on-surface-variant">(Estación Retiro Central · 667m
                            s.n.m.)</span>
                    </div>
                    <div className="hidden sm:block w-px h-4 bg-surface-container-highest"></div>
                    <div className="flex items-center gap-space-sm font-mono-badge text-mono-badge">
                        <span
                            className="inline-flex items-center gap-1 bg-surface-container-high text-secondary px-2 py-0.5 rounded">
                            <span className="material-symbols-outlined text-[13px]">wifi_tethering</span> Conectado
                        </span>
                        <span className="text-on-surface-variant">Latencia: <strong
                            className="text-primary font-medium">24ms</strong></span>
                        <span className="text-on-surface-variant">Sync: <strong className="text-on-surface font-medium">hace
                            2m</strong></span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-space-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                    <SummaryCard
                        label="Temp. Máx. Media"
                        icon="thermostat"
                        tone="primary"
                        value="24.8"
                        unit="°C"
                        badge={
                            <>
                                <Icon name="arrow_upward" size={13} />
                                <span>+1.9 °C</span>
                            </>
                        }
                        meta="vs. 1991-2020"
                        sparklinePath="M0,15 Q20,16 40,8 T80,11 L100,3"
                    />

                    <SummaryCard
                        label="Precip. Acumulada"
                        icon="rainy"
                        tone="secondary"
                        value="18.4"
                        unit="mm"
                        badge={
                            <>
                                <Icon name="water_drop" size={13} />
                                <span>4 eventos</span>
                            </>
                        }
                        meta="Ciclo activo"
                        sparklinePath="M0,18 L30,18 L35,6 L45,18 L70,18 L75,2 L85,18 L100,18"
                    />

                    <SummaryCard
                        label="Viento Máx. Registrado"
                        icon="air"
                        tone="tertiary"
                        value="62"
                        unit="km/h"
                        badge="Racha NO"
                        meta="14 Oct (16:40h)"
                        sparklinePath="M0,16 Q25,12 50,14 T80,8 L100,2"
                    />

                    <SummaryCard
                        label="Anomalías Detectadas"
                        icon="warning"
                        tone="error"
                        value="3"
                        unit="eventos"
                        unitTone="muted"
                        badge="+3.2σ Térmica"
                        meta="2 térm · 1 pluv"
                        sparklinePath="M0,17 L40,17 L45,4 L55,17 L85,6 L95,17 L100,17"
                    />
                </div>

                <ThermalRange
                    filters={filters}
                    onChange={setFilters}
                    onReset={() => setFilters(DEFAULT_FILTERS)}
                />

                <ClimateTimeline
                    datos={datos}
                    weatherDay={days}
                    loading={loading}
                    filters={filters}
                    onFiltersChange={setFilters}
                />
            </div>
        </>

    );
};