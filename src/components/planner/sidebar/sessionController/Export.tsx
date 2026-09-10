import { Button } from '../../../ui/new/button'
import { Menu } from '../../../ui/new/menu'
import PngExport from './PngExport'
import IcsExport from './IcsExport'
import CsvExport from './CsvExport'
import { Download } from 'lucide-react'

/**
 * Sidebar with all the main schedule interactions
 */
const Export = () => {
  return (
    <Menu>
      <Menu.Trigger asChild>
        <Button variant="primary" square className="bg-primary hover:bg-primary/90">
          <Download className="h-5 w-5" />
        </Button>
      </Menu.Trigger>
      <Menu.Items className="p-1">
        <Menu.Item asChild>
          <PngExport />
        </Menu.Item>
        <Menu.Item asChild>
          <IcsExport />
        </Menu.Item>
        <Menu.Item asChild>
          <CsvExport />
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}

export default Export
