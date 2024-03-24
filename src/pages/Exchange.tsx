import { Schedule } from "../components/planner";
import { ExchangeSidebar } from "../components/exchange/ExchangeSidebar";
import { getStudentSchedule } from "../api/backend";
import { useContext, useState } from "react";
import { SessionContext } from "../contexts/SessionContext";
import NotAuthorizedPage from "./NotAuthorized";
import { CourseOption } from "../@types";

const ExchangePage = () => {

    const { loggedIn, setLoggedIn } = useContext(SessionContext);
    const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);

    return (
        <>
            {loggedIn ?
                <div className="grid w-full grid-cols-12 gap-x-4 gap-y-4 px-4 py-4">
                    <div className="schedule">
                        <div className="h-full w-full">
                            <Schedule courseOptions={courseOptions} />
                        </div>
                    </div>

                    <ExchangeSidebar courseOptions={courseOptions} setCourseOptions={setCourseOptions} />
                </div>
                :
                <NotAuthorizedPage />}
        </>
    );
}

export default ExchangePage;
