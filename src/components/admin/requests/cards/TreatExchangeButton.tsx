import useStudentCourseMetadata from "../../../../hooks/admin/useStudentCourseMetadata"
import { Button } from "../../../ui/button"

type CourseInfo = {
    id: number,
    acronym: string
}

type Props = {
    nmec: string,
    variant?: "icon" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "link",
    courseId: Array<number>,
    courseInfo?: Array<CourseInfo>
}

export const TreatExchangeButton = ({
    nmec,
    courseId,
    courseInfo,
    variant = "default",
}: Props) => {
    const uniqueCourseIds = Array.from(new Set(courseId));
    
    const { studentCourseMetadata } = useStudentCourseMetadata(nmec, uniqueCourseIds);

    const uniqueMetadata = studentCourseMetadata
        ? Array.from(studentCourseMetadata.values())
            .filter(metadata => metadata.length > 0)
            .flat()
            .filter(
                (metadata, index, self) =>
                    index === self.findIndex(m => m.fest_id === metadata.fest_id && m.course.id === metadata.course.id)
            )
        : [];

    const coursesWithMetadata = new Set(uniqueMetadata.map(m => m.course.id));
    const coursesWithoutMetadata = uniqueCourseIds.filter(id => !coursesWithMetadata.has(id));
    
    const getCourseAcronym = (courseId: number) => {
        return courseInfo?.find(c => c.id === courseId)?.acronym || null;
    };
        
    const showCourseLabel = uniqueCourseIds.length > 1;

    return (
        <>
            {
                uniqueMetadata.map((metadata) => {
                    const acronym = getCourseAcronym(metadata.course.id);
                    return (
                        <a
                            href={`https://sigarra.up.pt/feup/pt/it_adm.adm_selecciona_turmas_livre?pv_estudante_id=${metadata.fest_id}&pv_curso_id=${metadata.course.id}`}
                            key={`${metadata.fest_id}-${metadata.course.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            
                        >
                            <Button
                                variant={variant}
                            >
                                {showCourseLabel && acronym ? `Tratar (${acronym})` : 'Tratar'}
                            </Button>
                        </a>
                    );
                })
            }
            {
                coursesWithoutMetadata.map((course_id) => {
                    const acronym = getCourseAcronym(course_id);
                    return (
                        <a
                            href={`https://sigarra.up.pt/feup/pt/it_adm.adm_t_livre_escolhe_aluno?pv_curso_id=${course_id}`}
                            key={`no-metadata-${course_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button
                                variant={variant}
                            >
                                {showCourseLabel && acronym ? `Tratar (${acronym})` : 'Tratar'}
                            </Button>
                        </a>
                    );
                })
            }
        </>
    )
}
