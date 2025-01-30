import { Dispatch, SetStateAction, useContext, useState } from "react"
import { CourseInfo } from "../../../@types"
import { Button } from "../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { EnrollmentOption } from "./Enrollments"
import ScheduleContext from "../../../contexts/ScheduleContext"

enum CourseUnitEnrollmentType {
  DISENROLLING = 1,
  ENROLLING = 2
}

type Props = {
    courseUnit: CourseInfo,
    enrollmentChoices: Map<number, EnrollmentOption>
    setEnrollmentChoices: Dispatch<SetStateAction<Map<number, EnrollmentOption>>>
}

export const AlreadyEnrolledCourseUnitCard = ({
    courseUnit,
    enrollmentChoices,
    setEnrollmentChoices
}: Props) => {
    const [removeSelected, setRemoveSelected] = useState<boolean>(false);
    const { exchangeSchedule } = useContext(ScheduleContext);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center py-2 px-4">
                <CardTitle className="text-sm">
                    {courseUnit.acronym}
                </CardTitle>
                <Button
                    onClick={() => {
                        setRemoveSelected(prev => !prev);
                        const newEnrollmentChoices = new Map(enrollmentChoices);

                        removeSelected
                            ? newEnrollmentChoices.delete(courseUnit.id)
                            : newEnrollmentChoices.set(courseUnit.id, { 
                                type: CourseUnitEnrollmentType.DISENROLLING,
                                classId: exchangeSchedule?.find((item) => item.courseInfo.course_unit_id === courseUnit.id)?.classInfo.id
                            });

                        setEnrollmentChoices(newEnrollmentChoices);
                    }}
                >
                    {removeSelected 
                        ? "Cancelar desinscrição"
                        : "Desinscrever"
                    }
                </Button>
            </CardHeader>
        </Card>
    )
}