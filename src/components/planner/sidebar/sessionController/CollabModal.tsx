import React, { useContext, useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import CollabPickSession from './CollabPickSession';
import CollabSessionModal from './CollabSessionModal';
import CollabSessionContext from '../../../../contexts/CollabSessionContext';
import { sessionsSocket } from '../../../../api/socket';
import { toast } from '../../../ui/use-toast';

const PICK_SESSION = 'PICK_SESSION';
const SESSION = 'SESSION';
const generateUniqueId = () => Date.now();

type Props = {
  isOpen: boolean,
  closeModal: () => void
}

const CollabModal = ({ isOpen, closeModal }: Props) => {
  const { sessions, setSessions, currentSessionId, setCurrentSessionId } = useContext(CollabSessionContext);
  const [currentView, setCurrentView] = useState(PICK_SESSION); //Defines in which modal we are
  const currentSession = sessions.find(s => s.id === currentSessionId) || null;

  useEffect(() => {
    if (isOpen) {
      if (currentSession !== null) {
        setCurrentView(SESSION);
      } else {
        setCurrentView(PICK_SESSION);
      }
    }
  }, [isOpen, currentSessionId]);

  const handleStartSession = (sessionId) => {
    setCurrentView(SESSION);
  };

  const handleCreateSession = () => { //Dummy function to create a session...
    sessionsSocket.connect();

    sessionsSocket.on('connected', data => {
      const newSession = {
        id: generateUniqueId(),
        name: Math.random().toString(36).substr(2, 9),
        lastEdited: new Date().toLocaleDateString(),
        lifeSpan: 30,
        currentUser: 'TheCreator',
        link: `https://collab.app/session/${data['room_id']}`,
        participants: ['TheCreator'],
      }

      setCurrentSessionId(newSession.id);
      setSessions(prevSessions => [...prevSessions, newSession]);
      setCurrentView(SESSION);

      toast({ title: 'Sessão criada', description: 'Convida mais amigos para se juntarem!'});
    });
  };

  const handleExitSession = () => {
    sessionsSocket.disconnect();
    toast({ title: 'Sessão abandonada', description: 'Podes voltar a ela mais tarde, ou iniciar/entrar noutra sessão.'});
    setCurrentView(PICK_SESSION);
  };

  const handleDeleteSession = (sessionId: number | null) => {
    setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
    if (currentSession?.id === sessionId) {
      handleExitSession();
    }
  };

  const handleUpdateUser = (updatedUser: string) => {
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        currentUser: updatedUser,
        participants: currentSession.participants.map(participant =>
          participant === currentSession.currentUser ? updatedUser : participant
        )
      };
      setSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === currentSession.id ? updatedSession : session
        )
      );
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={closeModal}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {currentView === PICK_SESSION && (
                  <CollabPickSession
                    sessions={sessions}
                    onStartSession={handleStartSession}
                    onCreateSession={handleCreateSession}
                    onDeleteSession={handleDeleteSession}
                  />
                )}

                {currentView === SESSION && currentSession && (
                  <CollabSessionModal
                    session={currentSession}
                    onExitSession={handleExitSession}
                    onUpdateUser={handleUpdateUser}
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CollabModal;
