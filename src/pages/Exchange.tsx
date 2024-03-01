import { Schedule } from "../components/planner";
import { ExchangeSidebar } from "../components/exchange/ExchangeSidebar";
import { getStudentSchedule } from "../api/backend";

const ExchangePage = () => {
    
    const courses = getStudentSchedule(localStorage.getItem('username')).then((response) => {
        var courseOptions = [];
        response.forEach((course, i: number) => {
            if (course.tipo === "TP") {
                courseOptions.push({
                    shown: {
                        T: true,
                        TP: true
                    },
                    locked: false,
                    course: {
                        checked: true,
                        info: {
                            id: i,
                            course_id: course.ocorrencia_id,
                            course_unit_id: course.aula_id,
                            sigarra_id: course.ocorrencia_id,
                            course: course.ucurr_sigla,
                            name: course.ucurr_sigla,
                            acronym: course.ucurr_sigla,
                            url: "https://google.com/",
                            course_unit_year: 2025,
                            semester: 2,
                            year: 2025,
                            schedule_url: "https://google.com/",
                            ects: 6,
                            last_updated: "https://google.com/"
                        }
                    },
                    option: null,
                    schedules: [
                        {
                            day: course.dia,
                            duration: course.aula_duracao,
                            start_time: course.hore_inicio,
                            location: course.sala_sigla,
                            lesson_type: course.tipo,
                            is_composed: course.turmas.length > 1,
                            course_unit_id: course.aula_id,
                            last_updated: "https://google.com/",
                            class_name: course.turma_sigla, // e.g. 1MIEIC01
                            composed_class_name: course.turma_sigla, // e.g. COMP752
                            professors_link: "https://google.com/",
                            professor_information: []
                        }
                    ],
                    teachers: ((docentes) => 
                        {
                            var list = [];
                            docentes.forEach((docente) => {
                                list.push(
                                    {
                                        acronym: docente.doc_codigo,
                                        name: docente.doc_nome
                                    }
                                )
                            });
                            return list;
                        }
                    ),
                    filteredTeachers: course.teachers
                });
            }
        });
        return courseOptions;
    }).catch((e: Error) => console.log(e));

    return (
        <div className="grid w-full grid-cols-12 gap-x-4 gap-y-4 px-4 py-4">
            <div className="schedule">
                <Schedule courseOptions={[]}/>
            </div>
            <ExchangeSidebar />
        </div>
    );
}

export default ExchangePage;