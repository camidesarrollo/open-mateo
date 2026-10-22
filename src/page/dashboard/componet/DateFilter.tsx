import { useState } from "react";
import { Popover } from "../../../components/ui/Popover";
import { Icon } from "../../../components/ui/Icon";
import { cn, focusRing } from "../../../components/ui/utils";
import { addDays, formatDay, hoyISO } from "../../../helper/time";
import type { DateRange } from "../../../utils/filters";

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// Lunes = 0 … domingo = 6 (getUTCDay empieza en domingo)
const weekdayIndex = (iso: string) => (new Date(`${iso}T12:00:00Z`).getUTCDay() + 6) % 7;

const formatLong = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });

interface DateFilterProps {
    /** Fechas ISO cargadas, ordenadas. Solo estas se pueden elegir */
    dates: string[];
    value: DateRange | null;
    onChange: (next: DateRange | null) => void;
}

export function DateFilter({ dates, value, onChange }: DateFilterProps) {
    const [open, setOpen] = useState(false);
    // Primer clic del rango, a la espera del segundo
    const [pendingStart, setPendingStart] = useState<string | null>(null);

    const first = dates[0];
    const last = dates[dates.length - 1];

    const label = !value
        ? 'Todas las fechas'
        : value[0] === value[1]
            ? formatDay(value[0])
            : `${formatDay(value[0])} – ${formatDay(value[1])}`;

    const apply = (next: DateRange | null) => {
        onChange(next);
        setPendingStart(null);
        setOpen(false);
    };

    const handleDayClick = (date: string) => {
        if (!pendingStart) {
            setPendingStart(date);
            return;
        }
        // Se acepta elegir el final antes que el inicio
        apply(pendingStart <= date ? [pendingStart, date] : [date, pendingStart]);
    };

    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (!next) setPendingStart(null);
    };

    const presets: { label: string; range: DateRange | null }[] = [
        { label: 'Todas', range: null },
        { label: 'Pasadas', range: [first, addDays(hoyISO, -1)] },
        { label: 'Hoy', range: [hoyISO, hoyISO] },
        { label: 'Próximas', range: [addDays(hoyISO, 1), last] },
    ];

    return (
        <Popover
            open={open}
            onOpenChange={handleOpenChange}
            align="end"
            title="Filtrar por fecha"
            triggerClassName={cn(
                'gap-1.5 px-space-sm py-1.5 font-label-md text-label-md font-semibold whitespace-nowrap transition-colors shadow-sm',
                value
                    ? 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high',
            )}
            trigger={
                <>
                    <Icon name="calendar_month" size={16} />
                    {label}
                </>
            }
        >
            {dates.length === 0 ? (
                <p className="font-label-sm text-label-sm text-on-surface-variant">Cargando jornadas…</p>
            ) : (
                <div className="flex flex-col gap-space-sm">
                    <div className="flex flex-wrap gap-1">
                        {presets.map((p) => {
                            const active = value === null
                                ? p.range === null
                                : p.range !== null && p.range[0] === value[0] && p.range[1] === value[1];
                            return (
                                <button
                                    key={p.label}
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() => apply(p.range)}
                                    className={cn(
                                        'rounded-md px-2 py-1 font-label-sm text-label-sm transition-colors',
                                        active
                                            ? 'bg-primary text-on-primary'
                                            : 'bg-surface-container text-on-surface hover:bg-surface-container-highest',
                                        focusRing,
                                    )}
                                >
                                    {p.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center" role="group" aria-label="Jornadas disponibles">
                        {WEEKDAYS.map((d) => (
                            <span key={d} aria-hidden className="font-mono-badge text-[10px] text-outline">{d}</span>
                        ))}

                        {/* Huecos hasta el día de la semana de la primera jornada */}
                        {Array.from({ length: weekdayIndex(first) }, (_, i) => <span key={`blank-${i}`} />)}

                        {dates.map((date) => {
                            const isEdge = value !== null && (date === value[0] || date === value[1]);
                            const inRange = value !== null && date >= value[0] && date <= value[1];
                            const isPending = date === pendingStart;
                            const isToday = date === hoyISO;

                            return (
                                <button
                                    key={date}
                                    type="button"
                                    aria-pressed={inRange || isPending}
                                    aria-label={formatLong(date) + (isToday ? ', hoy' : '')}
                                    aria-current={isToday ? 'date' : undefined}
                                    onClick={() => handleDayClick(date)}
                                    className={cn(
                                        'relative h-8 rounded-md font-mono-data text-mono-data transition-colors',
                                        isEdge || isPending
                                            ? 'bg-primary text-on-primary'
                                            : inRange
                                                ? 'bg-primary/20 text-on-surface'
                                                : 'text-on-surface hover:bg-surface-container-highest',
                                        isPending && 'ring-2 ring-primary/40',
                                        isToday && 'font-bold underline underline-offset-4',
                                        focusRing,
                                    )}
                                >
                                    {Number(date.slice(8, 10))}
                                </button>
                            );
                        })}
                    </div>

                    <p className="font-label-sm text-[11px] text-on-surface-variant" aria-live="polite">
                        {pendingStart
                            ? `Inicio: ${formatDay(pendingStart)}. Elegí el día final.`
                            : 'Elegí el día inicial y luego el final. Repetí el mismo día para ver solo esa jornada.'}
                    </p>
                </div>
            )}
        </Popover>
    );
}
