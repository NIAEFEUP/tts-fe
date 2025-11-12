import useSWR from "swr";

import api from "../../api/backend";

export default (adminUsername?: string) => {
  const getCourseUnits = async () => {
    try {
      const url = new URL(`${api.BACKEND_URL}/exchange/admin/course_units/`);
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

  const cacheKey = adminUsername ? `admin-exchange-course-units-${adminUsername}` : "admin-exchange-course-units";
  const { data, error, mutate } = useSWR(cacheKey, getCourseUnits);
  const courseUnits = data ? data : null;

  return {
    courseUnits,
    error,
    loading: !data,
    mutate,
  };
};