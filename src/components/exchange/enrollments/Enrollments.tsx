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
import useLocalStorage from "../../../hooks/useLocalStorage";
import useStudentCourseUnits from "../../../hooks/useStudentCourseUnits";
import { AlreadyEnrolledCourseUnitCard } from "./AlreadyEnrolledCourseUnitCard";
import { EnrollingCourseUnitCard } from "./EnrollingCourseUnitCard";

export enum CourseUnitEnrollmentType {
  DISENROLLING = 1,
  ENROLLING = 2
}

export type EnrollmentOption = {
  type: CourseUnitEnrollmentType
}

type Props = {
  setExchangeSidebarStatus: Dispatch<SetStateAction<ExchangeSidebarStatus>>
}

export const Enrollments = ({
  setExchangeSidebarStatus
}: Props) => {
  const parentCourseContext = useContext(CourseContext);

  const [enrollCourses, setEnrollCourses] = useLocalStorage<CourseInfo[]>("enrollCourses", []);
  const [enrollmentChoices, setEnrollmentChoices] = useState<Map<number, EnrollmentOption>>(new Map());
  const [disenrollmentChoices, setDisenrollmentChoices] = useState<Map<number, EnrollmentOption>>(new Map());
  const [coursesInfo, setCoursesInfo] = useState<CourseInfo[]>([]);
  const { setMajors } = useContext(MajorContext);

  const { enrolledCourseUnits: alreadyEnrolledCourseUnits } = useStudentCourseUnits();

  const { toast } = useToast();

  useEffect(() => {
    BackendAPI.getMajors().then((majors: Major[]) => {
      setMajors(majors.filter((major) => major.acronym === "L.EIC" || major.acronym === "M.EIC"))
    })
  }, [])

  useEffect(() => {
    if (!enrollCourses) return;

    const newEnrollmentChoices = new Map();
    enrollCourses.forEach((course) => {
      newEnrollmentChoices.set(course.id, { type: CourseUnitEnrollmentType.ENROLLING });
    });
    setEnrollmentChoices(newEnrollmentChoices);

  }, [enrollCourses]);

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

        <div className="w-full flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            {enrollCourses?.length > 0 &&
              <h3 className="font-bold text-md">
                Cadeiras a inscrever
              </h3>
            }

            {enrollCourses.map((course: CourseInfo) => (
              <EnrollingCourseUnitCard
                key={"enrolling-" + course.id}
                courseUnit={course}
                enrollmentChoices={enrollmentChoices}
                setEnrollmentChoices={setEnrollmentChoices}
                setEnrollCourses={setEnrollCourses}
                enrollCourses={enrollCourses}
              />
            ))}
          </div>

          <div className="flex flex-col gap-y-2">
            <h3 className="font-bold text-md">
              Cadeiras já inscritas
            </h3>
            {alreadyEnrolledCourseUnits?.map((courseUnit: CourseInfo) => (
              <AlreadyEnrolledCourseUnitCard
                key={"already-enrolled-" + courseUnit.id}
                courseUnit={courseUnit}
                enrollmentChoices={disenrollmentChoices}
                setEnrollmentChoices={setDisenrollmentChoices}
              />
            ))}
          </div>

          {(enrollmentChoices.size > 0) &&
            <form onSubmit={async (e) => {
              e.preventDefault();

              const res = await courseUnitEnrollmentService.submitEnrollmentRequest(new Map([...enrollmentChoices, ...disenrollmentChoices]));

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