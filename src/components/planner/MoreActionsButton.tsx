import StorageAPI from '../../api/storage'
import HelpModal from './HelpModal'
import { Fragment, useRef } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
  DotsHorizontalIcon,
  DownloadIcon,
  SparklesIcon,
  TableIcon,
  TrashIcon,
  UploadIcon,
} from '@heroicons/react/outline'
import { CourseOption, MultipleOptions } from '../../@types'

type Props = {
  schedule: CourseOption[]
  showGridHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
}

const MoreActionsButton = ({ schedule, showGridHook, multipleOptionsHook }: Props) => {
  const buttonRef = useRef(null)
  const [showGrid, setShowGrid] = showGridHook
  const [multipleOptions, setMultipleOptions] = multipleOptionsHook

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
      if (isScheduleValid(scheduleJson)) {
        setMultipleOptions((prev) => ({
          index: prev.index,
          selected: scheduleJson,
          options: prev.options.map((item, index) => (prev.index === index ? scheduleJson : item)),
        }))
      }
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

  const exportCSV = () => {
    const header = ['Index']
    const lines = []

    for (let i = 0; i < multipleOptions.options.length; i++) {
      if (i === 0) for (let j = 0; j < schedule.length; j++) header.push(schedule[j].course.info.acronym)
      const line = [`${i}`]
      const scheduleOption = multipleOptions.options[i]
      for (let j = 0; j < scheduleOption.length; j++) line.push(scheduleOption[j].option?.class_name || '')
      lines.push(line.join(';'))
    }

    const csv = [header.join(';'), lines.flat().join('\n')].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'schedule.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearOptions = () => {
    if (window.confirm('Quer mesmo apagar as opções guardadas?')) {
      StorageAPI.deleteOptionsStorage()
      window.location.reload()
    }
  }

  return (
    <Menu as="div" className="relative inline-block w-full text-left xl:w-min">
      <Menu.Button
        ref={buttonRef}
        title="Mais opções"
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
          px-1 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none xl:w-64"
        >
          <div className="p-1">
            <Menu.Item>
              {({ active, disabled }) => (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setShowGrid(!showGrid)}
                  title={showGrid ? 'Ocultar grelha da tabela' : 'Mostrar grelha da tabela'}
                  className="group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-900
                  hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <SparklesIcon className="h-5 w-5 text-secondary group-hover:text-white" />
                  <span>{showGrid ? 'Ocultar' : 'Mostrar'} grelha</span>
                </button>
              )}
            </Menu.Item>
          </div>

          <div className="p-1">
            {/* <Menu.Item> is not used here since it prevents input from being triggered */}
            <label
              htmlFor="schedule-upload"
              title="Importar horário individual JSON (previamente exportado pela platforma)"
              className="group flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm
            text-gray-900 hover:bg-secondary hover:text-white"
            >
              <UploadIcon className="h-5 w-5 text-secondary group-hover:text-white" />
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
                  title="Exportar horário individual JSON (pode ser importado futuramente)"
                  className="group flex w-full items-center gap-2 rounded-md px-2 py-2 
                  text-sm text-gray-900 hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <DownloadIcon className="h-5 w-5 text-secondary group-hover:text-white" />
                  <span>Exportar Horário</span>
                </button>
              )}
            </Menu.Item>
          </div>

          <div className="p-1">
            <Menu.Item>
              {({ active, disabled }) => (
                <button
                  onClick={() => exportCSV()}
                  title="Exportar ficheiro com todas as opções nos 10 horários"
                  className="group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-900
                hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <TableIcon className="h-5 w-5 text-secondary group-hover:text-white" />
                  <span>Exportar Opções (CSV)</span>
                </button>
              )}
            </Menu.Item>
          </div>

          <div className="p-1">
            <Menu.Item>
              <HelpModal />
            </Menu.Item>

            <Menu.Item>
              {({ active, disabled }) => (
                <button
                  disabled={
                    multipleOptions.options
                      .map((co: CourseOption[]) => co.filter((item) => item.option !== null))
                      .flat().length === 0
                  }
                  onClick={clearOptions}
                  title="Limpar memória de opções de horário"
                  className="group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-900
                hover:bg-rose-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <TrashIcon className="h-5 w-5 text-rose-800 group-hover:text-white" />
                  <span className="truncate">Apagar Opções Guardadas</span>
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default MoreActionsButton
