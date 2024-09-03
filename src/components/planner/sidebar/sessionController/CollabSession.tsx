import React from 'react';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { StopIcon } from '@heroicons/react/24/solid';
import { Button } from '../../../ui/button';
import { useToast } from '../../../ui/use-toast'
const CollabSession = ({ session, onExitSession }) => {
  const {toast} =useToast()
  const handleCopyLink = () => {
    navigator.clipboard.writeText(session.sessionLink);
    toast({ title: 'Link copiado', description: 'Podes partilhar o link com amigos para colaborar contigo.' });
  };

  return (
    <div className="text-left">
      <h3 className="text-xl font-bold leading-6 mb-6 ">
        Colaboração ao vivo...
      </h3>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">O teu nome</label>
        <input
          type="text"
          value={session.username}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          readOnly
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
        <div className="flex items-center mt-1">
          <input
            type="text"
            value={session.sessionLink}
            className="flex-1 block w-full rounded-md bg-red-50 border-gray-300 shadow-sm sm:text-sm"
            readOnly
          />
          <Button
            variant="icon"
            className="ml-2 px-3 py-1 flex items-center bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg"
            onClick={handleCopyLink}
          >
            <DocumentDuplicateIcon className="h-5 w-5 mr-1" />
            Copiar link
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-900 mb-2">Participantes</h4>
        <div className="flex space-x-2">
          <div className="rounded-full bg-orange-200 h-10 w-10 flex items-center justify-center text-orange-700">O</div>
          <div className="rounded-full bg-blue-200 h-10 w-10 flex items-center justify-center">D</div>
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
