import useStudentCourseMetadata from "../../../../hooks/admin/useStudentCourseMetadata"
import { Button } from "../../../ui/button"

type Props = {
    nmec: string,
    variant?: "icon" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "link",
    courseId: Array<number>
}

export const TreatExchangeButton = ({
    nmec,
    courseId,
    variant = "default",
}: Props) => {
    const { studentCourseMetadata } = useStudentCourseMetadata(nmec, courseId);

    const uniqueMetadata = studentCourseMetadata
        ? Array.from(studentCourseMetadata.values())
            .filter(metadata => metadata.length > 0)
            .flat()
            .filter(
                (metadata, index, self) =>
                    index === self.findIndex(m => m.fest_id === metadata.fest_id && m.course.id === metadata.course.id)
            )
        : [];
        
    return (
        <>
            {
                uniqueMetadata.map((metadata) => (
                    <a
                        href={`https://sigarra.up.pt/feup/pt/it_adm.adm_selecciona_turmas_livre?pv_estudante_id=${metadata.fest_id}&pv_curso_id=${metadata.course.id}`}
                        key={`${metadata.fest_id}-${metadata.course.id}`}
                    >
                        <Button
                            variant={variant}
                        >
                            Tratar
                        </Button>
                    </a>
                ))
            }
        </>
    )
}
