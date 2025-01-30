import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";
import { StudentCourseMetadata } from "../../@types";

export default (nmec: string, course_id: number) => {
  const getStudentMetadata = async () => {
    try {
        const res = await fetch(`${api.BACKEND_URL}/student/${nmec}/${course_id}/metadata`, {
            credentials: "include"
        });

        if(res.ok) {
            return await res.json();
        }
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, mutate } = useSWR<Array<StudentCourseMetadata>>(`${nmec}-${course_id}`, getStudentMetadata);
  const studentCourseMetadata = useMemo(() => data ? data : null, [data]);

  return {
    studentCourseMetadata,
    error,
    loading: !data,
    mutate,
  };
};