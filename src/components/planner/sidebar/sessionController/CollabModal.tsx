import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import CollabPickSession from './CollabPickSession';
import CollabSession from './CollabSession';
import CollabCreateSession from './CollabCreateSession'; // Assuming you have this component

const dummySessions = [
  { id: 1, name: 'asdipuhaosd', edited: 'há 3 dias', expires: 'em 1 semana', username: 'Ancient Mongoose', sessionLink: 'https://ni.fe.up.pt/tts/#room=d8750cf5...' },
  { id: 2, name: 'uyavfiuya8gf3', edited: 'há 1 semana', expires: 'em 14 dias', username: 'msantos', sessionLink: 'https://ni.fe.up.pt/tts/#room=d8750cf5...' },
];

const PICK_SESSION = 'PICK_SESSION';
const CREATE_SESSION = 'CREATE_SESSION';
const SESSION = 'SESSION';
const CollabModal = ({ isOpen, closeModal }) => {
  const [currentView, setCurrentView] = useState(PICK_SESSION);
  const [currentSession, setCurrentSession] = useState(null);
  const [sessions, setSessions] = useState(dummySessions);

  const handleStartSession = (session) => {
    setCurrentSession(session);
    setCurrentView(SESSION);
  };

  const handleExitSession = () => {
    setCurrentSession(null);
    setCurrentView(PICK_SESSION);
  };

  const handleCreateSession = () => {
    setCurrentView(CREATE_SESSION);
  };

  const handleReturnToPickSession = () => {
    setCurrentView(PICK_SESSION);
  };

  const handleDeleteSession = (sessionId) => {
    setSessions((prevSessions) => prevSessions.filter(session => session.id !== sessionId));
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-2" onClose={closeModal}>
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
