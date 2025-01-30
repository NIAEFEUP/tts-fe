import { useState, useContext, useEffect, Dispatch, SetStateAction } from "react";
// import { Desert } from "../../svgs/";
import { ExchangeCoursePicker } from "../../planner/sidebar/sessionController/ExchangeCoursePicker";
import { CourseInfo, Major } from "../../../@types";
import MajorContext from "../../../contexts/MajorContext";
import BackendAPI from "../../../api/backend";
import CourseContext from "../../../contexts/CourseContext";
import { Button } from "../../ui/button";
import courseUnitEnrollmentService from "../../../api/services/courseUnitEnrollmentService";
import { ExchangeSidebarStatus } from "../../../pages/Exchange"
import { useToast } from "../../ui/use-toast";
import { ExchangeClassSelector } from "../../planner/sidebar/CoursesController/ExchangeClassSelector";
import useLocalStorage from "../../../hooks/useLocalStorage";
import ScheduleContext from "../../../contexts/ScheduleContext";
import useSchedule from "../../../hooks/useSchedule";
import useStudentCourseUnits from "../../../hooks/useStudentCourseUnits";
// import { AlreadyEnrolledCourseUnitCard } from "./AlreadyEnrolledCourseUnitCard";

export enum CourseUnitEnrollmentType {
  DISENROLLING = 1,
  ENROLLING = 2
}

export type EnrollmentOption = {
  classId: number, // If the user is disenrolling, we do not need a classid
  type: CourseUnitEnrollmentType
}

type Props = {
  setExchangeSidebarStatus: Dispatch<SetStateAction<ExchangeSidebarStatus>>
}

const notNullEnrollemnts = (enrollments: Map<number, EnrollmentOption>) => {
  return Array.from(enrollments.values()).filter(enrollment => enrollment.classId !== null).length > 0;
}

export const Enrollments = ({
  setExchangeSidebarStatus
}: Props) => {
  const parentCourseContext = useContext(CourseContext);

  const [enrollCourses, setEnrollCourses] = useLocalStorage<CourseInfo[]>("enrollCourses", []);
  const [enrollmentChoices, setEnrollmentChoices] = useState<Map<number, EnrollmentOption>>(new Map());
  const [coursesInfo, setCoursesInfo] = useState<CourseInfo[]>([]);
  const { setMajors } = useContext(MajorContext);

  const { exchangeSchedule, setExchangeSchedule } = useContext(ScheduleContext);
  const originalSchedule = useSchedule();

  const { enrolledCourseUnits: alreadyEnrolledCourseUnits } = useStudentCourseUnits();

  const { toast } = useToast();

  useEffect(() => {
    BackendAPI.getMajors().then((majors: Major[]) => {
      setMajors(majors.filter((major) => major.acronym === "L.EIC" || major.acronym === "M.EIC"))
    })
  }, [])

  useEffect(() => {
    if (!enrollCourses || enrollCourses.length === 0) return;

    for (const [course_unit_id, option] of enrollmentChoices) {
      const { classId } = option;

      if (!classId) continue; // If the student has not yet selected a class for course, skip it

      if (option.type === CourseUnitEnrollmentType.ENROLLING) {
        const course = enrollCourses.find((course) => course.course_unit_id === course_unit_id);
        const classInfo = course.classes.find((classInfo) => classInfo.id === classId);

        if (!exchangeSchedule) return;
        const newSchedule = [...exchangeSchedule.filter((classDescriptor) => {
          return classDescriptor.courseInfo.course_unit_id !== course_unit_id
        })];

        newSchedule.push({
          courseInfo: course,
          classInfo: classInfo
        });
        setExchangeSchedule(newSchedule);
      }
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
          {enrollCourses.map((course: CourseInfo) => (
            <ExchangeClassSelector
              course={course}
              selectedClassIdCallback={
                (classId) => {
                  const newEnrollmentChoices = new Map(enrollmentChoices);
                  newEnrollmentChoices.set(course.id, { classId, type: CourseUnitEnrollmentType.ENROLLING });
                  setEnrollmentChoices(newEnrollmentChoices);
                }}
              key={`course-schedule-${course.id}`}
            />
          ))}

          {/* {alreadyEnrolledCourseUnits?.map((courseUnit: CourseInfo) => (
            <AlreadyEnrolledCourseUnitCard
              courseUnit={courseUnit}
              enrollmentChoices={enrollmentChoices}
              setEnrollmentChoices={setEnrollmentChoices}
            />
          ))} */}

          {(notNullEnrollemnts(enrollmentChoices) && enrollmentChoices.size > 0) &&
            <form onSubmit={async (e) => {
              e.preventDefault();

              const res = await courseUnitEnrollmentService.submitEnrollmentRequest(enrollmentChoices);

              if (res.ok) {
                setExchangeSidebarStatus(ExchangeSidebarStatus.SHOWING_REQUESTS);
                toast({
                  title: 'Pedido submetido',
                  description: 'Pedido de inscrição submetida com sucesso',
                });
                setEnrollCourses([]);
              } else {
                const json = await res.json();
                toast({
                  title: 'Erro',
                  description: json.error
                })
              }
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