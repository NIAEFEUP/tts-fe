import useSWR from "swr";
import studentScheduleRequestService from "../api/services/studentScheduleRequestService";

export default () => {
  const getEligibileCourseUnits = async () => {
    try {
      const res = await studentScheduleRequestService.refreshSchedule();

      if (res.ok) {
        return await res.json();
      }

      return [];
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  const { data, error, mutate, isValidating } = useSWR("refresh-student-schedule", getEligibileCourseUnits, {});

  return {
    refreshedSchedule: data,
    error,
    forceRefreshStudentSchedule: mutate,
    isRefreshingStudentSchedule: isValidating
  };
};

