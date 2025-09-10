import { ArrowRightIcon } from "lucide-react";
import { ClassDescriptor, DirectExchangeParticipant } from "../../../../@types";
import { Person } from "./Person";
import { AdminPreviewSchedule } from "../AdminPreviewSchedule";
import { AdminSendEmail } from "../AdminSendEmail";
import useStudentsSchedule from "../../../../hooks/admin/useStudentsSchedule";
import { TreatExchangeButton } from "./TreatExchangeButton";
import { listEmailExchanges } from "../../../../utils/mail";
import useAdminClasses from "../../../../hooks/admin/useAdminClasses";

type Props = {
    participant_nmec: string
    participant_name: string
    exchanges: Array<DirectExchangeParticipant>
    showTreatButton?: boolean
}

export const PersonExchanges = ({
    exchanges,
    participant_name,
    participant_nmec,
    showTreatButton = false
}: Props) => {
    const { schedule } = useStudentsSchedule(participant_nmec);
    const { classes } = useAdminClasses();

    const getVacanciesFromCourseUnitAcronymAndClassName = (courseUnitAcronym: string, className: string) => {
        if (!classes) return null;
        const foundClass = classes.find((cls: any) => 
            cls.course_unit_acronym === courseUnitAcronym && cls.name === className
        );
        return foundClass ? foundClass.vacancies : null;
    };

    return (
        <>
            <div className="flex justify-between">
                <Person name={participant_name} nmec={participant_nmec} />
                <div className="flex flex-row flex-wrap gap-x-2">
                    {exchanges.map((exchange) => (
                        <div
                            key={crypto.randomUUID()}
                            className="flex flex-col gap-y-2 items-center border-gray-200 border-2 rounded-md p-2 px-4"
                        >
                            <div className="flex gap-5 items-center">
                                <h2 className="font-bold">{exchange.course_info.acronym}</h2>
                                <div className="flex gap-2 items-center">
                                    <p>{exchange.class_participant_goes_from.name}</p>
                                    <p>{getVacanciesFromCourseUnitAcronymAndClassName(exchange.course_info.acronym, exchange.class_participant_goes_from.name) ?? 'N/A'} vagas</p>
                                    <ArrowRightIcon className="w-5 h-5" />
                                    <p>{exchange.class_participant_goes_to.name}</p>
                                     <p>{getVacanciesFromCourseUnitAcronymAndClassName(exchange.course_info.acronym, exchange.class_participant_goes_to.name) ?? 'N/A'} vagas</p>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-row gap-x-2">
                    <AdminPreviewSchedule 
                        originalSchedule={schedule}
                        classesToAdd={
                            exchanges.map((exchange): ClassDescriptor => {
                                return {
                                    classInfo: exchange.class_participant_goes_to,
                                    courseInfo: exchange.course_info,
                                    slotInfo: null
                                }
                            })
                        }
                    />
                    {showTreatButton && 
                        <TreatExchangeButton
                            nmec={participant_nmec}
                            variant="secondary"
                            courseId={exchanges.map(exchange => exchange.course_info.course)}
                        />
                    }
                    <AdminSendEmail
                        nmec={participant_nmec}
                        subject="Pedido de troca de turmas"
                        message={listEmailExchanges(
                            exchanges.map(option => ({
                                participant_nmec: option.participant_nmec,
                                participant_name: option.participant_name,
                                goes_from: option.class_participant_goes_from.name,
                                goes_to: option.class_participant_goes_to.name,
                                course_acronym: option.course_unit
                            }))
                        )}
                    />
                </div>
            </div>
        </>
    )
};
