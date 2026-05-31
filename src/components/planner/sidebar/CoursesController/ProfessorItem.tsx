import { ProfessorInfo } from '../../../../@types'

import { Check } from 'lucide-react'

type Props = {
  professorInformation: ProfessorInfo
  filtered?: boolean
  onSelect?: (event) => void
}

const ProfessorItem = ({ professorInformation, filtered, onSelect }: Props) => {
  return (
    <button 
      type="button"
      onClick={(e) => onSelect?.(e)} 
      className="group flex w-[calc(100%-16px)] mx-2 my-1 cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-1.5 font-medium outline-none text-foreground/80 hover:bg-background-secondary transition-colors"
    >
      {filtered && <Check className="h-4 w-4" />}
      <span className="text-sm tracking-tighter">{professorInformation.name}</span>
      <span className="text-xs text-gray-500">{professorInformation.acronym}</span>

      {/* {or} */}

      {/* <span className="group-hover:hidden">{professorInformation.acronym}</span>
      <span className="hidden truncate group-hover:block">{professorInformation.name}</span> */}
    </button>
  )
}

export default ProfessorItem
