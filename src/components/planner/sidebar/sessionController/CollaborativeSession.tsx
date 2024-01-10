import { UsersIcon } from '@heroicons/react/24/outline'

/**
 * Start
 */
const CollaborativeSession = () => {
  return (
    <button
      onClick={() => {}}
      title="Iniciar sessão colaborativa"
      className="flex h-auto w-full items-center justify-center space-x-2 rounded border-2 border-transparent 
      bg-primary px-2 py-2 text-xs font-medium text-white transition hover:opacity-80 lg:text-sm xl:w-min 
      xl:space-x-0 xl:px-3"
    >
      <UsersIcon className="h-4 w-4" />
    </button>
  )
}

export default CollaborativeSession
