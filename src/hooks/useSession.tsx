import useSwr from "swr";
import api from "../api/backend";

const useSession = () => {

  const trySession = async (key) => {
    try {
      const res = await fetch(`${api.BACKEND_URL}/${key}`, {
        method: "GET",
      });

      return await res.json();
    } catch (e) {
      console.error(e);
    }
  }

  const { data, error, mutate } = useSwr("auth/info/", trySession, {
    refreshInterval: 3600000000
  });

  return {
    signedIn: data ? data.signed : false,
    user: data ? data : null
  }
}

export default useSession;
