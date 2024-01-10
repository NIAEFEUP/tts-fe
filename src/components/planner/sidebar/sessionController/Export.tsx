import CsvExport from './CsvExport'
import NitSigExport from './NitSigExport'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu'
import { Button } from '../../../ui/button'

import { CourseOption, MultipleOptions } from '../../../../@types'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

type Props = {
  schedule: CourseOption[]
  multipleOptions: MultipleOptions
}

/**
 * Sidebar with all the main schedule interactions
 */
const Export = ({ schedule, multipleOptions }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="icon">
          <ArrowDownTrayIcon className="h-4 w-4" />
        </Button>
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
          />
        </svg> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem>
          <CsvExport schedule={schedule} multipleOptions={multipleOptions} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <NitSigExport />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Export
