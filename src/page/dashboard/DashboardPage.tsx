import { useEffect, useMemo, useState } from 'react';
import { ClimateTimeline } from './componet/ClimateTimeline';
import { ThermalRange } from './componet/ThermalRange';
import { DEFAULT_FILTERS, type TimelineFilters } from '../../utils/filters';
import { addDays, formatDay, todayIn } from '../../helper/time';
import type { Temperatures } from '../../types/temperatures.types';
import { API_CONFIG } from '../../config/api';
import type { ArchiveTemperatures } from '../../types/archiveTemperatures.types';
import { normalizeData } from '../../helper/normalizcionDatos';
import type { WeatherDay } from '../../types/weather';
import { SummaryCard } from './componet/SummaryCard';
import { Icon } from '../../components/ui/Icon';
import { CITIES } from '../../constans/cities';
import { useCity } from '../../context/city-context';
import { Select } from '../../components/ui/Select';
import { computeAnomalies } from '../../utils/anomalies';

const TIME_ENDPOINT = API_CONFIG.FORECAST_BASE;
const ARCHIVE_ENDPOINT = API_CONFIG.ARCHIVE_BASE;
const COUNT_DAYS = 7;

// fetch solo rechaza por fallos de red: un 4xx/5xx hay que detectarlo con r.ok
const fetchJson = async <T,>(url: string, signal: AbortSignal): Promise<T> => {
    const res = await fetch(url, { signal });
    if (!res.ok) {
        // Open-Meteo responde { error: true, reason: "..." } cuando rechaza la consulta
        const body = await res.json().catch(() => null);
        throw new Error(body?.reason ?? `Error ${res.status} al consultar Open-Meteo`);
    }
    return res.json() as Promise<T>;
};

export interface ParametroDatos {
    cantidadDias: number;
    error: string | null;
    Tiempo?: Temperatures | null;
    TiempoArchivo?: ArchiveTemperatures | null;
}

interface FetchResult {
    /** Ciudad y fecha a las que pertenecen estos datos */
    key: string;
    forecast: Temperatures;
    archive: ArchiveTemperatures;
}

interface FetchFailure {
    key: string;
    message: string;
}

