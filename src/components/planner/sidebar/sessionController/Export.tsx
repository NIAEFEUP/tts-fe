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
import { CourseOption, MultipleOptions } from '../../../../@types'

type Props = {
  showGridHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  schedule: CourseOption[]
  multipleOptions: MultipleOptions
}

/**
 * Sidebar with all the main schedule interactions
 */
const Export = ({ showGridHook, schedule, multipleOptions }: Props) => {
  const [showGrid, setShowGrid] = showGridHook

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
          />
        </svg>
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

  //   return (
  // <Menu as="div" className="relative inline-block w-full text-left xl:w-min">
  //   <Menu.Button
  //     title="Mais opções"
  //     className="flex h-auto w-full items-center justify-center space-x-2 rounded border-2 border-transparent bg-primary px-2 py-2 text-xs font-medium text-white transition hover:opacity-80 lg:text-sm xl:w-min xl:space-x-0 xl:px-3"
  //   >
  //     <span className="flex xl:hidden">Mais Opções</span>
  //     <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
  //   </Menu.Button>

  //   <Transition
  //     as={Fragment}
  //     enter="transition ease-out duration-100"
  //     enterFrom="transform opacity-0 scale-95"
  //     enterTo="transform opacity-100 scale-100"
  //     leave="transition ease-in duration-75"
  //     leaveFrom="transform opacity-100 scale-100"
  //     leaveTo="transform opacity-0 scale-95"
  //   >
  //     <Menu.Items className="absolute right-0 z-20 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white px-1 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none xl:w-64">
  //       <div className="p-1">
  //         <Menu.Item>
  //           {({ active, disabled }) => (
  //             <button
  //               type="button"
  //               disabled={disabled}
  //               onClick={() => setShowGrid(!showGrid)}
  //               title={showGrid ? 'Ocultar grelha da tabela' : 'Mostrar grelha da tabela'}
  //               className="group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
  //             >
  //               <SparklesIcon className="h-5 w-5 text-secondary group-hover:text-white" />
  //               <span>{showGrid ? 'Ocultar' : 'Mostrar'} grelha</span>
  //             </button>
  //           )}
  //         </Menu.Item>
  //       </div>

  //       <div className="p-1">
  //         <Menu.Item>
  //           {({ active, disabled }) => (
  //             <button
  //               onClick={() => exportCSV()}
  //               title="Exportar ficheiro com todas as opções nos 10 horários"
  //               className="group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
  //             >
  //               <TableIcon className="h-5 w-5 text-secondary group-hover:text-white" />
  //               <span>Exportar Opções (CSV)</span>
  //             </button>
  //           )}
  //         </Menu.Item>
  //       </div>
  //     </Menu.Items>
  //   </Transition>
  // </Menu>
  //   )
}

export default Export
