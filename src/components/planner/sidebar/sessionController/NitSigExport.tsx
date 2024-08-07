import { NitSigIconSVG } from "../../../svgs"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent  } from "../../../ui/tooltip"

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
            className="group flex w-full items-center gap-2 rounded-md p-1 text-sm text-white-900 disabled:cursor-not-allowed disabled:opacity-50"
            disabled
          >
            <NitSigIconSVG className="h-4 w-4 black:brightness-150 rounded" />
            <span className=" dark:text-white">Exportar para o Sigarra</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Disponível em breve</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default NitSigExport
