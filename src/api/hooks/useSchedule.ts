import { useContext, useMemo } from "react";
import useSWR from "swr";
import { SessionContext } from "../../contexts/SessionContext";
import { getStudentSchedule, logout } from "../backend";

export function useSchedule(username, setLoggedIn) {
    const studentSchedule = async (username: string) => {
        try {
            const res = await getStudentSchedule(username);

            if (!res.ok) {
                if (res.status === 403) {
                    await logout();
                    setLoggedIn(false);
                }
            }

            return res.filter(course => course.tipo === "TP")
                .map(course => ({
                    sigla: course.ucurr_sigla,
                    name: course.ucurr_nome,
                    class: course.turma_sigla,
                    code: course.ocorrencia_id
                }));

        } catch (error) {
            return error;
        }
    };

    const { isLoading, isValidating, data, error } = useSWR(username, studentSchedule);

    console.log("is loading: ", isLoading);

    return {
        data,
        error,
        isLoading,
        isValidating
    };
}
