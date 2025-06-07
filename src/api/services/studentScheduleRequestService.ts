import api from "../backend";

const refreshSchedule = async () => {
    return fetch(`${api.BACKEND_URL}/student/schedule`, {
        credentials: "include",
        method: "PUT",
        headers: {
          "X-CSRFToken": api.getCSRFToken(),
        }
      });
}

const studentScheduleRequestService = {
    refreshSchedule
}

export default studentScheduleRequestService;