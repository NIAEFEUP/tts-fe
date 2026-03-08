import { ProfessorInfo } from '../../../../@types'
import { DropdownItem } from '../../../ui/new/dropdown'
import { Check } from 'lucide-react'

type Props = {
  professorInformation: ProfessorInfo
  filtered?: boolean
  onSelect?: (event) => void
}

const ProfessorItem = ({ professorInformation, filtered, onSelect }: Props) => {
  return (
    <DropdownItem onSelect={(e) => onSelect(e)} className="group gap-2">
      {filtered && <Check className="h-4 w-4" />}
      <span className="text-sm tracking-tighter">{professorInformation.name}</span>
      <span className="text-xs text-gray-500">{professorInformation.acronym}</span>

      {/* {or} */}

      {/* <span className="group-hover:hidden">{professorInformation.acronym}</span>
      <span className="hidden truncate group-hover:block">{professorInformation.name}</span> */}
    </DropdownItem>
  )
}

export default ProfessorItem
