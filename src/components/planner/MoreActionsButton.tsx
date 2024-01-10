import StorageAPI from '../../api/storage'
import { Fragment, useRef } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisHorizontalIcon, SparklesIcon, TableCellsIcon, TrashIcon } from '@heroicons/react/24/outline'
import { CourseOption, MultipleOptions } from '../../@types'

type Props = {
  schedule: CourseOption[]
  multipleOptions: MultipleOptions
}

const MoreActionsButton = ({ schedule, multipleOptions }: Props) => {
  const exportCSV = () => {
    const header = ['Ano', 'Nome', 'Sigla']
    const lines = []
    const columns = []

    for (let i = 0; i < multipleOptions.options.length; i++) {
      if (i === 0) for (let j = 0; j < schedule.length; j++) header.push(`Option ${j}`)
      const scheduleOption = multipleOptions.options[i]
      const column = []
      for (let j = 0; j < scheduleOption.length; j++) column.push(scheduleOption[j].option?.class_name || '')
      columns.push(column)
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

  return (
    <Menu as="div" className="relative inline-block w-full text-left xl:w-min">
      <Menu.Button
        title="Mais opções"
        className="flex items-center justify-center w-full h-auto px-2 py-2 space-x-2 text-xs font-medium text-white transition border-2 border-transparent rounded bg-primary hover:opacity-80 lg:text-sm xl:w-min xl:space-x-0 xl:px-3"
      >
        <span className="flex xl:hidden">Mais Opções</span>
        <EllipsisHorizontalIcon className="w-4 h-4" aria-hidden="true" />
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
        <Menu.Items className="absolute right-0 z-20 w-full px-1 py-1 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none xl:w-64">
          <div className="p-1">
            <Menu.Item>
              {({ active, disabled }) => (
                <button
                  onClick={() => exportCSV()}
                  title="Exportar ficheiro com todas as opções nos 10 horários"
                  className="flex items-center w-full gap-2 px-2 py-2 text-sm text-gray-900 rounded-md group hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <TableCellsIcon className="w-5 h-5 text-secondary group-hover:text-white" />
                  <span>Exportar Opções (CSV)</span>
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
