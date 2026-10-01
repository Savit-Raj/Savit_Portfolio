import { useEffect, useState } from 'react'

const formatTime = (timeZone: string) =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }).format(new Date())

/**
 * Wall-clock time in a given IANA zone, ticking on the minute boundary.
 * Starts as "--:--" and fills in after mount: the page is pre-rendered at build time, and a
 * build-time clock would disagree with the visitor's, breaking hydration.
 */
export function useLocalTime(timeZone: string) {
  const [time, setTime] = useState('--:--')

  useEffect(() => {
    let interval: number | undefined
    const tick = () => setTime(formatTime(timeZone))
    tick()
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
