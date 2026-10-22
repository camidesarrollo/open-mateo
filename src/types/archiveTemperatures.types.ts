export interface ArchiveTemperatures {
    latitude:              number;
    longitude:             number;
    generationtime_ms:     number;
    utc_offset_seconds:    number;
    timezone:              string;
    timezone_abbreviation: string;
    elevation:             number;
    daily_units:           DailyUnits;
    daily:                 Daily;
}

export interface Daily {
    time:               string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum:  number[];
    wind_speed_10m_max: number[];
    weather_code:       number[];
}

export interface DailyUnits {
    time:               string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_sum:  string;
    wind_speed_10m_max: string;
    weather_code:       string;
}
