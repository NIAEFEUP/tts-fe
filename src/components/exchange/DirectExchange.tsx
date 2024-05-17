import { DirectExchangeSelection } from "./DirectExchangeSelection";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import { SubmitDirectExchangeButton } from "./SubmitDirectExchangeButton";
import { ClassExchange, CourseOption } from "../../@types";
import { MoonLoader } from "react-spinners";
import { ToggleMarketplaceSubmissionMode } from "./marketplace/ToggleMarketplaceSubmissionMode";
import { DirectExchangeContext } from "../../contexts/DirectExchangeContext";
import { DirectExchangeInfoButton } from "./buttons/DirectExchangeInfoButton";
import { DirectExchangeHistoryButton } from "./DirectExchangeHistory";
import { StudentScheduleContext } from "../../contexts/StudentScheduleContext";

type Props = {
    setCourseOptions: Dispatch<SetStateAction<CourseOption[]>>
    courseOptions: CourseOption[]

}

export function DirectExchange({
    courseOptions,
    setCourseOptions
}: Props) {
    const [currentDirectExchange, setCurrentDirectExchange] = useState<Map<string, ClassExchange>>(new Map<string, ClassExchange>());
    const [error, setError] = useState(null);
    const { loggedIn, setLoggedIn } = useContext(SessionContext);
    const { schedule, isLoadingSchedule, isValidatingSchedule } = useContext(StudentScheduleContext);
    const [marketplaceToggled, setMarketplaceToggled] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);


    if (error) {
        return <p>Error fetching schedule: {error.message}</p>;
    }

    return <DirectExchangeContext.Provider value={
        {
            marketplaceToggled: marketplaceToggled,
            setMarketplaceToggled: setMarketplaceToggled,
            currentDirectExchange: currentDirectExchange,
            setCurrentDirectExchange: setCurrentDirectExchange
        }}>
        <div className="flex justify-center flex-col space-y-4 mt-4">
            <DirectExchangeInfoButton />
            <DirectExchangeHistoryButton />
            <SubmitDirectExchangeButton currentDirectExchange={currentDirectExchange} />
            <ToggleMarketplaceSubmissionMode />
            {!isLoadingSchedule ?
                <div>
                    {
                        schedule.map((uc) => {
                            if (uc.type !== "T") {
                                return (
                                    <DirectExchangeSelection
                                        courseOptions={courseOptions}
                                        setCourseOptions={setCourseOptions}
                                        uc={uc}
                                        key={uc.name}
                                        setSelectedStudents={setSelectedStudents}
                                        selectedStudents={selectedStudents}
                                    />
                                )
                            }
                        })
                    }
                </div> : <div className="mt-4">
                    <MoonLoader className="mx-auto my-auto" loading={isLoadingSchedule} />
                    <p className="text-center">A carregar os horários</p>
                </div>}
        </div>
    </DirectExchangeContext.Provider>
}
