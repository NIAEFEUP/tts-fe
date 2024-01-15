import { useCallback } from 'react'
import { Button } from '../../ui/button'
import { CameraIcon } from '@heroicons/react/24/outline'
import { toPng } from 'html-to-image'

const PrintSchedule = ({ component }) => {
  const takeScreenshot = useCallback(() => {
    if (component.current === null) {
      return
    }

    toPng(component.current, { cacheBust: true, backgroundColor: 'white' })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'horario.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [component])

  return (
    <Button variant="icon" className="bg-lightish text-black" onClick={takeScreenshot} title="Guardar foto">
      <CameraIcon className="h-5 w-5" />
    </Button>
  )
}

export default PrintSchedule
