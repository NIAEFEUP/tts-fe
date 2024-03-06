import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { DirectExchangeSelection } from "./DirectExchangeSelection";
import { getStudentSchedule } from "../../api/backend";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import { SubmitDirectExchangeButton } from "./SubmitDirectExchangeButton";

export function DirectExchange() {

    const [schedule, setSchedule] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {loggedIn, setLoggedIn} = useContext(SessionContext);

    const username = localStorage.getItem("username");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getStudentSchedule(username);
                if(data.status === 403) {
                    setLoggedIn(false);
                }
                setSchedule(data.filter(course => course.tipo === "TP")
                    .map(course => ({ ucName: course.ucurr_nome, ucClass: course.turma_sigla, ucCode: course.ocorrencia_id })));
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [username]);

    if (isLoading) {
        return <p>Loading schedule...</p>;
    }

    if (error) {
        return <p>Error fetching schedule: {error.message}</p>;
    }


    return (
        <div className="flex justify-center flex-col space-y-4 mt-4">
            <Button variant="info" className="w-full"><InformationCircleIcon className="h-5 w-5 mr-2"></InformationCircleIcon>Como funcionam as trocas diretas?</Button>
            <SubmitDirectExchangeButton />
            {
                schedule.map((uc) => (
                    <DirectExchangeSelection ucName={uc.ucName} ucClass={uc.ucClass} ucCode={uc.ucCode} key={uc.ucName} />
                ))
            }
        </div>
    );
}
