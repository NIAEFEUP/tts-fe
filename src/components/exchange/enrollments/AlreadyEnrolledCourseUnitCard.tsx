import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { CourseInfo } from "../../../@types"
import { Button } from "../../ui/button"
import { Card, CardHeader, CardTitle } from "../../ui/card"
import { EnrollmentOption } from "./Enrollments"

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

    useEffect(() => {
        if(enrollmentChoices.size === 0) {
            setRemoveSelected(false);
        }
    }, [enrollmentChoices])

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center py-2 px-4">
                <CardTitle className="text-sm">
                    {courseUnit.acronym}
                </CardTitle>
                <Button
                    variant="secondary"
                    onClick={() => {
                        setRemoveSelected(prev => !prev);
                        const newEnrollmentChoices = new Map(enrollmentChoices);

                        if(removeSelected) {
                            newEnrollmentChoices.delete(courseUnit.id)
                        } else {
                            newEnrollmentChoices.set(courseUnit.id, { 
                                type: CourseUnitEnrollmentType.DISENROLLING,
                            });
                        }

                        setEnrollmentChoices(newEnrollmentChoices);
                    }}
                >
                    {removeSelected 
                        ? "Cancelar pedido"
                        : "Anular inscrição em turma"
                    }
                </Button>
            </CardHeader>
        </Card>
    )
}