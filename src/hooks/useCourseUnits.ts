import { useMemo } from "react";
import api from "../api/backend";
import useSWR from "swr";

// import config from "../config";
// const { API_HOSTNAME } = config;

export default (courseId: number | null) => {
  const url = `${api.BACKEND_URL}/course_units/${courseId}/2024/2`;

  const getCourseUnit = async (id) => {
    try {

      if (courseId) return await api.getCoursesByMajorId(Number(id));


    } catch (error) {
      // if (Array.isArray(error)) throw error;
      // throw [{ msg: Constants.UNEXPECTED_ERROR_MESSAGE }];
    }

  };

  const { data, error, mutate } = useSWR(String(courseId), getCourseUnit);
  const courseUnits = useMemo(() => data ? data : null, [data]);

  return {
    courseUnits,
    error,
    loading: !data,
    mutate,
  };
};

