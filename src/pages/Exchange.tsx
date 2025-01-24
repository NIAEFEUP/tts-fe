import { useContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import { ClassDescriptor } from "../@types";
import { LoginButton } from "../components/auth/LoginButton";
import ExchangeSchedule from "../components/exchange/schedule/ExchangeSchedule";
import ScheduleContext from "../contexts/ScheduleContext";
import SessionContext from "../contexts/SessionContext";
import useSchedule from "../hooks/useSchedule";
import useStudentCourseUnits from "../hooks/useStudentCourseUnits";
import '../styles/exchange.css';
import { CreateRequest } from "../components/exchange/requests/issue/CreateRequest";
import { ViewRequests } from "../components/exchange/requests/view/ViewRequests";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { Schedule } from "../components/planner";
import { Enrollments } from "../components/exchange/enrollments/Enrollments";

export enum ExchangeSidebarStatus {
  SHOWING_REQUESTS,
  CREATING_REQUEST,
  ENROLLING
}

const ExchangeSidebarStatusView = (
  {sidebarStatus, setSidebarStatus}: {sidebarStatus: ExchangeSidebarStatus, setExchangeSidebarStatus: Dispatch<SetStateAction<ExchangeSidebarStatus>>}
) => {
  switch(sidebarStatus) {
    case ExchangeSidebarStatus.SHOWING_REQUESTS:
      return <ViewRequests setExchangeSidebarStatus={setSidebarStatus} />
    case ExchangeSidebarStatus.CREATING_REQUEST:
      return <CreateRequest setExchangeSidebarStatus={setSidebarStatus} />
    case ExchangeSidebarStatus.ENROLLING:
      return <Enrollments setExchangeSidebarStatus={setSidebarStatus} />
  }
}

const ExchangePage = () => {
  const [loads, setLoads] = useState<number>(-1);
  const [creatingRequest,] = useState<boolean>(false);
  const [sidebarStatus, setSidebarStatus] = useState<ExchangeSidebarStatus>(ExchangeSidebarStatus.SHOWING_REQUESTS);
  const { schedule, loading: loadingSchedule } = useSchedule();
  const [originalExchangeSchedule, setOriginalExchangeSchedule] = useState<Array<ClassDescriptor>>([]);
  const [exchangeSchedule, setExchangeSchedule] = useState<Array<ClassDescriptor>>([]);
  const { signedIn } = useContext(SessionContext);
  const { enrolledCourseUnits } = useStudentCourseUnits();

  useEffect(() => {
    if(creatingRequest) setSidebarStatus(ExchangeSidebarStatus.CREATING_REQUEST)
    else setSidebarStatus(ExchangeSidebarStatus.SHOWING_REQUESTS)
  }, [creatingRequest])

  useEffect(() => {
    setLoads(prev => prev + 1);
  }, [setLoads]);

  useEffect(() => {
    setExchangeSchedule(schedule ? schedule : []);

    if (loads <= 0) {
      setOriginalExchangeSchedule(schedule ? schedule : []);
    }
  }, [schedule]);


  if (!signedIn) return <ScheduleContext.Provider value={{ originalExchangeSchedule, exchangeSchedule, loadingSchedule, setExchangeSchedule, enrolledCourseUnits }}>
    <div className="grid w-cfull grid-cols-12 gap-x-4 gap-y-4 px-4 py-4">
      <div className="lg:min-h-adjusted order-1 col-span-12 min-h-min rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-9 2xl:px-5 2xl:py-5">
        <div className="h-full w-full">
          <Schedule
            classes={[]}
            slots={[]}
          />
        </div>
      </div>

      <div className="lg:min-h-adjusted order-2 col-span-12 flex min-h-min flex-col justify-between rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-3 2xl:px-4 2xl:py-4">
        <div className="flex flex-col items-center justify-center gap-4 h-full">
          <ShieldExclamationIcon className="w-12 h-12" />
          <p className="text-center">Tens de iniciar sessão para começares a trocar de turmas</p>
          <LoginButton expanded={true} />
        </div>
      </div>
    </div>
  </ScheduleContext.Provider>

  return <ScheduleContext.Provider value={{ originalExchangeSchedule, exchangeSchedule, loadingSchedule, setExchangeSchedule, enrolledCourseUnits }}>
    {
      <div className="grid w-cfull grid-cols-12 gap-x-4 gap-y-4 px-4 py-4">
        {/* Schedule Preview */}
        <div className="lg:min-h-adjusted order-1 col-span-12 min-h-min rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-9 2xl:px-5 2xl:py-5">
          <div className="h-full w-full">
            <ExchangeSchedule />
          </div>
        </div>

        <div className="lg:min-h-adjusted order-2 col-span-12 flex min-h-min flex-col justify-between rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-3 2xl:px-4 2xl:py-4">
          <ExchangeSidebarStatusView 
            sidebarStatus={sidebarStatus} 
            setSidebarStatus={setSidebarStatus}
          />
          {/* {user?.eligible_exchange ? */}
            {/* : */}
            {/* <div className="flex flex-col items-center justify-center gap-4 h-full"> */}
            {/*   <FaceFrownIcon className="w-12 h-12" /> */}
            {/*   <p className="text-center">Nenhuma das tuas unidades curriculares dá para trocar a turma no TTS</p> */}
            {/*   {/* TODO: Open the send feedback modal with something already written  */}
            {/*   <p className="text-center">Gostavas de utilizar esta funcionalidade no teu curso?</p> */}
            {/*   <Button onClick={() => { }}>Sim!</Button> */}
            {/*   */}
            {/* </div> */}
          {/* } */}
        </div>
      </div>
    }
  </ScheduleContext.Provider>
}

export default ExchangePage;
