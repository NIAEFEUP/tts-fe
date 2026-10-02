import api from '../backend'

const logout = async (token, forceScheduleRevalidation, setLoggingOut) => {
  fetch(`${api.OIDC_LOGOUT_URL}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-CSRFToken': api.getCSRFToken() || '',
    },
  })
    .then(() => {
      forceScheduleRevalidation()
      setLoggingOut(false)
    })
    .catch((e) => {
      console.error('Logout fetch error (likely CORS from OIDC redirect):', e)
      // Even if the OIDC redirect fails due to CORS (which happens in dev),
      // the Django backend has already cleared the session.
      // So we must still update the frontend state!
      forceScheduleRevalidation()
      setLoggingOut(false)
    })
}

const authService = {
  logout,
}

export default authService
