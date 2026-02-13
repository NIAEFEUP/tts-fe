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
import { listEmailEnrollments } from "../../../../utils/mail"

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
            <CardHeader className="flex flex-row justify-between items-center py-4 px-9">
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

                        {!open && <RequestDate
                            date={enrollment.date}
                        />}
                    </div>
                    {!open && <>
                        <Person
                            key={"enrollment-person-" + enrollment.user_name}
                            name={enrollment.user_name}
                            nmec={enrollment.user_nmec}
                        />
                    </>}
                </div>
                <div>
                    <Button
                        onClick={() => setOpen(prev => !prev)}
                        variant="outline"
                        className="ml-6 h-9 w-9 p-0 border-2 border-slate-200 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-all duration-200 shadow-sm"
                    >
                        {open ? (
                            <ChevronUpIcon size={18} strokeWidth={2.5} />
                        ) : (
                            <ChevronDownIcon size={18} strokeWidth={2.5} />
                        )
                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent className={`w-full ${open ? "pt-0 pb-4 px-9" : "p-0"}`}>
                {open && (
                    <div className="flex flex-col gap-y-8" key={crypto.randomUUID()}>
                        <div className="flex flex-row justify-between">
                            <Person name={enrollment.user_name} nmec={enrollment.user_nmec} />
                            <div className="flex flex-row gap-x-2">
                                {[...enrollment.options]
                                    .sort((a, b) => {
                                        const acronymComparison = a.course_unit.acronym.localeCompare(b.course_unit.acronym);
                                        if (acronymComparison !== 0) {
                                            return acronymComparison;
                                        }
                                        return a.course_unit.id - b.course_unit.id;
                                    })
                                    .map((option) => (
                                        <div key={option.id}>
                                            <div className="flex flex-row gap-x-2 items-center border-gray-200 border-2 rounded-md p-2 px-4">
                                                <h2 className="font-bold">
                                                    {option.course_unit.acronym}
                                                </h2>
                                                {option.enrolling ? (
                                                    <Check className="text-green-400" />
                                                ) : (
                                                    <X className="text-red-400" />
                                                )}
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
                </CardContent>

                {open &&
                    <AdminRequestCardFooter
                        nmecs={[enrollment.user_nmec]}
                        exchangeMessage={
                            listEmailEnrollments(
                                enrollment.options.map(option => ({
                                    participant_name: enrollment.user_nmec,
                                    participant_nmec: enrollment.user_nmec,
                                    goes_to: option.course_unit.name,
                                    course: option.course,
                                    course_unit: option.course_unit
                                }))
                            )
                        }
                        requestType={AdminRequestType.ENROLLMENT}
                        requestId={enrollment.id}
                        setExchange={setEnrollmentState}
                        courseId={enrollment.options.map(option => option.course_unit.course)}
                        courseInfo={enrollment.options.map(option => ({
                            id: option.course_unit.course,
                            acronym: option.course.acronym
                        }))}
                    />
                }
            
        </Card>
    )
}