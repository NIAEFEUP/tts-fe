import useStudentCourseMetadata from "../../../../hooks/admin/useStudentCourseMetadata"
import { Button } from "../../../ui/button"

type Props = {
    nmec: string,
    courseUnitId: number,
    notEnrolledCourseUnitId?: number | null,
    variant?: "icon" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "link",
    courseId: number
}

export const TreatExchangeButton = ({
    nmec,
    courseUnitId,
    notEnrolledCourseUnitId,
    courseId,
    variant = "default",
}: Props) => {
    const { studentCourseMetadata } = useStudentCourseMetadata(nmec, courseUnitId);

    const uniqueMetadata = studentCourseMetadata
        ? Array.from(new Map(studentCourseMetadata.map(m => [m.fest_id, m])).values())
        : [];

    return (
        <>
            {
                uniqueMetadata.map((metadata) => (
                    <a
                        href={`https://sigarra.up.pt/feup/pt/it_adm.adm_selecciona_turmas_livre?pv_estudante_id=${metadata.fest_id}&pv_curso_id=${courseId}`}
                        key={metadata.fest_id}
                    >
                        <Button
                            variant={variant}
                        >
                            Tratar
                        </Button>
                    </a>
                ))
            }
            
            {notEnrolledCourseUnitId &&
                <p>Fuck this shit</p>
            }
        </>
    )
}
