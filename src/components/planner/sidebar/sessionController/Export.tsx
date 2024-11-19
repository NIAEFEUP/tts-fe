import { Button } from '../../../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../ui/dropdown-menu'
import CsvExport from './CsvExport'
import NitSigExport from './NitSigExport'
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'
import CsvImport from './CsvImport'
import React, { useRef } from 'react'
import { csvDecode } from './IOUtils'

/**
 * Sidebar with all the main schedule interactions
 */
const Export = () => {

  const fileInputRef = useRef(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (!file) {
      // TODO - handle error
      return;
    }

    try {
      const content = csvDecode(await file.text());
      // TODO - convert year/name/acronym to picked courses
      // TODO - convert options to multiple options
      console.log(content)
    } catch (error) {
      console.error("Error reading or parsing CSV file:", error);
      alert("Failed to import CSV. Please check the file format.");
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const inputComponent = (
    <input
      type="file"
      accept=".csv"
      ref={fileInputRef}
      className="hidden"
      onChange={async (e) => {
        await handleFileChange(e)
      }}
    />
  )

  const menuItems = [
    {component: <CsvExport/>},
    {component: <CsvImport handleClick={handleClick}/>},
    {component: <NitSigExport/>}
  ]


  return (
    <>
      {inputComponent}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="icon" className="bg-primary">
            <ArrowDownTrayIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {menuItems.map((item, index) => (
            <DropdownMenuItem key={index}>
              {item.component}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default Export
