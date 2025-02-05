import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";

export default (nmec: string, courseIds: Array<number>) => {
  const getStudentMetadata = async () => {
    try {
      const map = new Map();

      for (const course_id of courseIds) {
        const res = await fetch(`${api.BACKEND_URL}/student/${nmec}/${course_id}/metadata`, {
          credentials: "include"
        });

        if (res.ok) {
          map.set(course_id, await res.json());
        }
      }

      return map;
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, mutate } = useSWR(`${nmec}-${courseIds.join("-")}`, getStudentMetadata);
  const studentCourseMetadata = useMemo(() => data ? data : null, [data]);

  return {
    studentCourseMetadata,
    error,
    loading: !data,
    mutate,
  };
};