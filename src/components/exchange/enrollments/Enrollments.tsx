import { useState, useContext, useEffect } from "react";
import { ExchangeCoursePicker } from "../../planner/sidebar/sessionController/ExchangeCoursePicker";
import { CourseInfo, Major } from "../../../@types";
import MajorContext from "../../../contexts/MajorContext";
import BackendAPI from "../../../api/backend";
import ClassSelector from "../../planner/sidebar/CoursesController/ClassSelector";
import CourseContext from "../../../contexts/CourseContext";
import { Button } from "../../ui/button";

export const Enrollments = () => {
  const [enrollCourses, setEnrollCourses] = useState<CourseInfo[]>([]);
  const [coursesInfo, setCoursesInfo] = useState<CourseInfo[]>([]);
  const { setMajors } = useContext(MajorContext);
  
   useEffect(() => {
    BackendAPI.getMajors().then((majors: Major[]) => {
      setMajors(majors)
    })
  }, [])

  return (
    <CourseContext.Provider value={{
      pickedCourses: enrollCourses,
      setPickedCourses: setEnrollCourses,
      coursesInfo: coursesInfo,
      setCoursesInfo: setCoursesInfo
    }}>
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

      <div className="w-full flex flex-col gap-y-2">
        {enrollCourses.map((course: CourseInfo) => (
          <ClassSelector 
            course={course} 
            key={`course-schedule-${course.id}`} 
          />
        ))}

        {enrollCourses.length > 0 &&
          <form onSubmit={(e) => {
            e.preventDefault();
          }}>
            <Button className="w-full">
              Submeter
            </Button>
          </form>
        }
      </div>
    </div>
  </CourseContext.Provider>
  )
}
