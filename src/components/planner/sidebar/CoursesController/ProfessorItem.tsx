import { useContext, useState } from 'react'
import { ProfessorInfo } from '../../../../@types/new_index'
import { DropdownMenuCheckboxItem } from '../../../ui/dropdown-menu'
import { ExclamationTriangleIcon, EyeIcon } from '@heroicons/react/20/solid'
import { getLessonBoxTime, convertWeekday } from '../../../../utils'

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