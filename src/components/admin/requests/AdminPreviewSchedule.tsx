import { useEffect, useState } from "react";
import { ClassDescriptor } from "../../../@types";
import ScheduleContext from "../../../contexts/ScheduleContext";
import ExchangeSchedule from "../../exchange/schedule/ExchangeSchedule"
import { Button } from "../../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog"

type Props = {
    originalSchedule: Array<ClassDescriptor>
    classesToAdd: Array<ClassDescriptor>
}

/**
 * This is the component that will show the schedule of a student if request is accepted.
*/
export const AdminPreviewSchedule = ({
    originalSchedule,
    classesToAdd
}: Props) => {
    const [schedule, setSchedule] = useState<Array<ClassDescriptor>>(originalSchedule);

    useEffect(() => {
        if(!originalSchedule) return;

        const prevSchedule = originalSchedule
            .filter((classDescriptor) => classDescriptor.classInfo && classDescriptor.courseInfo)
            .filter((classDescriptor) => !classesToAdd.some((newClass) => newClass.courseInfo.id === classDescriptor.courseInfo.id)
        );

        setSchedule([...prevSchedule, ...classesToAdd.filter((classDescriptor) => classDescriptor.classInfo && classDescriptor.courseInfo)]);
    }, [originalSchedule])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    Visualizar
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-fit max-h-fit p-4">
                <DialogHeader className="w-[50em]">
                    <DialogTitle>Prever horário</DialogTitle>
                </DialogHeader>
                <ScheduleContext.Provider value={{
                    originalExchangeSchedule: originalSchedule.filter((classDescriptor) => classDescriptor.classInfo && classDescriptor.courseInfo),
                    exchangeSchedule: schedule,
                    setExchangeSchedule: setSchedule,
                    enrolledCourseUnits: [],
                    loadingSchedule: false
                }}>
                    <div className="lg:min-h-adjusted order-1 col-span-12 min-h-min rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-9 2xl:px-5 2xl:py-5">
                        <ExchangeSchedule />
                    </div>
                </ScheduleContext.Provider>
            </DialogContent>
        </Dialog>
    )
}