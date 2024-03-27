import { useContext, useMemo } from "react";
import useSWR from "swr";
import { SessionContext } from "../../contexts/SessionContext";
import { logout } from "../backend";

export function useSchedule(username) {
    const { loggedIn, setLoggedIn } = useContext(SessionContext);
    const getStudentSchedule = async (key: string) => {
        try {
            const res = await fetch(key, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                if(res.status === 403) {
                   await logout();
                   setLoggedIn(false);
                }
                throw error;
            }

            return res;

        } catch (error) {
            return error;
        }
    };

    const { data, error } = useSWR(`/student_schedule/${username}`, getStudentSchedule);
    const studentSchedule = useMemo(() => data ? data : null, [data]);

    return {
        data: studentSchedule,
        error,
        isLoading: !data
    };
}

