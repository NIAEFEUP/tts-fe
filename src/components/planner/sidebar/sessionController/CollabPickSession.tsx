import { PlayCircleIcon, UserGroupIcon } from '@heroicons/react/20/solid'
import { Button } from '../../../ui/button'
import { CollabSession } from '../../../../@types'
import toHumanReadableTimeDiff from '../../../../utils/human-time'

type Props = {
  sessions: Array<CollabSession>
  onStartSession: (arg: string | null) => void
  onCreateSession: () => void
  onDeleteSession: (arg: string | null) => void
}

const CollabPickSession = ({ sessions, onStartSession, onCreateSession, onDeleteSession }: Props) => (
  <div className="text-center">
    <UserGroupIcon className="text-primary mx-auto h-40 w-40" />
    <h3 className="text-primary text-xl font-bold leading-6">Colaboração ao vivo...</h3>

    <p className="mt-6 text-sm text-gray-600">
      <span className="block font-bold text-gray-800">
        Podes convidar amigos para as tuas opções para colaborar contigo.
      </span>
      Não te preocupes, todas as tuas opções continuam a guardar localmente no teu dispositivo.
    </p>

    <div className="mt-6 flex justify-center space-x-4 ">
      <Button variant="icon" className="bg-primary flex items-center rounded-lg py-6" onClick={onCreateSession}>
        <PlayCircleIcon className="mr-2 h-8 w-8 " />
        Iniciar nova sessão
      </Button>
    </div>

    <div className="mt-6 text-center">
      <h4 className="text-md font-bold ">Sessões anteriores</h4>
      <p className="text-sm text-gray-600">
        As sessões têm um tempo de vida, pelo que se não quiseres perder as tuas opções, terás de guardar para o teu
        dispositivo localmente.
      </p>
      <ul className="mt-4 flex flex-col sm:grid sm:grid-cols-1 sm:gap-y-4">
        {sessions.map((session) => (
          <li
            key={session.id}
            className="mt-6 flex flex-col items-center gap-4  text-sm text-gray-800 sm:mt-0 sm:grid sm:grid-cols-7"
          >
            <span className="col-span-2 truncate whitespace-nowrap font-bold">{session.name}</span>
            <span className="col-span-2 truncate whitespace-nowrap text-gray-600">
              editado {toHumanReadableTimeDiff(session.lastEdited)}
            </span>
            <span className="col-span-2 truncate whitespace-nowrap text-gray-600">
              expira {toHumanReadableTimeDiff(session.expirationTime)}
            </span>
            <div className="col-span-1 flex justify-end space-x-4">
              <a href="#" className="text-primary hover:underline" onClick={() => onStartSession(session.id)}>
                Entrar
              </a>
              <button className="text-primary hover:text-red-800" onClick={() => onDeleteSession(session.id)}>
                &times;
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
)

export default CollabPickSession
