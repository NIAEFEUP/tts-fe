import { Button } from '../../../ui/new/button'
import { Menu } from '../../../ui/new/menu'
import CsvExport from './CsvExport'
import NitSigExport from './NitSigExport'
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'

/**
 * Sidebar with all the main schedule interactions
 */
const Export = () => {
  return (
    <Menu>
      <Menu.Trigger asChild>
        <Button variant="primary" square className="bg-primary hover:bg-primary/90">
          <ArrowDownTrayIcon className="h-5 w-5" />
        </Button>
      </Menu.Trigger>
      <Menu.Items className="p-1">
        <Menu.Item asChild>
          <CsvExport />
        </Menu.Item>
        <Menu.Item asChild>
          <NitSigExport />
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}

export default Export
