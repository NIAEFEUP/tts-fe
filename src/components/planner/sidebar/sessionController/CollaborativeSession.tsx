import { useEffect, useState } from 'react';
import { Button } from '../../../ui/button';
import { UsersIcon } from '@heroicons/react/24/solid';
import CollabModal from './CollabModal';
import CollabSessionContext from '../../../../contexts/CollabSessionContext';
import { CollabSession, Participant } from '../../../../@types';

const toParticipant = (name: string): Participant => ({ client_id: crypto.randomUUID(), name: name });

// dummySessions are just dummy default sessions to help visualize them until we actually have sessions where participants can join and stuff...
const dummyParticipants = [
  ['Jota Mongoose','Duarte', 'Olivia', 'Ricardo', 'Miguel', 'João', 'Mariana', 'Ana'].map(toParticipant),
  ['msantos','Fabio', 'Luisa'].map(toParticipant),
]

const dummySessions: CollabSession[] = [
  {
    id: '1',
    name: 'asdipuhaosd',
    lastEdited: 'há 3 dias',
    link: 'https://ni.fe.up.pt/tts/#room=d8750cf5...',
    expirationTime: Date.now() + 1000 * 60 * 60 * 24 * 14,
    participants: dummyParticipants[0],
  },
  {
    id: '2',
    name: 'uyavfiuya8gf3',
    lastEdited: 'há 1 semana',
    link: 'https://ni.fe.up.pt/tts/#room=d8750cf5...',
    expirationTime: Date.now() + 1000 * 60 * 60 * 24 * 7,
    participants: dummyParticipants[1],
  },
];

const CollaborativeSession = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessions, setSessions] = useState(dummySessions);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // TODO: Move this to sessions hook
  const sessionIsNotExpired = (session: CollabSession) => {
    return session.expirationTime > Date.now();
  };

  useEffect(() => {
    setSessions(sessions.filter(sessionIsNotExpired));
  }, []);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <CollabSessionContext.Provider value={{ sessions, setSessions, currentSessionId, setCurrentSessionId }}>
      <div>
        <Button variant="icon" className={!currentSessionId ? "bg-primary" : "bg-green-600"} onClick={openModal}>
          <UsersIcon className="h-5 w-5" />
        </Button>

        <CollabModal isOpen={isModalOpen} closeModal={closeModal} />
      </div>
    </CollabSessionContext.Provider>
  );
};

export default CollaborativeSession;
