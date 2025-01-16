import { useEffect, useState } from 'react';
import { Button } from '../../../ui/button';
import { UsersIcon } from '@heroicons/react/24/solid';
import CollabModal from './CollabModal';
import CollabSessionContext from '../../../../contexts/CollabSessionContext';
import { CollabSession } from '../../../../@types';
import useCollabSessions from '../../../../hooks/useCollabSessions';

const CollaborativeSession = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessions, setSessions] = useCollabSessions();
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