export const DashboardPage = () => {
    const { city, setCity } = useCity();
    // "Hoy" depende de la zona horaria de la ciudad, no de la del navegador
    const today = useMemo(() => todayIn(city.timezone), [city.timezone]);
    const requestKey = `${city.id}:${today}`;

    const [result, setResult] = useState<FetchResult | null>(null);
    const [failure, setFailure] = useState<FetchFailure | null>(null);
    const [filters, setFilters] = useState<TimelineFilters>(DEFAULT_FILTERS);

    useEffect(() => {
        const { id, latitude, longitude, timezone } = city;
        const key = `${id}:${today}`;

        const archiveStart = addDays(today, -7);
        const archiveEnd = addDays(today, -1);

        const dailyVars =
            'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weather_code';

        const controller = new AbortController();

        const forecastURL =
            `${TIME_ENDPOINT}/forecast?latitude=${latitude}&longitude=${longitude}` +
            `&daily=${dailyVars}&forecast_days=${COUNT_DAYS}&timezone=${encodeURIComponent(timezone)}`;

        const archiveURL =
            `${ARCHIVE_ENDPOINT}/archive?latitude=${latitude}&longitude=${longitude}` +
            `&daily=${dailyVars}&start_date=${archiveStart}&end_date=${archiveEnd}&timezone=${encodeURIComponent(timezone)}`;

        Promise.all([
            fetchJson<Temperatures>(forecastURL, controller.signal),
            fetchJson<ArchiveTemperatures>(archiveURL, controller.signal),
        ])
            .then(([forecast, archive]) => {
                if (controller.signal.aborted) return;
                setResult({ key, forecast, archive });
                setFailure(null);
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;
                setFailure({ key, message: err.message });
            });

        // Al cambiar de ciudad se cancela la petición anterior
        return () => controller.abort();
    }, [city, today]);

    // Solo valen los datos/errores de la ciudad actual: así nunca se ven datos de otra ciudad
    const current = result?.key === requestKey ? result : null;
    const error = failure?.key === requestKey ? failure.message : null;
    // Derivado, no estado: está cargando mientras no haya ni datos ni error para esta ciudad
    const loading = !current && !error;
    const time = current?.forecast ?? null;
    const archiveTime = current?.archive ?? null;

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

    // Anomalías SIEMPRE sobre todas las jornadas (filtros no deben alterarlas)
    const anomalies = useMemo(() => computeAnomalies(days), [days]);


    const summary = useMemo(() => {
        const isNum = (v: unknown): v is number =>
            typeof v === 'number' && Number.isFinite(v);

        // ─── 1. Temp. Máx. Media ───
        const validTemps = days.map((d) => d.temperatureMax).filter(isNum);
        const meanTemp =
            validTemps.length > 0
                ? validTemps.reduce((a, b) => a + b, 0) / validTemps.length
                : null;

        // Delta pasado vs. futuro (para el badge "+X.X °C")
        const pastTemps = days
            .filter((d) => d.source === 'archive')
            .map((d) => d.temperatureMax)
            .filter(isNum);
        const futureTemps = days
            .filter((d) => d.source === 'forecast')
            .map((d) => d.temperatureMax)
            .filter(isNum);

        const pastMean =
            pastTemps.length > 0
                ? pastTemps.reduce((a, b) => a + b, 0) / pastTemps.length
                : null;
        const futureMean =
            futureTemps.length > 0
                ? futureTemps.reduce((a, b) => a + b, 0) / futureTemps.length
                : null;
        const tempDelta =
            pastMean !== null && futureMean !== null ? futureMean - pastMean : null;

        // ─── 2. Precip. Acumulada ───
        const validPrecip = days.map((d) => d.precipitation).filter(isNum);
        const totalPrecip = validPrecip.reduce((a, b) => a + b, 0);
        const rainDays = validPrecip.filter((p) => p > 0.1).length;

        // ─── 3. Viento Máx. Registrado ───
        const windPairs = days
            .filter((d) => isNum(d.windSpeedMax))
            .map((d) => ({ date: d.date, wind: d.windSpeedMax as number }));
        const maxWind =
            windPairs.length > 0
                ? Math.max(...windPairs.map((x) => x.wind))
                : null;
        const maxWindDate =
            maxWind !== null
                ? windPairs.find((x) => x.wind === maxWind)?.date ?? null
                : null;

        // ─── 4. Anomalías Detectadas ───
        const anomalyEntries = Object.entries(anomalies.byDate).filter(
            ([, a]) => a.isAnomaly,
        );
        const anomalyCount = anomalyEntries.length;

        const warmCount = anomalyEntries.filter(
            ([, a]) => a.direction === 'above',
        ).length;
        const coldCount = anomalyEntries.filter(
            ([, a]) => a.direction === 'below',
        ).length;

        const topEntry = anomalyEntries
            .filter(([, a]) => a.z !== null)
            .sort((a, b) => (b[1].z ?? 0) - (a[1].z ?? 0))[0];
        const topAnomaly = topEntry
            ? { z: topEntry[1].z as number, direction: topEntry[1].direction }
            : null;

        return {
            // 1
            meanTemp,
            validTempDays: validTemps.length,
            pastMean,
            futureMean,
            tempDelta,
            // 2
            totalPrecip,
            rainDays,
            // 3
            maxWind,
            maxWindDate,
            // 4
            anomalyCount,
            warmCount,
            coldCount,
            topAnomaly,
        };
    }, [days, anomalies]);

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
                        <Select
                            label="Ciudad"
                            hideLabel
                            options={CITIES.map((c) => ({ value: c.id, label: c.name }))}
                            value={city.id}
                            onChange={(e) => {
                                const next = CITIES.find((c) => c.id === e.target.value);
                                if (next) setCity(next);
                            }}
                        />
                        <span className="font-mono-data text-mono-data text-on-surface-variant">
                            ({city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                            {time ? ` · ${Math.round(time.elevation)}m s.n.m.` : ''})
                        </span>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                        {/* ─── 1. Temp. Máx. Media ─── */}
                        <SummaryCard
                            label="Temp. Máx. Media"
                            icon="thermostat"
                            tone="primary"
                            value={
                                summary.meanTemp !== null ? summary.meanTemp.toFixed(1) : '—'
                            }
                            unit="°C"
                            badge={
                                summary.tempDelta !== null ? (
                                    <>
                                        <Icon
                                            name={summary.tempDelta >= 0 ? 'arrow_upward' : 'arrow_downward'}
                                            size={13}
                                        />
                                        <span>
                                            {summary.tempDelta >= 0 ? '+' : ''}
                                            {summary.tempDelta.toFixed(1)} °C
                                        </span>
                                    </>
                                ) : (
                                    <span>Sin datos</span>
                                )
                            }
                            meta={`${summary.validTempDays} días con datos`}
                            sparklinePath="M0,15 Q20,16 40,8 T80,11 L100,3"
                        />

                        {/* ─── 2. Precip. Acumulada ─── */}
                        <SummaryCard
                            label="Precip. Acumulada"
                            icon="rainy"
                            tone="secondary"
                            value={summary.totalPrecip.toFixed(1)}
                            unit="mm"
                            badge={
                                <>
                                    <Icon name="water_drop" size={13} />
                                    <span>
                                        {summary.rainDays} {summary.rainDays === 1 ? 'evento' : 'eventos'}
                                    </span>
                                </>
                            }
                            meta={
                                summary.rainDays > 0 ? 'Ciclo activo' : 'Sin precipitaciones'
                            }
                            sparklinePath="M0,18 L30,18 L35,6 L45,18 L70,18 L75,2 L85,18 L100,18"
                        />

                        {/* ─── 3. Viento Máx. Registrado ─── */}
                        <SummaryCard
                            label="Viento Máx. Registrado"
                            icon="air"
                            tone="tertiary"
                            value={summary.maxWind !== null ? Math.round(summary.maxWind).toString() : '—'}
                            unit="km/h"
                            badge="Racha máxima"
                            meta={
                                summary.maxWindDate
                                    ? formatDay(summary.maxWindDate)
                                    : 'Sin datos'
                            }
                            sparklinePath="M0,16 Q25,12 50,14 T80,8 L100,2"
                        />

                        {/* ─── 4. Anomalías Detectadas ─── */}
                        <SummaryCard
                            label="Anomalías Detectadas"
                            icon="warning"
                            tone="error"
                            value={summary.anomalyCount}
                            unit={summary.anomalyCount === 1 ? 'evento' : 'eventos'}
                            unitTone="muted"
                            badge={
                                summary.topAnomaly ? (
                                    <span>
                                        {summary.topAnomaly.direction === 'above' ? '+' : '−'}
                                        {summary.topAnomaly.z.toFixed(1)}σ{' '}
                                        {summary.topAnomaly.direction === 'above' ? 'cálida' : 'fría'}
                                    </span>
                                ) : (
                                    <span>Sin anomalías</span>
                                )
                            }
                            meta={
                                summary.anomalyCount > 0
                                    ? `${summary.warmCount} cálidas · ${summary.coldCount} frías`
                                    : 'Conjunto homogéneo'
                            }
                            sparklinePath="M0,17 L40,17 L45,4 L55,17 L85,6 L95,17 L100,17"
                        />
                    </div>
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
                    today={today}
                    filters={filters}
                    onFiltersChange={setFilters}
                />
            </div>
        </>

    );
};