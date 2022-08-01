import { Fragment, useRef } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { DotsHorizontalIcon, DownloadIcon, SparklesIcon, TableIcon, UploadIcon } from '@heroicons/react/outline'
import { CourseOption } from '../../@types'

type Props = {
  schedule: CourseOption[]
  showGridHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  courseOptionsHook: [CourseOption[], React.Dispatch<React.SetStateAction<CourseOption[]>>]
}

const MoreActionsButton = ({ schedule, showGridHook, courseOptionsHook }: Props) => {
  const buttonRef = useRef(null)
  const [showGrid, setShowGrid] = showGridHook
  const [, setCourseOptions] = courseOptionsHook

  const isScheduleValid = (scheduleJson: any) => {
    // TODO: implement this
    // TODO: make sure setCourseOptions works properly
    return true
  }

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader()
    fileReader.readAsText(e.target.files[0], 'UTF-8')
    fileReader.onload = (e) => {
      const scheduleJson = JSON.parse(fileReader.result as string) as CourseOption[]
      if (isScheduleValid(scheduleJson)) setCourseOptions(scheduleJson)
      buttonRef.current.click() // close menu
    }
  }

  const exportJSON = () => {
    const data = JSON.stringify(schedule)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'schedule.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {}

  return (
    <Menu as="div" className="relative inline-block w-full text-left xl:w-min">
      <Menu.Button
        ref={buttonRef}
        className="flex h-auto w-full items-center justify-center space-x-2 rounded border-2 border-transparent bg-primary px-2 
        py-3 text-xs font-medium text-white transition hover:opacity-80 lg:text-sm xl:w-min xl:space-x-0 xl:px-4"
      >
        <span className="flex xl:hidden">Mais Opções</span>
        <DotsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute right-0 z-20 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white 
          px-1 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none xl:w-56"
        >
          <Menu.Item>
            {({ active, disabled }) => (
              <button
                type="button"
                disabled={disabled}
                onClick={() => setShowGrid(!showGrid)}
                className="group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-900
                  hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <SparklesIcon className="h-5 w-5 text-primary group-hover:text-white" />
                <span>{showGrid ? 'Esconder' : 'Mostrar'} grelha</span>
              </button>
            )}
          </Menu.Item>

          {/* <Menu.Item> is not used here since it prevents input from being triggered */}
          <label
            htmlFor="schedule-upload"
            className="group flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm
            text-gray-900 hover:bg-primary hover:text-white"
          >
            <UploadIcon className="h-5 w-5 text-primary group-hover:text-white" />
            <span>Importar Horário</span>
            <input
              type="file"
              accept=".json"
              className="sr-only"
              id="schedule-upload"
              name="schedule-upload"
              onChange={(e) => importJSON(e)}
            />
          </label>

          <Menu.Item>
            {({ active, disabled }) => (
              <button
                disabled={disabled}
                onClick={() => exportJSON()}
                className="group flex w-full items-center gap-2 rounded-md px-2 py-2 
                text-sm text-gray-900 hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <DownloadIcon className="h-5 w-5 text-primary group-hover:text-white" />
                <span>Exportar Horário</span>
              </button>
            )}
          </Menu.Item>

          <Menu.Item disabled>
            {({ active, disabled }) => (
              <button
                disabled={disabled}
                onClick={() => exportCSV()}
                className="group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-900
                hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <TableIcon className="h-5 w-5 text-primary group-hover:text-white" />
                <span>Exportar Opções (CSV)</span>
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default MoreActionsButton
