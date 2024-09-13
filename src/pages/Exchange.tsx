import { useEffect, useState } from "react";
import { ClassDescriptor } from "../@types";
import { LoginButton } from "../components/auth/LoginButton";
import { ExchangeSidebar } from "../components/exchange/ExchangeSidebar";
import ExchangeSchedule from "../components/exchange/schedule/ExchangeSchedule";
import { Schedule } from "../components/planner";
import ScheduleContext from "../contexts/ScheduleContext";
import { useSession } from "../hooks";
import useSchedule from "../hooks/useSchedule";
import useStudentCourseUnits from "../hooks/useStudentCourseUnits";

const ExchangePage = () => {
  const { schedule } = useSchedule();
  const [exchangeSchedule, setExchangeSchedule] = useState<Array<ClassDescriptor>>();
  const { signedIn, isLoading } = useSession();
  const enrolledCourseUnits = useStudentCourseUnits(schedule);

  useEffect(() => {
    setExchangeSchedule(schedule ? schedule : []);
  }, [schedule]);

  return <>
    {!isLoading && signedIn ?
      <ScheduleContext.Provider value={{ exchangeSchedule, setExchangeSchedule, enrolledCourseUnits }}>
        <div className="grid w-full grid-cols-12 gap-x-4 gap-y-4 px-4 py-4">
          {/* Schedule Preview */}
          <div className="lg:min-h-adjusted order-1 col-span-12 min-h-min rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-9 2xl:px-5 2xl:py-5">
            <div className="h-full w-full">
              <ExchangeSchedule />
            </div>
          </div>

          <ExchangeSidebar />
        </div>
      </ScheduleContext.Provider>
      : <article className="flex flex-col mx-auto w-full gap-4">
        <h1 className="text-center text-3xl font-bold">
          Trocas de Turmas
        </h1>
        <p className="text-center">
          Tens de iniciar sessão para acederes a esta funcionalidade.
        </p>
        <div className="justify-center mx-auto">
          <LoginButton />
        </div>
      </article>}
  </>
}

export default ExchangePage;
