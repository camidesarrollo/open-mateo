export const formatDay = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
  }).replace('.', ''); // quita el punto de "oct."


// 1) "Hoy" como string ISO (YYYY-MM-DD)
//    Usamos Intl para respetar la TZ de la ciudad, no la del usuario
export const hoyISO = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago', // vendrá de la ciudad seleccionada
  }).format(new Date()); // "2026-10-22"

// 2) Helper para sumar/restar días sin bugs de DST
export const addDays = (iso: string, n: number) => {
    const d = new Date(`${iso}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
};

export function getOffsetLabel(dateISO: string, todayISO: string): string {
  const a = new Date(`${dateISO}T12:00:00Z`).getTime();
  const b = new Date(`${todayISO}T12:00:00Z`).getTime();
  const diff = Math.round((a - b) / 86_400_000); // ms por día

  if (diff === 0) return 'HOY';
  return diff > 0 ? `+${diff}d` : `${diff}d`;   // -7d, +3d, etc.
}