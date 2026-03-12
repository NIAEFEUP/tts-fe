import useStudentCourseMetadata from '../../../../hooks/admin/useStudentCourseMetadata'
import { Button } from '../../../ui/new/newButton'
import { cn } from '../../../../lib/utils'

type Props = {
  nmec: string
  variant?: 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  courseId: Array<number>
}

export const TreatExchangeButton = ({ nmec, courseId, variant = 'primary' }: Props) => {
  const { studentCourseMetadata } = useStudentCourseMetadata(nmec, courseId)

  const uniqueMetadata = studentCourseMetadata
    ? Array.from(studentCourseMetadata.values())
        .filter((metadata) => metadata.length > 0)
        .flat()
        .filter(
          (metadata, index, self) =>
            index === self.findIndex((m) => m.fest_id === metadata.fest_id && m.course.id === metadata.course.id),
        )
    : []

  return (
    <>
      {uniqueMetadata.map((metadata) => (
        <a
          href={`https://sigarra.up.pt/feup/pt/it_adm.adm_selecciona_turmas_livre?pv_estudante_id=${metadata.fest_id}&pv_curso_id=${metadata.course.id}`}
          key={`${metadata.fest_id}-${metadata.course.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant={variant as any}
            size="md"
            className={cn(
              variant === 'primary' && 'hover:bg-accent/90',
              variant === 'outline' && 'hover:bg-accent/5',
              variant === 'destructive' && 'hover:bg-red-700',
            )}
          >
            Tratar
          </Button>
        </a>
      ))}
    </>
  )
}
