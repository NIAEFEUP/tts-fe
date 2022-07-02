import { DownloadIcon } from '@heroicons/react/outline'
import { CourseOptions } from '../../@types'

type Props = {
  schedule: CourseOptions
}

const ExportSchedule = ({ schedule }: Props) => {
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

  return (
    <button
      onClick={() => exportJSON()}
      className="flex h-auto w-full items-center justify-center space-x-2 rounded border-2 border-transparent bg-primary px-2 
      py-3 text-xs font-medium text-white transition hover:opacity-80 xl:w-min xl:space-x-0 xl:px-4 xl:text-sm"
    >
      <span className="flex xl:hidden">Exportar</span>
      <DownloadIcon className="h-5 w-5" />
    </button>
  )
}

export default ExportSchedule
