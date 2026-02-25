import api from "../backend";

const logout = async (token, forceScheduleRevalidation, setLoggingOut) => {
   fetch(`${api.OIDC_LOGOUT_URL}`, {
      method: "POST", credentials: "include", headers: {
        "X-CSRFToken": api.getCSRFToken()
      }
    }).then(() => {
      forceScheduleRevalidation();
      setLoggingOut(false);
    }).catch((e) => {
      console.error(e);
    });

}

const authService = {
  logout
};

export default authService;
