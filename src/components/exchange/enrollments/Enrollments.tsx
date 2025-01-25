import { useState, useContext, useEffect, Dispatch, SetStateAction } from "react";
import { Desert } from "../../svgs/";
import { ExchangeCoursePicker } from "../../planner/sidebar/sessionController/ExchangeCoursePicker";
import { ClassInfo, CourseInfo, Major } from "../../../@types";
import MajorContext from "../../../contexts/MajorContext";
import BackendAPI from "../../../api/backend";
import { PlannerClassSelector } from "../../planner/sidebar/CoursesController/PlannerClassSelector";
import CourseContext from "../../../contexts/CourseContext";
import { Button } from "../../ui/button";
import courseUnitEnrollmentService from "../../../api/services/courseUnitEnrollmentService";
import { ExchangeSidebarStatus } from "../../../pages/Exchange"
import { useToast } from "../../ui/use-toast";
import { ExchangeClassSelector } from "../../planner/sidebar/CoursesController/ExchangeClassSelector";
import useLocalStorage from "../../../hooks/useLocalStorage";
import ScheduleContext from "../../../contexts/ScheduleContext";
import useSchedule from "../../../hooks/useSchedule";

type EnrollmentChoice = {
  courseInfo: CourseInfo,
  class: ClassInfo
}

type Props = {
  setExchangeSidebarStatus: Dispatch<SetStateAction<ExchangeSidebarStatus>>
}

export const Enrollments = ({
  setExchangeSidebarStatus
}: Props) => {
  const parentCourseContext = useContext(CourseContext);

  const [enrollCourses, setEnrollCourses] = useLocalStorage<CourseInfo[]>("enrollCourses", []);
  const [enrollmentChoices, setEnrollmentChoices] = useState<Map<number, number>>(new Map());
  const [coursesInfo, setCoursesInfo] = useState<CourseInfo[]>([]);
  const { setMajors } = useContext(MajorContext);

  const { exchangeSchedule, setExchangeSchedule } = useContext(ScheduleContext);
  const originalSchedule = useSchedule();

  const { toast } = useToast();

  useEffect(() => {
    BackendAPI.getMajors().then((majors: Major[]) => {
      setMajors(majors)
    })
  }, [])

  useEffect(() => {
    for (const [course_unit_id, class_id] of enrollmentChoices) {
      if (!class_id) continue; // If the student has not yet selected a class for course, skip it

      const course = enrollCourses.find((course) => course.course_unit_id === course_unit_id);
      const classInfo = course.classes.find((classInfo) => classInfo.id === class_id);

      const newSchedule = [...exchangeSchedule?.filter((classDescriptor) => {
        return classDescriptor.courseInfo.course_unit_id !== course_unit_id
      })];

      newSchedule.push({
        courseInfo: course,
        classInfo: classInfo
      });
      setExchangeSchedule(newSchedule);
    }

    return () => {
      setExchangeSchedule(originalSchedule.schedule);
    }
  }, [enrollCourses, enrollmentChoices])

  return (
    <CourseContext.Provider value={{
      ...parentCourseContext,
      pickedCourses: enrollCourses,
      setPickedCourses: setEnrollCourses,
      coursesInfo: coursesInfo,
      setCoursesInfo: setCoursesInfo,
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
          {enrollCourses.length === 0 && <>
            <Desert className="w-full" />
            <p className="text-center text-lg">
              Não escolheste inscrição em nenhuma disciplina.
            </p>
          </>}

          {enrollCourses.map((course: CourseInfo) => (
            <ExchangeClassSelector
              course={course}
              selectedClassIdCallback={
                (classId) => {
                  const newEnrollmentChoices = new Map(enrollmentChoices);
                  newEnrollmentChoices.set(course.id, classId);
                  setEnrollmentChoices(newEnrollmentChoices);
                }}
              key={`course-schedule-${course.id}`}
            />
          ))}

          {enrollCourses.length > 0 &&
            <form onSubmit={async (e) => {
              e.preventDefault();
              courseUnitEnrollmentService.submitEnrollmentRequest(enrollmentChoices);
              setExchangeSidebarStatus(ExchangeSidebarStatus.SHOWING_REQUESTS);
              toast({
                title: 'Pedido submetido',
                description: 'Pedido de inscrição submetida com sucesso',
              });
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
