import type { ForecastItem } from '@/types/openWeather';
import { getCityDayKey, isCityToday } from '@/utils/time';

function getWeekdayLabel(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const label = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  }).format(date);

  return label.toLowerCase();
}

export type GroupedForecast = Record<string, ForecastItem[]>;

export function groupForecastByDayLabel(
  items: ForecastItem[],
  timezoneOffsetSeconds: number
): GroupedForecast {
  const result: GroupedForecast = {};
  const nowUnix = Math.floor(Date.now() / 1000);

  for (const item of items) {
    let key: string;

    if (isCityToday(item.dt, timezoneOffsetSeconds)) {
      if (item.dt < nowUnix) {
        continue;
      }

      key = 'today';
    } else {
      const dayKey = getCityDayKey(item.dt, timezoneOffsetSeconds);
      key = getWeekdayLabel(dayKey);
    }

    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }

  return result;
}
