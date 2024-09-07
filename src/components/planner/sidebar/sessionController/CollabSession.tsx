import React, { useContext, useState } from 'react';
import { DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline';
import { StopIcon } from '@heroicons/react/24/solid';
import { Button } from '../../../ui/button';
import { useToast } from '../../../ui/use-toast';
import CollabSessionContext from '../../../../contexts/CollabSessionContext';

const CollabSession = ({ session, onExitSession, onUpdateUser }) => {
  console.log("here")
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  console.log('CollabSession -> session', session);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(session.link);
    toast({
      title: 'Link copiado',
      description: 'Podes partilhar o link com amigos para colaborar contigo.',
    });
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="text-left">
      <h3 className="text-xl font-bold leading-6 mb-6">Colaboração ao vivo...</h3>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">O teu nome</label>
        <input
          type="text"
          value={session.currentUser}
          onChange={(e) => onUpdateUser(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
        <div className="flex items-center mt-1">
          <input
            type="text"
            value={session.link}
            className="flex-1 block w-full rounded-md bg-red-50 border-gray-300 shadow-sm sm:text-sm"
            readOnly
          />
          <Button
            variant="icon"
            className={`ml-2 px-3 py-1 flex items-center ${copied ? 'bg-green-200 text-white' : 'bg-primary text-white'} text-sm font-medium rounded-lg min-w-[120px]`}
            onClick={handleCopyLink}
          >
            {copied ? (
              <CheckIcon className="h-5 w-5 text-green-700" />
            ) : (
              <DocumentDuplicateIcon className="h-5 w-5" />
            )}
            {copied ? '' : ' Copiar link'}
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-900 mb-2">Participantes</h4>
        <div className="flex space-x-2">
          {session.participants.map((user, index) => (
            <div
              key={index}
              className={`rounded-full h-10 w-10 flex items-center justify-center ${
                index % 2 === 0 ? 'bg-orange-200 text-orange-700' : 'bg-blue-200 text-blue-700'
              }`}
            >
              {user[0]}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-600">
        Interromper a sessão irá desconectá-lo da sala, mas você poderá continuar trabalhando com a cena, localmente.
      </p>

      <div className="mt-6 text-center">
        <Button
          type="button"
          className="px-4 py-2 bg-white border border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          onClick={onExitSession}
        >
          <StopIcon className="h-5 w-5 mr-2" />
          Sair da sessão
        </Button>
      </div>
    </div>
  );
};

export default CollabSession;
