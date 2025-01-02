import { useState } from 'react';
import { Button } from '../../../ui/button';
import { UsersIcon } from '@heroicons/react/24/solid';
import CollabModal from './CollabModal';
import CollabSessionContext from '../../../../contexts/CollabSessionContext';
import { CollabSession } from '../../../../@types';


// dummySessions are just dummy default sessions to help visualize them until we actually have sessions where participants can join and stuff...
const dummySessions: CollabSession[] = [
  {
    id: '1',
    name: 'asdipuhaosd',
    lastEdited: 'há 3 dias',
    currentUser: 'Jota Mongoose',
    link: 'https://ni.fe.up.pt/tts/#room=d8750cf5...',
    lifeSpan: 7,
    participants: ['Jota Mongoose','Duarte', 'Olivia', 'Ricardo', 'Miguel', 'João', 'Mariana', 'Ana']
  },
  {
    id: '2',
    name: 'uyavfiuya8gf3',
    lastEdited: 'há 1 semana',
    currentUser: 'msantos',
    link: 'https://ni.fe.up.pt/tts/#room=d8750cf5...',
    lifeSpan: 14,
    participants: [ 'msantos','Fabio', 'Luisa']
  },
];

const CollaborativeSession = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessions, setSessions] = useState(dummySessions);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

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
