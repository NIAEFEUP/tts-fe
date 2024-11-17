import { useContext, useEffect, useState } from "react";
import { ClassDescriptor } from "../@types";
import { LoginButton } from "../components/auth/LoginButton";
import { ExchangeSidebar } from "../components/exchange/ExchangeSidebar";
import ExchangeSchedule from "../components/exchange/schedule/ExchangeSchedule";
import { Schedule } from "../components/planner";
import ScheduleContext from "../contexts/ScheduleContext";
import SessionContext from "../contexts/SessionContext";
import { useSession } from "../hooks";
import useEligibleExchange from "../hooks/useEligibleExchange";
import useSchedule from "../hooks/useSchedule";
import useStudentCourseUnits from "../hooks/useStudentCourseUnits";
import '../styles/exchange.css';

const ExchangeGuard = ({ children }) => {
  return (
    <article className="flex flex-col mx-auto w-full gap-4">
      <h1 className="text-center text-3xl font-bold">
        Trocas de Turmas
      </h1>
      {children}
    </article>
  );
}

const ExchangePage = () => {
  const [loads, setLoads] = useState<number>(-1);
  const { schedule, loading: loadingSchedule } = useSchedule();
  const [originalExchangeSchedule, setOriginalExchangeSchedule] = useState<Array<ClassDescriptor>>([]);
  const [exchangeSchedule, setExchangeSchedule] = useState<Array<ClassDescriptor>>([]);
  const { signedIn, user } = useContext(SessionContext);
  const { enrolledCourseUnits } = useStudentCourseUnits();

  useEffect(() => {
    setLoads(prev => prev + 1);
  }, [setLoads]);

  useEffect(() => {
    setExchangeSchedule(schedule ? schedule : []);

    if (loads <= 0) {
      setOriginalExchangeSchedule(schedule ? schedule : []);
    }
  }, [schedule]);

  return <>
    {signedIn ?
      <ScheduleContext.Provider value={{ originalExchangeSchedule, exchangeSchedule, loadingSchedule, setExchangeSchedule, enrolledCourseUnits }}>
        {
          user?.eligible_exchange ?
            <div className="grid w-cfull grid-cols-12 gap-x-4 gap-y-4 px-4 py-4">
              {/* Schedule Preview */}
              <div className="lg:min-h-adjusted order-1 col-span-12 min-h-min rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-9 2xl:px-5 2xl:py-5">
                <div className="h-full w-full">
                  <ExchangeSchedule />
                </div>
              </div>

              <ExchangeSidebar />
            </div>
            : <ExchangeGuard>
              <p className="text-center">Não tens nenhuma inscrição numa disciplina com um período de trocas ativo.</p>
            </ExchangeGuard>
        }
      </ScheduleContext.Provider>
      : <ExchangeGuard>
        <p className="text-center">
          Tens de iniciar sessão para acederes a esta funcionalidade.
        </p>
        <div className="justify-center mx-auto">
          <LoginButton expanded={true} />
        </div>

      </ExchangeGuard>}
  </>
}

export default ExchangePage;
