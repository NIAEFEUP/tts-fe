import { Button } from '../../../ui/button'
import { BoltIcon } from '@heroicons/react/24/outline'

const RandomFill = () => {
  return (
    <Button variant="icon" className="h-min w-min bg-secondary xl:p-1">
      <BoltIcon className="h-5 w-5" />
    </Button>
  )
}

export default RandomFill
