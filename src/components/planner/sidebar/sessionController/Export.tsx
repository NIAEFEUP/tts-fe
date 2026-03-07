import { Button } from '../../../ui/new/newButton'
import { Dropdown, DropdownItems, DropdownItem, DropdownTrigger } from '../../../ui/new/dropdown'
import CsvExport from './CsvExport'
import NitSigExport from './NitSigExport'
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'

/**
 * Sidebar with all the main schedule interactions
 */
const Export = () => {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="primary" square className="bg-primary hover:bg-primary/90">
          <ArrowDownTrayIcon className="h-5 w-5" />
        </Button>
      </DropdownTrigger>
      <DropdownItems className="p-1">
        <DropdownItem asChild>
          <CsvExport />
        </DropdownItem>
        <DropdownItem asChild>
          <NitSigExport />
        </DropdownItem>
      </DropdownItems>
    </Dropdown>
  )
}

export default Export
