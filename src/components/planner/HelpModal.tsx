import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, EllipsisHorizontalIcon, LifebuoyIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { config, getPath } from '../../utils/utils'

const HelpModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <button
        onClick={openModal}
        title="Limpar memória de opções de horário"
        className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded bg-tertiary p-2 
        text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="truncate">Preciso de ajuda</span>
        <LifebuoyIcon className="h-5 w-5" />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10 text-sm" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
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
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle text-gray-700 shadow-xl transition-all dark:bg-dark dark:text-white">
                  <header className="flex items-center justify-between">
                    <Dialog.Title as="h3" className="text-2xl font-semibold leading-6">
                      Como utilizar o planeador de horário?
                    </Dialog.Title>

                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded p-1 text-rose-700 transition hover:bg-rose-700 hover:text-white"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </header>

                  <div className="mt-3 flex flex-col">
                    <p>
                      O <strong>planeador do horário</strong> permite aos{' '}
                      <strong>estudantes da Universidade do Porto</strong> selecionar várias opções de horário para as
                      aulas que pretendem frequentar num dado semestre.
                    </p>
                    <p className="mt-3">Caso de uso mais comum:</p>
                    <ol className="mt-1 ml-5 list-decimal">
                      <li className="font-bold">
                        <span className="font-normal">
                          Escolher o <strong>ciclo de estudos</strong> (curso) que frequenta.
                        </span>
                      </li>
                      <li className="font-bold">
                        <span className="font-normal">
                          Selecionar as <strong>unidades curriculares</strong> que pretende realizar no semestre e
                          confirmar.
                        </span>
                      </li>
                      <li className="font-bold">
                        <span className="font-normal">
                          Fazer duplo clique na caixa da atual <strong>opcão do horário</strong> para alterar o nome do
                          mesmo.
                        </span>
                      </li>
                      <li className="font-bold">
                        <span className="font-normal">
                          Selecionar os <strong>horários pretendidos</strong> nas caixas associadas a cada curso.
                        </span>
                      </li>
                      <li className="font-bold">
                        <span className="font-normal">
                          Fazer <strong>várias opções de horário</strong>, saltando entre elas usando as setas no topo.
                        </span>
                      </li>
                      <li className="font-bold">
                        <span className="font-normal">
                          No menu com opções extra <EllipsisHorizontalIcon className="mx-1 inline-flex h-5 w-5" />,{' '}
                          <strong>exportar as opções em CSV</strong> e usar esse ficheiro para preencher no SIGARRA.
                        </span>
                      </li>
                    </ol>
                    <p className="mt-3">
                      Outras <strong>notas importantes</strong> para o utilizador:
                    </p>
                    <ul className="mt-1 ml-4 list-disc space-y-1">
                      <li>
                        O planeador memoriza as opções feitas pelo utilizador e permite-lhe voltar ao mesmo estado, caso
                        use o mesmo browser. Ao sair da página, os dados de <strong>curso</strong>,{' '}
                        <strong>unidades curriculares</strong> selecionadas e{' '}
                        <strong>opções de horário são guardados</strong>.
                      </li>
                      <li>
                        Bugs e outros problemas com a plataforma podem e devem ser reportados por email para o endereço{' '}
                        <a
                          className="font-bold text-tertiary transition-all hover:underline hover:opacity-80"
                          href="mailto:projetos.niaefeup@gmail.com"
                        >
                          projetos.niaefeup@gmail.com
                        </a>
                        .
                      </li>
                      <li>
                        Se persistirem dúvidas sobre como funciona o Time Table Selector, a{' '}
                        <Link
                          className="font-bold text-tertiary transition-all hover:underline hover:opacity-80"
                          to={getPath(config.paths.faqs) + '#planner'}
                        >
                          página de FAQs
                        </Link>{' '}
                        responde às perguntas mais comuns.
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8">
                    <button
                      type="button"
                      className="flex items-center space-x-2 rounded bg-tertiary px-3 py-2 text-center text-sm font-medium text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={closeModal}
                    >
                      <span>Ok, entendido!</span>
                      <CheckIcon className="h-5 w-5" />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default HelpModal
