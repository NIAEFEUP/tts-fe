import useSwr from "swr";
import api from "../api/backend";
import Cookies from 'js-cookie';

const useSession = () => {

  const trySession = async (key) => {
    try {
      const res = await fetch(`${api.BACKEND_URL}/${key}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": Cookies.get('csrftoken')
        }
      });

      if (res.ok) {
        return "something"
      }
    } catch (e) {
      console.error(e);
    }
  }

  const { data, error, mutate } = useSwr("login/", trySession, {
    refreshInterval: 3600000000
  });

  return {
    signedIn: !data
  }
}

export default useSession;
