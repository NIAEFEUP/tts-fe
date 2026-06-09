import { RotateCwIcon } from 'lucide-react'
import { Button } from '../../ui/new/button'

type Props = {
  forceRefreshStudentSchedule: () => void
  loadingSchedule: boolean
  isRefreshingStudentSchedule: boolean
}

export default function RefreshScheduleButton({
  forceRefreshStudentSchedule,
  loadingSchedule,
  isRefreshingStudentSchedule,
}: Props) {
  return (
    <Button
      square
      className="bg-lightish hover:bg-lightish/90 text-black dark:bg-darkish dark:text-white"
      onClick={() => {
        forceRefreshStudentSchedule()
      }}
    >
      <RotateCwIcon size="18" className={!loadingSchedule && isRefreshingStudentSchedule ? 'animate-spin' : ''} />
    </Button>
  )
}
