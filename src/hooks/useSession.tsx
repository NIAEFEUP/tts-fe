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
    } catch (e) {
      console.error(e);
    }
  }

  const { data, error, mutate } = useSwr("login/federated/", trySession, {
    refreshInterval: 500
  });

  return {
    signedIn: false //!data
  }
}

export default useSession;
