import StorageAPI from '../../api/storage'
import { Fragment, useRef } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
  DotsHorizontalIcon,
  SparklesIcon,
  TableIcon,
  TrashIcon,
} from '@heroicons/react/outline'
import { CourseOption, MultipleOptions } from '../../@types'

type Props = {
  schedule: CourseOption[]
  showGridHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  multipleOptions: MultipleOptions
}

const MoreActionsButton = ({schedule, showGridHook, multipleOptions }: Props) => {
  const buttonRef = useRef(null)
  const [showGrid, setShowGrid] = showGridHook

  const exportCSV = () => {
    const header = ['Ano', 'Nome', 'Sigla']
    const lines = []
    const columns = []

    for (let i = 0; i < multipleOptions.options.length; i++) {
      if (i === 0) for (let j = 0; j < schedule.length; j++) header.push(`Option ${j}`)
      const scheduleOption = multipleOptions.options[i]
      const column = []
      for (let j = 0; j < scheduleOption.length; j++) column.push(scheduleOption[j].option?.class_name || '')
    }

    for (let i = 0; i < columns[0].length; i++) {
      const column = columns[i]
      const info = multipleOptions.options[0][i].course.info
      const line = [info.course_unit_year, info.name, info.acronym]

      for (let j = 0; j < column.length; j++) {
        line.push(column[j])
      }
      lines.push(line.join(','))
    }

    const csv = [header.join(','), lines.flat().join('\n')].join('\n')
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
        py-2 text-xs font-medium text-white transition hover:opacity-80 lg:text-sm xl:w-min xl:space-x-0 xl:px-3"
      >
        <span className="flex xl:hidden">Mais Opções</span>
        <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
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
            <Menu.Item>
              {({ active, disabled }) => (
                <button disabled
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
