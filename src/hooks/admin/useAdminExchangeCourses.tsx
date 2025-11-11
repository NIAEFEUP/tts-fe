import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";

export default (adminUsername?: string) => {
  const getCourses = async () => {
    try {
        const url = new URL(`${api.BACKEND_URL}/exchange/admin/courses/`);
        if (adminUsername) {
          url.searchParams.set('admin_username', adminUsername);
        }
        
        const res = await fetch(url.toString(), {
            credentials: "include"
        });

        if(res.ok) {
            return await res.json();
        }
    } catch (error) {
      console.error(error);
    }
  };

  const cacheKey = adminUsername ? `admin-exchange-courses-${adminUsername}` : "admin-exchange-courses";
  const { data, error, mutate } = useSWR(cacheKey, getCourses);
  const courses = useMemo(() => data ? data : null, [data]);

  return {
    courses,
    error,
    loading: !data,
    mutate,
  };
};


