import React, { useContext, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import CollabPickSession from './CollabPickSession';
import CollabSession from './CollabSession';
import CollabCreateSession from './CollabCreateSession';
import CollabSessionContext from '../../../../contexts/CollabSessionContext';

const PICK_SESSION = 'PICK_SESSION';
const CREATE_SESSION = 'CREATE_SESSION';
const SESSION = 'SESSION';

const CollabModal = ({ isOpen, closeModal }) => {
  const { sessions, setSessions, currentSession, setCurrentSession } = useContext(CollabSessionContext);
  const [currentView, setCurrentView] = useState(PICK_SESSION);

  const handleStartSession = (session) => {
    setCurrentSession(session);
    setCurrentView(SESSION);
  };

  const handleCreateSession = () => {
    //how am I supposed to create a new session? is this even frontend or backend? create here and then store elsewhere idk xd
    const newSession= {
      id: Date.now().toString(),
      name: Math.random().toString(36).substr(2, 9),
      lastEdited: new Date().toLocaleDateString(),
      lifeSpan: 30,
      currentUser: 'TheCreater',
      link: `https://collab.app/session/${Date.now().toString()}`,
      participants: ['T'],
    };
    setSessions([...sessions, newSession]);
    setCurrentSession(newSession);
    setCurrentView(SESSION);
  };

  const handleExitSession = () => {
    setCurrentSession(null);
    setCurrentView(PICK_SESSION);
  };

  const handleDeleteSession = (sessionId) => {
    setSessions((prevSessions) => prevSessions.filter(session => session.id !== sessionId));
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
                    onStartSession={handleStartSession}  // For entering an existing session
                    onCreateSession={handleCreateSession}  // For creating a new session
                    onDeleteSession={handleDeleteSession}
                  />
                )}

                {currentView === CREATE_SESSION && (
                  <CollabCreateSession />
                )}

                {currentView === SESSION && (
                  <CollabSession
                    session={currentSession}
                    onExitSession={handleExitSession}
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
