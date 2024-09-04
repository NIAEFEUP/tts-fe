import React, { useState } from 'react';
import { Button } from '../../../ui/button';
import { UsersIcon } from '@heroicons/react/24/solid';
import CollabModal from './CollabModal';
import CollabSessionContext from '../../../../contexts/CollabSessionContext';
import { CollabSession } from '../../../../@types';

const dummySessions: CollabSession[] = [
  { 
    id: '1', 
    name: 'asdipuhaosd', 
    lastEdited: 'há 3 dias', 
    currentUser: 'Jota Mongoose', 
    link: 'https://ni.fe.up.pt/tts/#room=d8750cf5...', 
    lifeSpan: 7,
    participants: ['Duarte', 'Olivia']  
  },
  { 
    id: '2', 
    name: 'uyavfiuya8gf3', 
    lastEdited: 'há 1 semana', 
    currentUser: 'msantos', 
    link: 'https://ni.fe.up.pt/tts/#room=d8750cf5...', 
    lifeSpan: 14,
    participants: ['Fabio', 'Luisa']
  },
];


const Collab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessions, setSessions] = useState(dummySessions);
  const [currentSession, setCurrentSession] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <CollabSessionContext.Provider value={{ sessions, setSessions, currentSession, setCurrentSession }}>
      <div>
        <Button variant="icon" className="bg-primary" onClick={openModal}>
          <UsersIcon className="h-5 w-5" />
        </Button>

        <CollabModal isOpen={isModalOpen} closeModal={closeModal} />
      </div>
    </CollabSessionContext.Provider>
  );
};

export default Collab;
