export interface Temperatures {
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
    time:                          string[];
    weather_code:                  number[];
    temperature_2m_max:            number[];
    temperature_2m_min:            number[];
    precipitation_probability_max: number[];
    precipitation_sum:             number[];
    wind_speed_10m_max:            number[];
    uv_index_max:                  number[];
}

export interface DailyUnits {
    time:                          string;
    weather_code:                  string;
    temperature_2m_max:            string;
    temperature_2m_min:            string;
    precipitation_probability_max: string;
    precipitation_sum:             string;
    wind_speed_10m_max:            string;
    uv_index_max:                  string;
}
