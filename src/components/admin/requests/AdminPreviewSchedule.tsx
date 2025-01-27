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
        const prevSchedule = originalSchedule.filter(
            (classDescriptor) => !classesToAdd.some((newClass) => newClass.courseInfo.id === classDescriptor.courseInfo.id)
        );

        setSchedule([...prevSchedule, ...classesToAdd]);
    }, [originalSchedule])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    Visualizar
                </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col h-fit w-screen max-h-screen lg:min-w-fit overflow-scroll">
                <DialogHeader>
                    <DialogTitle>Prever horário</DialogTitle>
                </DialogHeader>
                <ScheduleContext.Provider value={{
                    originalExchangeSchedule: originalSchedule,
                    exchangeSchedule: schedule,
                    setExchangeSchedule: setSchedule,
                    enrolledCourseUnits: [],
                    loadingSchedule: false
                }}>
                    <div className="order-1 col-span-12 rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-9 2xl:px-5 2xl:py-5">
                        <div className="h-full w-full">
                            <ExchangeSchedule />
                        </div>
                    </div>
                </ScheduleContext.Provider>
            </DialogContent>
        </Dialog>
    )
}