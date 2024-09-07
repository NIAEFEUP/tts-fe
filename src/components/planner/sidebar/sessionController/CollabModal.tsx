import React, { useContext, useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import CollabPickSession from './CollabPickSession';
import CollabSession from './CollabSession';
import CollabSessionContext from '../../../../contexts/CollabSessionContext';

const PICK_SESSION = 'PICK_SESSION';
const SESSION = 'SESSION';
const generateUniqueId = () => Date.now();
const CollabModal = ({ isOpen, closeModal }) => {
  const { sessions, setSessions, currentSessionIndex, setCurrentSessionIndex } = useContext(CollabSessionContext);
  const [currentView, setCurrentView] = useState(PICK_SESSION);

  useEffect(() => {
    if (isOpen) {
      if (currentSessionIndex !== null && sessions.find(s => s.id === currentSessionIndex)) {
        setCurrentView(SESSION);
      } else {
        setCurrentView(PICK_SESSION);
      }
    }
  }, [isOpen, currentSessionIndex, sessions]);

  const currentSession = sessions.find(s => s.id === currentSessionIndex) || null;

  const handleStartSession = (sessionId) => {
    setCurrentSessionIndex(sessionId);
    setCurrentView(SESSION);
  };

  const handleCreateSession = () => {
    const newSession = {
      id: generateUniqueId(),
      name: Math.random().toString(36).substr(2, 9),
      lastEdited: new Date().toLocaleDateString(),
      lifeSpan: 30,
      currentUser: 'TheCreator',
      link: `https://collab.app/session/${Date.now().toString()}`,
      participants: ['T'],
    };
    console.log('CollabModal -> newSession', newSession);
    setSessions(prevSessions => [...prevSessions, newSession]);
    setCurrentSessionIndex(newSession.id);
    setCurrentView(SESSION);
  };

  const handleExitSession = () => {
    setCurrentSessionIndex(null);
    setCurrentView(PICK_SESSION);
  };

  const handleDeleteSession = (sessionId) => {
    setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
    if (currentSession?.id === sessionId) {
      handleExitSession();
    }
  };

  const handleUpdateUser = (updatedUser) => {
    if (currentSession) {
      const updatedSession = { ...currentSession, currentUser: updatedUser };
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
                  <CollabSession
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
