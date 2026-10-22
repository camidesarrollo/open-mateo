import { ButtonGroup, type ButtonGroupOption } from "../../../components/ui/ButtonGroup";

export type WeatherFilter = 'all' | 'sunny' | 'cloudy' | 'rainy' | 'windy';

const WEATHER_OPTIONS: ButtonGroupOption<WeatherFilter>[] = [
  { value: 'all',    label: 'Todos' },
  { value: 'sunny',  label: 'Soleado' },
  { value: 'cloudy', label: 'Nublado' },
  { value: 'rainy',  label: 'Lluvioso' },
  { value: 'windy',  label: 'Ventoso' },
];

interface WeatherFilterGroupProps {
  value: WeatherFilter;
  onChange: (next: WeatherFilter) => void;
  fullWidth?: boolean;
}

export function WeatherFilterGroup({
  value,
  onChange,
  fullWidth = false,
}: WeatherFilterGroupProps) {
  return (
    <ButtonGroup
      options={WEATHER_OPTIONS}
      value={value}
      onChange={onChange}
      aria-label="Filtrar por tipo de clima"
      fullWidth={fullWidth}
    />
  );
}