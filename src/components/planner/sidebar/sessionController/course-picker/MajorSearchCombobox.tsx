import { useState, useContext } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons//react/24/solid'
import { Major } from '../../../../../@types'
import MajorContext from '../../../../../contexts/MajorContext'
import { cn } from '../../../../../utils'
import { buttonStyle } from '../../../../ui/new/newButton'
import {
  Dropdown,
  DropdownEmpty,
  DropdownItem,
  DropdownItems,
  DropdownSearchInput,
  DropdownTrigger,
} from '../../../../ui/new/dropdown'
import { AnalyticsTracker } from '../../../../../utils/AnalyticsTracker'

interface Props {
  selectedMajor: Major | null
  setSelectedMajor: (major: Major | null) => void
}

/**
 * Combobox also with a searchbar in which the user will be able to write the major he / she
 * wants to select courses from. They can type the major or click on the rightmost corner to open
 * the list of possible majors.
 */
const MajorSearchCombobox = ({ selectedMajor, setSelectedMajor }: Props) => {
  const { majors } = useContext(MajorContext)
  const [search, setSearch] = useState('')

  const match = (string: string, query: string) =>
    string.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, '')) ||
    string
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, '')
      .replace('.', '')
      .replace(':', '')
      .includes(query.toLowerCase().replace(/\s+/g, ''))

  const filteredMajors = majors
    ? majors.filter((major) => {
        if (!search) return true
        const searchWords = search.toLowerCase().replace(/\s+/g, ' ').trim().split(' ')
        return searchWords.every(
          (word) => match(major.name, word) || match(major.acronym, word) || match(major.faculty_id, word),
        )
      })
    : []

  return (
    <Dropdown
      onOpenChange={(isOpen) => {
        if (!isOpen) setTimeout(() => setSearch(''), 200)
      }}
    >
      <DropdownTrigger
        role="combobox"
        className={buttonStyle({
          variant: 'outline',
          className: 'w-full justify-between dark:bg-darker dark:text-slate-50',
        })}
      >
        <p className="truncate">{selectedMajor ? selectedMajor.name : 'Seleciona um curso...'}</p>
        <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </DropdownTrigger>
      <DropdownItems
        className="flex flex-col overflow-hidden"
        style={{ width: 'var(--width)' }}
        onWheel={(e) => e.stopPropagation()}
      >
        <DropdownSearchInput
          autoFocus
          placeholder="Procurar curso..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="overflow-y-auto overscroll-contain">
          {selectedMajor && <DropdownItem onSelect={() => setSelectedMajor(null)}>Remover Seleção</DropdownItem>}
          {filteredMajors.length === 0 && <DropdownEmpty>Nenhum curso corresponde à tua pesquisa.</DropdownEmpty>}
          {filteredMajors.map((major) => (
            <DropdownItem
              key={major.id}
              onSelect={() => {
                setSelectedMajor(major.id === selectedMajor?.id ? null : major)
                AnalyticsTracker.majorSelected(major)
              }}
            >
              <span className="truncate">{`${major.name} (${major.acronym}) - ${major.faculty_id.toUpperCase()}`}</span>
              <CheckIcon
                className={cn('ml-auto h-4 w-4 shrink-0', selectedMajor?.id === major.id ? 'opacity-100' : 'opacity-0')}
              />
            </DropdownItem>
          ))}
        </div>
      </DropdownItems>
    </Dropdown>
  )
}

export default MajorSearchCombobox
