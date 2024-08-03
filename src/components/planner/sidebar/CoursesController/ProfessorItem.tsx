import { ProfessorInfo } from "../../../../@types"
import { DropdownMenuCheckboxItem } from "../../../ui/dropdown-menu"

type Props = {
  professorInformation: ProfessorInfo
  filtered?: boolean
  onSelect?: (event) => void
}

const ProfessorItem = ({ professorInformation, filtered, onSelect }: Props) => {
  return (
    <DropdownMenuCheckboxItem onSelect={(e) => onSelect(e)} checked={filtered} className="group gap-2">
      <span className="text-sm tracking-tighter">{professorInformation.name}</span>
      <span className="text-xs text-gray-500">{professorInformation.acronym}</span>

      {/* {or} */}

      {/* <span className="group-hover:hidden">{professorInformation.acronym}</span>
      <span className="hidden truncate group-hover:block">{professorInformation.name}</span> */}
    </DropdownMenuCheckboxItem>
  )
}

export default ProfessorItem