import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { CourseInfo } from "../../../../@types";
import { Button } from "../../../ui/button";
import { Checkbox } from "../../../ui/checkbox";
import { IncludeCourseUnitCard } from "./cards/IncludeCourseUnitCard";

type Props = {
  setSelectedCourseUnits: React.Dispatch<React.SetStateAction<CourseInfo[]>>
  enrolledCourseUnits: CourseInfo[]
  selectedCourseUnits: CourseInfo[]
  setSelectingCourseUnits: React.Dispatch<React.SetStateAction<boolean>>
}

export const ChooseIncludedCourseUnits = ({
  selectedCourseUnits,
  setSelectedCourseUnits,
  enrolledCourseUnits,
  setSelectingCourseUnits
}: Props) => {
  return <div className="flex flex-col gap-y-2">
    <div className="flex flex-row gap-2">
      <Checkbox
        id="selecting-course-units"
        onCheckedChange={(checked) => {
          if (!checked) {
            setSelectedCourseUnits([]);
          } else {
            setSelectedCourseUnits(Array.from(enrolledCourseUnits));
          }
        }}
        checked={selectedCourseUnits.length === enrolledCourseUnits.length}
      />
      <label htmlFor="selecting-course-units">
        Selecionar todas as disciplinas
      </label>
    </div>
    {Array.from(enrolledCourseUnits).map((courseInfo: CourseInfo) => (
      <IncludeCourseUnitCard
        key={"include-course-unit-" + courseInfo.id}
        courseInfo={courseInfo}
        selectedCourseUnitsHook={[selectedCourseUnits, setSelectedCourseUnits]}
      />
    ))}

    <Button
      className="w-full bg-gray-200 text-gray-800 hover:bg-gray-150 flex flex-row gap-x-2"
      onClick={() => { setSelectingCourseUnits(false) }}
    >
      Confirmar disciplinas
      <CheckBadgeIcon className="h-5 w-5" />
    </Button>

  </div >
}
