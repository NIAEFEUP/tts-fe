import { cn } from "../../../utils";
import { RotateCwIcon } from "lucide-react";
import { Button } from "../../ui/button";

type Props = {
  forceRefreshStudentSchedule: () => void
  loadingSchedule: boolean
  isRefreshingStudentSchedule: boolean
}

export default function RefreshScheduleButton({
  forceRefreshStudentSchedule,
  loadingSchedule,
  isRefreshingStudentSchedule
}: Props) {
  return (
    <Button
      variant="icon"
      className="bg-lightish text-black dark:bg-darkish dark:text-white"
      onClick={() => {
        forceRefreshStudentSchedule();
      }}
    >
      <RotateCwIcon className={cn("h-4 w-4", (!loadingSchedule && isRefreshingStudentSchedule) ? "animate-spin" : "")} />
    </Button>
  )
}
