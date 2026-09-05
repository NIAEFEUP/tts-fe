import { useContext, useEffect, useMemo } from 'react'
import usePickedClasses from '../../../hooks/usePickedClasses'
import Schedule from '../Schedule'
import ConflictsContext from '../../../contexts/ConflictsContext'

const PlannerSchedule = () => {
  const classes = usePickedClasses()
  const slots = useMemo(() => classes.map((c) => c.classInfo.slots).flat(), [classes])
  const { setTClassConflicts } = useContext(ConflictsContext)

  // Disable T-class conflicts
  useEffect(() => {
    setTClassConflicts(false)
  }, [])

  return <Schedule classes={classes} slots={slots} />
}

export default PlannerSchedule
