import { ClassDescriptor } from "../../../@types";

type Props = {classes: ClassDescriptor[]}

const DownloadSchedule = ({classes} : Props) => {
    const downloadIcs = () => {
        let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TTS//TTS Schedule//EN\n'

        const now = new Date()
        const currentDay = now.getDay()

        classes.forEach((cls) => {
            const {courseInfo, classInfo} = cls
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

                // YYYYMMDDTHHMMSS
                const formatDate = (date: Date) => {
                    const pad = (n: number) => n < 10 ? '0' + n : n
                    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
                }
                
                icsContent += 'BEGIN:VEVENT\n'
                icsContent += `SUMMARY:${courseInfo.acronym} - ${slot.lesson_type}\n`  
                icsContent += `LOCATION:${slot.location}/n`
                icsContent += `DTSTART:${formatDate(startDate)}\n`
                icsContent += `DTEND:${formatDate(endDate)}\n`
                icsContent += 'RRULE:FREQ=WEEKLY\n'
                icsContent += 'END:VEVENT\n'

            })
        })
        icsContent += 'END:VCALENDAR'
    }
}