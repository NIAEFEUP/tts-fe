import { NitSigIcon } from '../../../svgs'

type Props = {}

/**
 * Future feature that allows the user to export his schedule options to NitSig
 */
const NitSigExport = () => {
  return (
    <button
      onClick={() => {}}
      title="Disponível em breve"
      className="flex items-center w-full gap-2 p-1 text-sm text-gray-900 rounded-md group disabled:cursor-not-allowed disabled:opacity-50"
    >
      <NitSigIcon className="w-4 h-4" />
      <span>Exportar para o NitSig</span>
    </button>
  )
}

export default NitSigExport
