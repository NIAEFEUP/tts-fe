import { NitSigIconSVG } from '../../../svgs'
import { Tooltip, TooltipTrigger, TooltipContent } from '../../../ui/new/tooltip'

/**
 * Future feature that allows the user to export his schedule options to NitSig
 */
const NitSigExport = () => {
  return (
    <Tooltip delayIn={300}>
      <TooltipTrigger asChild>
        <button
          onClick={() => {}}
          className="group flex w-full items-center gap-2 rounded-md p-1 text-sm text-white-900 disabled:cursor-not-allowed disabled:opacity-50"
          disabled
        >
          <NitSigIconSVG className="h-4 w-4 black:brightness-150 rounded-sm" />
          <span className=" dark:text-white">Exportar para o Sigarra</span>
        </button>
      </TooltipTrigger>
      <TooltipContent className="z-100">Disponível em breve</TooltipContent>
    </Tooltip>
  )
}

export default NitSigExport
