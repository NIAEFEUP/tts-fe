import { Check, ChevronDownIcon, ChevronUpIcon, X } from "lucide-react"
import { ClassDescriptor, CourseUnitEnrollment } from "../../../../@types"
import { Button } from "../../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Person } from "./Person"
import { useState } from "react"
import { AdminPreviewSchedule } from "../AdminPreviewSchedule"
import { AdminRequestCardFooter } from "./AdminRequestCardFooter"
import useStudentsSchedule from "../../../../hooks/admin/useStudentsSchedule"
import { RequestDate } from "./RequestDate"
import { AdminRequestType } from "../../../../utils/exchange"
import { ExchangeStatus } from "./ExchangeStatus"

type Props = {
    enrollment: CourseUnitEnrollment
}

/**
 * Card to show enrollments in the admin page
 */
export const StudentEnrollmentCard = ({
    enrollment
}: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [enrollmentState, setEnrollmentState] = useState(enrollment);

    const { schedule } = useStudentsSchedule(enrollment.user_nmec);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div className="flex gap-4 items-center">
                    <div className="flex flex-col gap-1 ">
                        <div className="flex gap-2 items-center">
                            <CardTitle>
                                <h2 className="font-bold">
                                    {`#${enrollment.id}`}
                                </h2>
                            </CardTitle>
                            <ExchangeStatus
                                exchange={enrollmentState}
                            />
                        </div>

                        <RequestDate
                            date={enrollment.date}
                        />
                    </div>
                    {!open && <>
                        <Person
                            key={"enrollment-person-" + enrollment.user_nmec}
                            name={enrollment.user_nmec}
                            nmec={enrollment.user_nmec}
                        />
                    </>}
                </div>
                <div>
                    <Button
                        onClick={() => setOpen(prev => !prev)}
                        className="bg-white text-black border-2 border-black hover:text-white"
                    >
                        {open
                            ? <ChevronUpIcon className="w-5 h-5" />
                            : <ChevronDownIcon className="w-5 h-5" />
                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="w-full ">
                {open && (
                    <div className="flex flex-col gap-y-8" key={crypto.randomUUID()}>
                        <div className="flex flex-row justify-between">
                            <Person name={enrollment.user_nmec} nmec={enrollment.user_nmec} />
                            <div className="flex flex-row gap-x-2">
                                {enrollment.options.map((option) => (
                                    <div
                                        key={crypto.randomUUID()}
                                    >
                                        <div
                                            className="flex flex-row gap-x-2 items-center border-gray-200 border-2 rounded-md p-2 px-4"
                                        >
                                            <h2 className="font-bold">{option.course_unit.acronym}</h2>
                                            {option.enrolling
                                                ? <Check className="text-green-400" />
                                                : <X className="text-red-400" />
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <AdminPreviewSchedule
                                    originalSchedule={schedule}
                                    classesToAdd={
                                        enrollment.options.map((option): ClassDescriptor => {
                                            return {
                                                classInfo: option.class_user_goes_to,
                                                courseInfo: option.course_unit,
                                                slotInfo: null
                                            }
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}

                {open &&
                    <AdminRequestCardFooter
                        nmecs={[enrollment.user_nmec]}
                        rejectMessage={""}
                        acceptMessage="mensagem"
                        requestType={AdminRequestType.ENROLLMENT}
                        requestId={enrollment.id}
                        courseUnitId={enrollment.options.map(option => option.course_unit.id)}
                        setExchange={setEnrollmentState}
                        courseId={enrollment.options[0].course_unit.id}
                    />
                }
            </CardContent>
        </Card>
    )
}