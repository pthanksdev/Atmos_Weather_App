export function formatTimeFromUnixWithOffset(
  timestamp: number,
  timezoneOffsetSeconds: number
) {
  const ms = (timestamp + timezoneOffsetSeconds) * 1000;
  return new Date(ms).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });
}

export function getCityDayKey(
  timestamp: number,
  timezoneOffsetSeconds: number
) {
  const ms = (timestamp + timezoneOffsetSeconds) * 1000;
  const d = new Date(ms);

  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function isCityToday(timestamp: number, timezoneOffsetSeconds: number) {
  const todayKey = getCityDayKey(
    Math.floor(Date.now() / 1000),
    timezoneOffsetSeconds
  );
  const itemKey = getCityDayKey(timestamp, timezoneOffsetSeconds);

  return todayKey === itemKey;
}
