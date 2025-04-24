import { Dispatch, SetStateAction, useState } from "react"
import { CourseInfo } from "../../../@types"
import { EnrollmentOption } from "./Enrollments"
import { Card, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"

type Props = {
    courseUnit: CourseInfo
    enrollmentChoices: Map<number, EnrollmentOption>
    setEnrollmentChoices: Dispatch<SetStateAction<Map<number, EnrollmentOption>>>
    enrollCourses: CourseInfo[]
    setEnrollCourses: Dispatch<SetStateAction<CourseInfo[]>>
}

export const EnrollingCourseUnitCard = ({
    courseUnit,
    enrollmentChoices,
    setEnrollmentChoices,
    setEnrollCourses,
    enrollCourses
}: Props) => {
    const [remove, setRemove] = useState<boolean>(true);

    return (<>
        {remove &&
            <Card>
                <CardHeader className="flex flex-row justify-between items-center py-2 px-4">
                    <CardTitle className="text-sm">
                        {courseUnit.acronym}
                    </CardTitle>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setRemove(false);

                            const newEnrollmentChoices = new Map(enrollmentChoices);
                            newEnrollmentChoices.delete(courseUnit.id)

                            setEnrollmentChoices(newEnrollmentChoices);
                            
                            const newEnrollCourses = enrollCourses.filter((course) => course.id !== courseUnit.id);
                            setEnrollCourses(newEnrollCourses);
                        }}
                    >
                        Remover
                    </Button>
                </CardHeader>
            </Card>
        }
    </>
    )
}