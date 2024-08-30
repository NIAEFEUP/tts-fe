import { PlayCircleIcon, UserGroupIcon } from '@heroicons/react/20/solid';
import { Button } from '../../../ui/button';

const CollabPickSession = ({ sessions, onStartSession }) => (
  <div className="text-center">
    <UserGroupIcon className="h-40 w-40 mx-auto text-primary" />
    <h3 className=" text-xl font-bold leading-6 text-primary">
      Colaboração ao vivo...
    </h3>

    <p className="mt-6 text-sm text-gray-600">
      <span className="font-bold block">Podes convidar amigos para as tuas opções para colaborar contigo.</span> 
      Não te preocupes, todas as tuas opções continuam a guardar localmente no teu dispositivo.
    </p>

    <div className="flex justify-center mt-6">
      <Button
        variant="icon"
        className="flex items-center bg-primary"
        onClick={() => onStartSession(sessions[0])} 
      >
        <PlayCircleIcon className="h-8 w-8 mr-2" />
        Iniciar sessão
      </Button>
    </div>

    <div className="mt-6 text-center">
      <h4 className="text-md font-medium text-gray-900">Sessões anteriores</h4>
      <p className="text-sm text-gray-600">
        As sessões têm um tempo de vida, pelo que se não quiseres perder as tuas opções, terás de guardar para o teu dispositivo localmente.
      </p>
      <ul className="mt-4 grid grid-cols-1 gap-y-4">
        {sessions.map(session => (
          <li key={session.id} className="grid grid-cols-7 items-center text-sm text-gray-800 gap-4">
            <span className="col-span-2 truncate whitespace-nowrap">{session.name}</span>
            <span className="col-span-2 text-gray-600 truncate whitespace-nowrap">editado {session.edited}</span>
            <span className="col-span-2 text-gray-600 truncate whitespace-nowrap">expira {session.expires}</span>
            <div className="col-span-1 flex justify-end space-x-4">
              <a href="#" className="text-primary hover:underline" onClick={() => onStartSession(session)}>Entrar</a>
              <button className="text-primary hover:text-red-800">&times;</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default CollabPickSession;
