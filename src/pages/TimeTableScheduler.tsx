import { useState } from 'react'
import { Major } from '../@types'
import SelectionModal from '../components/planner/SelectionModal'
import classNames from 'classnames'

const majors: Major[] = [
  { name: 'Licenciatura em Engenharia Informática e Computação' },
  { name: 'Licenciatura em Engenharia Eletrotécnica e de Computadores' },
  { name: 'Licenciatura em Engenharia Civil' },
  { name: 'Licenciatura em Engenharia Mecânica' },
  { name: 'Mestrado em Engenharia Informática e Computação' },
  { name: 'Mestrado em Engenharia Eletrotécnica e de Computadores' },
  { name: 'Mestrado em Engenharia Civil' },
  { name: 'Mestrado em Engenharia Química' },
  { name: 'Mestrado em Engenharia Mecânica' },
  { name: 'Mestrado em Engenharia do Ambiente' },
  { name: 'Mestrado em Engenharia e Gestão Industrial' },
]

const TimeTableSchedulerPage = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedMajor, setSelectedMajor] = useState(majors[0])

  return (
    <div className={classNames('container mx-auto w-full px-6 md:px-0')}>
      <SelectionModal
        majors={majors}
        openHook={[isOpen, setIsOpen]}
        selectedMajorHook={[selectedMajor, setSelectedMajor]}
      />
    </div>
  )
}

export default TimeTableSchedulerPage
