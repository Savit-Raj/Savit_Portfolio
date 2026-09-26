import { useEffect, useState } from 'react'

const formatTime = (timeZone: string) =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }).format(new Date())

/** Wall-clock time in a given IANA zone, ticking on the minute boundary. */
export function useLocalTime(timeZone: string) {
  const [time, setTime] = useState(() => formatTime(timeZone))

  useEffect(() => {
    let interval: number | undefined
    const tick = () => setTime(formatTime(timeZone))
    const timeout = window.setTimeout(() => {
      tick()
      interval = window.setInterval(tick, 60_000)
    }, 60_000 - (Date.now() % 60_000))
    return () => {
      window.clearTimeout(timeout)
      window.clearInterval(interval)
    }
  }, [timeZone])

  return time
}
