import React, { useState } from 'react'
import { DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline'
import { StopIcon } from '@heroicons/react/24/solid'
import { Button } from '../../../ui/button'
import { useToast } from '../../../ui/use-toast'
import { CollabSession } from '../../../../@types'
import { sessionsSocket } from '../../../../api/socket'

const pastelColors = [
  //Colors for the participants
  'bg-orange-200 text-orange-700',
  'bg-blue-200 text-blue-800',
  'bg-yellow-200 text-yellow-800',
  'bg-green-200 text-green-800',
  'bg-purple-200 text-purple-800',
]

type Props = {
  session: CollabSession
  onExitSession: () => void
  onUpdateUser: (arg: string) => void
}

const CollabSessionModal = ({ session, onExitSession, onUpdateUser }: Props) => {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [lastValidUser, setLastValidUser] = useState(
    session.participants.find((p) => p.client_id === sessionsSocket.clientId)?.name ?? ''
  )

  const handleCopyLink = () => {
    navigator.clipboard.writeText(session.link)
    toast({
      title: 'Link copiado',
      description: 'Podes partilhar o link com amigos para colaborar contigo.',
    })
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleUserChange = (e) => {
    const newValue = e.target.value.trim()
    if (newValue !== '') {
      setLastValidUser(newValue)
    }
  }

  const handleUserBlur = (e) => {
    const newValue = e.target.value.trim()
    if (newValue !== '') {
      onUpdateUser(newValue)
    } else {
      onUpdateUser(lastValidUser)
    }
  }

  const currentUserName = session.participants.find((p) => p.client_id === sessionsSocket.clientId)?.name ?? 'Anonymous'

  return (
    <div className="text-left">
      <h3 className="mb-6 text-xl font-bold leading-6">Colaboração ao vivo...</h3>

      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">O teu nome</label>
        <input
          type="text"
          defaultValue={currentUserName}
          onChange={handleUserChange}
          onBlur={handleUserBlur}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Link</label>
        <div className="mt-1 flex items-center">
          <input
            type="text"
            value={session.link}
            className="block w-full flex-1 rounded-md border-gray-300 bg-red-50 shadow-sm sm:text-sm"
            readOnly
          />
          <Button
            variant="icon"
            className={`ml-2 flex items-center px-3 py-1 ${
              copied ? 'bg-green-200 text-white' : 'bg-primary text-white'
            } min-w-[120px] rounded-lg text-sm font-medium`}
            onClick={handleCopyLink}
          >
            {copied ? <CheckIcon className="h-5 w-5 text-green-700" /> : <DocumentDuplicateIcon className="h-5 w-5" />}
            {copied ? '' : ' Copiar link'}
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <h4 className="text-md mb-2 font-medium text-gray-900">Participantes</h4>
        <div className="flex flex-wrap space-x-2">
          {session.participants.map((user, index) => (
            <div key={index} className="group relative mb-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  pastelColors[index % pastelColors.length]
                }`}
              >
                {user.name[0]}
              </div>
              <div className="invisible absolute bottom-12 left-1/2 -translate-x-1/2 transform rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100">
                {user.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-600">
        Interromper a sessão irá desconectar-te da sala, mas podes continuar a criar e ver mais combinações de horários
        localmente
      </p>

      <div className="mt-6 text-center">
        <Button
          type="button"
          className="border-primary text-primary hover:bg-primary rounded-lg border bg-white px-4 py-2 font-medium hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          onClick={onExitSession}
        >
          <StopIcon className="mr-2 h-5 w-5" />
          Sair da sessão
        </Button>
      </div>
    </div>
  )
}

export default CollabSessionModal
