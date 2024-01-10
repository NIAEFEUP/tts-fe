import { Button } from '../../../ui/button'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'

const PasteOption = () => {
  return (
    <Button variant="icon" className="h-min w-min bg-primary xl:p-1">
      <ClipboardDocumentIcon className="h-5 w-5" />
    </Button>
  )
}

export default PasteOption
