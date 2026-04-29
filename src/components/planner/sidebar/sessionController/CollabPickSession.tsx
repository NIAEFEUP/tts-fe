import { PlayCircleIcon, UserGroupIcon } from '@heroicons/react/20/solid';
import { Button } from '../../../ui/button';
import { CollabSession } from '../../../../@types';
import toHumanReadableTimeDiff from '../../../../utils/human-time';
import { useState } from 'react';
import { Input } from '../../../ui/input';

type Props = {
  sessions: Array<CollabSession>,
  onStartSession: (arg: string | null) => void
  onCreateSession: () => void
  onDeleteSession: (arg: string | null) => void
}

const CollabPickSession = ({ sessions, onStartSession, onCreateSession, onDeleteSession }: Props) => {
  const [sessionCode, setSessionCode] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().trim();

    if (val && !/^[0-9A-Z]*$/.test(val)) {
      setError('Apenas números e letras são permitidos');
      return;
    }

    setError('');
    if (val.length <= 4) {
      setSessionCode(val);
    }
  };

  const handleJoinClick = () => {
    if (sessionCode.length === 4) {
      onStartSession(sessionCode);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleJoinClick();
    }
  }

  return(
    <div className="text-center">
    <UserGroupIcon className="h-40 w-40 mx-auto text-primary" />
    <h3 className="text-xl font-bold leading-6 text-primary">
      Colaboração ao vivo...
    </h3>

    <p className="mt-6 text-sm text-gray-600">
      <span className="font-bold block text-gray-800">
        Podes convidar amigos para as tuas opções para colaborar contigo.
      </span>
      Não te preocupes, todas as tuas opções continuam a guardar localmente no teu dispositivo.
    </p>

    <div className="flex justify-center mt-6 space-x-4 ">
      <Button
        variant="icon"
        className="flex items-center rounded-lg bg-primary py-6"
        onClick={onCreateSession}
      >
        <PlayCircleIcon className="h-8 w-8 mr-2 " />
        Iniciar nova sessão
      </Button>
    </div>

    <div className="mt-6 flex flex-col items-center justify-center space-y-2">
        <div className="flex w-full max-w-[250px] items-center space-x-2">
          <Input 
            type="text" 
            placeholder="Código" 
            value={sessionCode}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="uppercase text-center tracking-widest"
          />
          <Button 
            onClick={handleJoinClick}
            disabled={sessionCode.length < 4}
            className="whitespace-nowrap"
          >
            Entrar
          </Button>
        </div>
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
      </div>

    <div className="mt-6 text-center">
      <h4 className="text-md font-bold ">Sessões anteriores</h4>
      <p className="text-sm text-gray-600">
        As sessões têm um tempo de vida, pelo que se não quiseres perder as tuas opções, terás de guardar para o teu dispositivo localmente.
      </p>
      <ul className="mt-4 flex flex-col sm:grid sm:grid-cols-1 sm:gap-y-4">
        {sessions.map((session) => (
          <li key={session.id} className="sm:grid sm:grid-cols-7 flex flex-col sm:mt-0  mt-6 items-center text-sm text-gray-800 gap-4">
            <span className="col-span-2 truncate whitespace-nowrap font-bold">{session.name}</span>
            <span className="col-span-2 text-gray-600 truncate whitespace-nowrap">editado {toHumanReadableTimeDiff(session.lastEdited)}</span>
            <span className="col-span-2 text-gray-600 truncate whitespace-nowrap">expira {toHumanReadableTimeDiff(session.expirationTime)}</span>
            <div className="col-span-1 flex justify-end space-x-4">
              <a
                href="#"
                className="text-primary hover:underline"
                onClick={() => onStartSession(session.id)}
              >
                Entrar
              </a>
              <button
                className="text-primary hover:text-red-800"
                onClick={() => onDeleteSession(session.id)}
              >
                &times;
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
  )
  
};

export default CollabPickSession;
