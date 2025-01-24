import { useState, useContext, useEffect } from "react";
import { ExchangeCoursePicker } from "../../planner/sidebar/sessionController/ExchangeCoursePicker";
import { CourseInfo } from "../../../@types";
import MajorContext from "../../../contexts/MajorContext";
import BackendAPI from "../../../api/backend";

export const Enrollments = () => {
  const [enrollCourses, setEnrollCourses] = useState<CourseInfo[]>([]);
  const { setMajors } = useContext(MajorContext);
  
   useEffect(() => {
    BackendAPI.getMajors().then((majors: Major[]) => {
      setMajors(majors)
    })
  }, [])

  return (
  <div className="relative flex flex-row flex-wrap items-center justify-center gap-x-2 gap-y-2 lg:justify-start">
    <div className="flex flex-row justify-between items-center w-full">
      <h1 className="font-bold text-xl">Inscrições</h1>
      <div className="w-1/2">
        <ExchangeCoursePicker 
          enrollCourses={enrollCourses} 
          setEnrollCourses={setEnrollCourses}
        />
      </div>
    </div>
  </div>
  )
}
