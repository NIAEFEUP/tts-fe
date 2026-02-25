import { Dialog, DialogContent, DialogTitle } from '../../ui/dialog'
import Alert, { AlertType } from '../Alert'
import InspectLessonBox from './InspectLessonBox'
import { ClassInfo, CourseInfo, SlotInfo } from '../../../@types'

type Props = {
  courseInfo: CourseInfo
  classInfo: ClassInfo
  slotInfo: SlotInfo
  // conflictsInfo: Array<ConflictInfo>
  isOpenHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

const LessonPopover = ({
  courseInfo,
  classInfo,
  slotInfo,
  isOpenHook
}: Props) => {
  const [isOpen, setIsOpen] = isOpenHook

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <div className="fixed inset-0 bg-black/50 dark:bg-black/50" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center px-8 py-4 text-center">

          <DialogContent className="w-full max-w-xl transform space-y-4 overflow-hidden rounded-2xl 
                bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-dark"
          >
            <DialogTitle>
              <h3 className="mb-3 text-lg font-medium leading-none text-gray-700 dark:text-white">
                Inspeção de horário
              </h3>
              <Alert type={AlertType.success}>
                <p className="whitespace-nowrap">Aula sem conflitos.</p>
              </Alert>
            </DialogTitle>

            <div className="flex h-full w-full items-center justify-start gap-4">
              <InspectLessonBox courseInfo={courseInfo} classInfo={classInfo} slotInfo={slotInfo} />
            </div>
          </DialogContent>
        </div>
      </div>
    </Dialog>
  )
}
export default LessonPopover
