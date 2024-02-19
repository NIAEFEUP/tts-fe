import { NitSigIcon } from '../../../svgs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip'

type Props = {}

/**
 * Future feature that allows the user to export his schedule options to NitSig
 */
const NitSigExport = () => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => {}}
            className="group flex w-full items-center gap-2 rounded-md p-1 text-sm text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            disabled
          >
            <NitSigIcon className="h-4 w-4" />
            <span>Exportar para o Sigarra</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Disponível em breve</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default NitSigExport
