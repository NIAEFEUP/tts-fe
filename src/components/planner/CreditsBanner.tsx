import Alert, { AlertType } from './Alert'
import { useState, useEffect, useMemo } from 'react'
import { CheckedCourse } from '../../@types'

type Props = {
  courses: CheckedCourse[]
}

const CreditsBanner = ({ courses }: Props) => {
  const [alertLevel, setAlertLevel] = useState<AlertType>(AlertType.info)
  const credits = useMemo(() => {
    return courses.reduce((credits, courseUnit) => credits + courseUnit.info.ects, 0)
  }, [courses])

  useEffect(() => {
    if (credits > 42) setAlertLevel(AlertType.error)
    else if (credits > 36) setAlertLevel(AlertType.warning)
    else setAlertLevel(AlertType.info)
  }, [credits])

  return (
    <Alert type={alertLevel}>
      {alertLevel === AlertType.info && (
        <>
          Total número de créditos selecionados: <strong>{credits} ECTS</strong>.
        </>
      )}
      {alertLevel === AlertType.warning && (
        <>
          Créditos selecionados: <strong>{credits} ECTS</strong>. O NIAEFEUP recomenda escolher{' '}
          <strong>36 ou menos</strong>.
        </>
      )}
      {alertLevel === AlertType.error && (
        <>
          Créditos selecionados: <strong>{credits} ECTS</strong>. O limite de créditos da U.Porto num semestre, por
          norma, é <strong>42 ECTS</strong>.
        </>
      )}
    </Alert>
  )
}

export default CreditsBanner
