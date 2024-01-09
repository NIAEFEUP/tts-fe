import { NitSig } from '../../../svgs'

type Props = {}

/**
 * Sidebar with all the main schedule interactions
 */
const NitSigExport = () => {
  return (
    <button
      onClick={() => {}}
      title="Exportar ficheiro com todas as opções nos 10 horários"
      className="group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      <NitSig />
    </button>
  )
}

export default NitSigExport
