import { NitSigIconSVG } from '../../../svgs'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../../../ui/tooltip'

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
            className="text-white-900 group flex w-full items-center gap-2 rounded-md p-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            disabled
          >
            <NitSigIconSVG className="black:brightness-150 h-4 w-4 rounded" />
            <span className=" dark:text-white">Exportar para o Sigarra</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Disponível em breve</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default NitSigExport
