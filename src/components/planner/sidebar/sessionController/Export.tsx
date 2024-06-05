import CsvExport from './CsvExport'
import NitSigExport from './NitSigExport'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../ui/dropdown-menu'
import { Button } from '../../../ui/button'

import { CourseOption, MultipleOptions } from '../../../../@types/new_index'
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'

type Props = {
  multipleOptions: MultipleOptions
  optionsList: any
}

/**
 * Sidebar with all the main schedule interactions
 */
const Export = ({ multipleOptions, optionsList }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="icon" className="bg-primary">
          <ArrowDownTrayIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <CsvExport multipleOptions={multipleOptions} optionsList={optionsList} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <NitSigExport />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Export
