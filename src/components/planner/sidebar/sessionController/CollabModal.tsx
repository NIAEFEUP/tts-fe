import React, { useContext, useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import CollabPickSession from './CollabPickSession';
import CollabSessionModal from './CollabSessionModal';
import CollabSessionContext from '../../../../contexts/CollabSessionContext';
import { sessionsSocket } from '../../../../api/socket';
import { toast } from '../../../ui/use-toast';
import { useSearchParams } from 'react-router-dom';

const generateUniqueId = () => Date.now();

type Props = {
  isOpen: boolean,
  closeModal: () => void
}

const CollabModal = ({ isOpen, closeModal }: Props) => {
  const { sessions, setSessions, currentSessionId, setCurrentSessionId } = useContext(CollabSessionContext);
  const currentSession = sessions.find(s => s.id === currentSessionId) || null;
  const [searchParams, ] = useSearchParams();

  useEffect(() => {
    if (searchParams.has('session')) {
      const sessionId = searchParams.get('session')!;
      handleStartSession(sessionId);
    }
  }, []);

  // TODO: Remove this
  const [interval, setInt] = useState<number | null>(null);
  const [uid, ] = useState(generateUniqueId());
  useEffect(() => {
    if (!currentSessionId) {
      if (interval)
        clearInterval(interval!);
      setInt(null);
      return;
    }

    sessionsSocket.on('ping', data => {
      // eslint-disable-next-line no-console
      console.log('Received ping', data['id']);
    });

    setInt(setInterval(() => {
      sessionsSocket.emit('ping', { id: uid });
      // eslint-disable-next-line no-console
      console.log('Sent ping', uid);
    }, 1000));
  }, [currentSessionId]);


  const updatedSession = (sessionId: string, sessionInfo: any) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId ? { ...session, participants: sessionInfo['participants'] } : session
      )
    );
  }

  const handleUnexpectedDisconnect = () => {
    setCurrentSessionId(null);
    toast({ title: 'Foste desconectado inesperadamente', description: 'Por favor, tenta novamente mais tarde.' });
  };

  const addSocketListeners = socket => {
    socket.on('disconnect', handleUnexpectedDisconnect);
    socket.on('update_session_info', (data) => updatedSession(data['session_id'], data['session_info']));
  };

  
  const handleStartSession = (sessionId) => {
    sessionsSocket.sessionId = sessionId;
    sessionsSocket.connect('TheCreator')
      .then(sessionsSocket => {
        if (sessions.find(session => session.id === sessionsSocket.sessionId) === undefined) {
          const newSession = {
            id: sessionsSocket.sessionId,
            name: Math.random().toString(36).substr(2, 9),
            lastEdited: Date.now(),
            expirationTime: new Date(sessionsSocket.sessionInfo['expiration_time']).getTime(),
            currentUser: 'TheCreator',
            link: `${window.location.origin}/planner?session=${sessionsSocket.sessionId}`,
            participants: sessionsSocket.sessionInfo['participants'],
          }

          setSessions(prevSessions => [...prevSessions, newSession]);
        }
  
        addSocketListeners(sessionsSocket);
        setCurrentSessionId(sessionsSocket.sessionId);
  
        toast({ title: 'Entrou na sessão', description: 'Convida mais amigos para se juntarem!'});
      })
      .catch(() => toast({ title: 'Erro ao entrar na sessão', description: 'Tente novamente mais tarde.' }));
  };

  const handleCreateSession = () => { //Dummy function to create a session...
    sessionsSocket.sessionId = null;
    sessionsSocket.connect('TheCreator')
      .then(sessionsSocket => {
        const newSession = {
          id: sessionsSocket.sessionId,
          name: Math.random().toString(36).substr(2, 9),
          lastEdited: Date.now(),
          expirationTime: sessionsSocket.sessionInfo['expiration_time'],
          link: `${window.location.origin}/planner?session=${sessionsSocket.sessionId}`,
          participants: sessionsSocket.sessionInfo['participants'],
        };
        
        addSocketListeners(sessionsSocket);
        setCurrentSessionId(sessionsSocket.sessionId);
        setSessions(prevSessions => [...prevSessions, newSession]);
  
        toast({ title: 'Sessão criada', description: 'Convida mais pessoas para se juntarem!'});
      })
      .catch(() => toast({ title: 'Erro ao criar a sessão', description: 'Tente novamente mais tarde.' }));
  };

  const handleExitSession = () => {
    sessionsSocket.off('disconnect', handleUnexpectedDisconnect);
    sessionsSocket.disconnect();
    toast({ title: 'Sessão abandonada', description: 'Podes voltar a ela mais tarde, ou iniciar/entrar noutra sessão.'});
    setCurrentSessionId(null);
  };

  const handleDeleteSession = (sessionId: string | null) => {
    setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
    if (currentSession?.id === sessionId) {
      handleExitSession();
    }
  };

  const handleUpdateUser = (updatedName: string) => {
    if (!currentSession)
      return;

    const updatedSession = {
      ...currentSession,
      participants: currentSession.participants.map(participant =>
        participant.client_id === sessionsSocket.clientId ? { ...participant, name: updatedName } : participant
      )
    };
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === currentSession.id ? updatedSession : session
      )
    );

    sessionsSocket.emit('update_participant', { 'name': updatedName });
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={closeModal}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {currentSessionId === null && (
                  <CollabPickSession
                    sessions={sessions}
                    onStartSession={handleStartSession}
                    onCreateSession={handleCreateSession}
                    onDeleteSession={handleDeleteSession}
                  />
                )}

                {currentSessionId !== null && (
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
