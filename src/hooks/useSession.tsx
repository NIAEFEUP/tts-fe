import useSwr from "swr";
import api from "../api/backend";

const useSession = () => {

  const trySession = async (key) => {
    try {
      const res = await fetch(`${api.BACKEND_URL}/${key}`, {
        method: "GET",
        credentials: "include"
      });

      return await res.json();
    } catch (e) {
      console.error(e);
    }
  }

  const { data, isLoading, mutate } = useSwr("auth/info/", trySession, {
    focusThrottleInterval: 1800000
  });

  if (data) {
    localStorage.setItem("signedIn", (true).toString());
  }

  return {
    signedIn: data ? data.signed : false,
    user: data ? data : null,
    forceScheduleRevalidation: mutate,
    isLoading
  }
}

export default useSession;
