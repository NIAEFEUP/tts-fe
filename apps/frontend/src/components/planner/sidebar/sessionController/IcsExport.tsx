import { CalendarDays } from 'lucide-react'
import usePickedClasses from '../../../../hooks/usePickedClasses'
import { AnalyticsTracker, Feature } from '../../../../utils/AnalyticsTracker'

const IcsExport = () => {
  const classes = usePickedClasses()
  const downloadIcs = () => {
    // YYYYMMDDTHHMMSS
    const pad = (n: number) => (n < 10 ? '0' + n : String(n))
    const formatDate = (date: Date) =>
      `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`

    // DTSTAMP/UID are required by RFC 5545 — without them most calendar
    // apps (Outlook, Windows Calendar) silently refuse to import the file.
    const dtStamp = `${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`

    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TTS//TTS Schedule//EN\n'

    const now = new Date()
    const currentDay = now.getDay()

    classes.forEach((cls) => {
      const { courseInfo, classInfo } = cls
      classInfo.slots.forEach((slot) => {
        const jsTargetDay = (slot.day + 1) % 7

        const daysUntil = (jsTargetDay - currentDay + 7) % 7
        const nextDate = new Date(now)
        nextDate.setDate(now.getDate() + daysUntil)

        const startHour = Math.floor(slot.start_time)
        const startMinute = Math.floor((slot.start_time - startHour) * 60)

        const endTime = slot.start_time + slot.duration
        const endHour = Math.floor(endTime)
        const endMinute = Math.round((endTime - endHour) * 60)

        const startDate = new Date(nextDate)
        startDate.setHours(startHour, startMinute, 0, 0)
        const endDate = new Date(nextDate)
        endDate.setHours(endHour, endMinute, 0, 0)

        const uid = `${courseInfo.acronym}-${slot.lesson_type}-${slot.day}-${slot.start_time}@tts.niaefeup.pt`

        icsContent += 'BEGIN:VEVENT\n'
        icsContent += `UID:${uid}\n`
        icsContent += `DTSTAMP:${dtStamp}\n`
        icsContent += `SUMMARY:${courseInfo.acronym} - ${slot.lesson_type}\n`
        icsContent += `LOCATION:${slot.location}\n`
        icsContent += `DTSTART:${formatDate(startDate)}\n`
        icsContent += `DTEND:${formatDate(endDate)}\n`
        icsContent += 'RRULE:FREQ=WEEKLY\n'
        icsContent += 'END:VEVENT\n'
      })
    })
    icsContent += 'END:VCALENDAR'

    // RFC 5545 requires CRLF line endings; some parsers reject bare LF.
    const blob = new Blob([icsContent.replace(/\n/g, '\r\n')], { type: 'text/calendar;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'horario_tts.ics')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    AnalyticsTracker.trackFeature(Feature.EXPORT_TO_ICS)
  }

  return (
    <button
      onClick={downloadIcs}
      className="group flex w-full items-center gap-2 dark:text-white rounded-md p-1 text-gray text-sm disabled:cursor-not-allowed disabled:opacity-50"
    >
      <CalendarDays className="h-5 w-5 text-secondary black:hover:brightness-200" />
      <span className="pl-1">Exportar Horário (ICS)</span>
    </button>
  )
}

export default IcsExport
