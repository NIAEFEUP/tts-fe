import CsvExport from './CsvExport'
import NitSigExport from './NitSigExport'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../ui/dropdown-menu'
import { Button } from '../../../ui/button'

import { CourseOption, MultipleOptions } from '../../../../@types'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

type Props = {
  schedule: CourseOption[]
  multipleOptions: MultipleOptions
}

/**
 * Sidebar with all the main schedule interactions
 */
const Export = ({ schedule, multipleOptions }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleHover = () => {
    setIsOpen(true);
  };

  const handleLeave = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      setIsOpen(false); // Cleanup: Close the menu when the component unmounts
    };
  }, []);

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={setIsOpen}
      >
      <DropdownMenuTrigger asChild>
        <Button variant="icon" className="bg-primary">
          <ArrowDownTrayIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent >
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
