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

  const participants = sessions.find((session) => session.id === currentSessionId)?.participants.length;

  return (
    <CollabSessionContext.Provider value={{ sessions, setSessions, currentSessionId, setCurrentSessionId }}>
      <div>
        <Button variant="icon" className={`${!currentSessionId ? "bg-primary" : "bg-green-600"} relative`} onClick={openModal}>
          <UsersIcon className="h-5 w-5" />
          {currentSessionId && participants > 0 && (
            <span className="absolute bottom-0.5 right-0.5 bg-primary text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {participants}
            </span>
          )}
        </Button>

        <CollabModal isOpen={isModalOpen} closeModal={closeModal} />
      </div>
    </CollabSessionContext.Provider>
  );
};

export default CollaborativeSession;
