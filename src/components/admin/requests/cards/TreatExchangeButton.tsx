import useStudentCourseMetadata from "../../../../hooks/admin/useStudentCourseMetadata"
import { Button } from "../../../ui/button"

type Props = {
    nmec: string,
    courseUnitId: number,
    variant?: "icon" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export const TreatExchangeButton = ({
    nmec,
    courseUnitId,
    variant = "default"
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
                        href={`https://sigarra.up.pt?fest_id=${metadata.fest_id}`}
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
        </>
    )
}
