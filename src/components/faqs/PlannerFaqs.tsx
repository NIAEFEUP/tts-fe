import classNames from 'classnames'
import { useEffect } from 'react'
import { Transition, Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'

const PlannerFaqs = () => {
  const data = [
    {
      question: <span>Qual o caso de uso do TTS mais comum?</span>,
      answer: (
        <div className="space-y-3">
          <ol className="mt-1 ml-5 list-decimal">
            <li className="font-bold">
              <span className="font-normal">
                Escolher o <strong>ciclo de estudos</strong> (curso) que frequentas.
              </span>
            </li>
            <li className="font-bold">
              <span className="font-normal">
                Seleciona as <strong>unidades curriculares</strong> que vais frequentar e confirmar.
              </span>
            </li>
            <li className="font-bold">
              <span className="font-normal">
                Seleciona as <strong>turmas pretendidas</strong> nas caixas associadas a cada unidade curricular.
              </span>
            </li>
            <li className="font-bold">
              <span className="font-normal">
                Faz <strong>várias opções de horário</strong>, saltando e ordenando de acordo com a tua preferência.
              </span>
            </li>
            <li className="font-bold">
              <span className="font-normal">
                Exporta as <strong>opções em CSV</strong> para partilhar ou para mais facilmente preencher no SIGARRA.
              </span>
            </li>
          </ol>
        </div>
      ),
    },
    {
      question: <span>O que devo fazer se tenho cadeiras em diferentes cursos?</span>,
      answer: (
        <div className="space-y-3">
          <p>É possível selecionar unidades curriculares de diferentes cursos que já o selecionado.</p>
          <p>
            Para isso basta <strong>aceder ao painel de escolha de UCs</strong> e clicar no botão no canto inferior
            esquerdo <strong>"UCs de outros cursos"</strong>, pesquisar o curso da unidade curricular desejável e
            selecionar.
          </p>
        </div>
      ),
    },
    {
      question: <span>O que devo fazer se não gostar do horário que obtiver?</span>,
      answer: (
        <div className="space-y-3">
          <p>
            As opções de horário são submetidas e processadas pelos <strong>departamentos de curso</strong>. De uma
            maneira geral há períodos dedicados a troca de turmas, sobre os quais os estudantes devem ser avisados por
            email. O processamento de pedidos de mudança de turma também é da responsabilidade do departamento de curso.
            No entanto, no caso de encontrares outro estudantes que querem fazer a <strong>troca inversa</strong> é
            sempre possível fazer a troca de turma numa fase inicial do semestre. Um{' '}
            <strong>exemplo de troca de turma direta</strong> é o seguinte:
          </p>
          <ul className="ml-5 list-disc">
            <li>
              O <strong>estudante A</strong> quer a turma 1 e está na turma 2.
            </li>
            <li>
              O <strong>estudante B</strong> quer a turma 2 e está na turma 1.
            </li>
          </ul>
          <p>
            Nesta situação, e caso não recebam nenhuma outra indicação, ambos os estudantes devem entrar em contacto com
            o departamento do curso e pedir a troca direta. Relativamente à <strong>trocas de turmas indiretas</strong>,
            o aluno deve fazer um pedido de troca de turma junto do departamento de curso e, no caso do limite de alunos
            da turma de destino não ser excedido o pedido poderá ser concretizado.
          </p>
        </div>
      ),
    },
    {
      question: <span>O TTS deixa-me selecionar as cadeiras que eu quiser?</span>,
      answer: (
        <div className="space-y-3">
          <p>
            Sim, o TTS de horário permite selecionar um número qualquer de cadeiras no respetivo semestre. No entanto, o
            TTS <strong>não se responsabiliza pela contagem de créditos ECTS</strong>. Certifica-se que não estás a
            ultrapassar o limite de créditos permitido para a tua situação atual.
          </p>
        </div>
      ),
    },
    {
      question: <span>Para que servem os cadeados ao lado de cada opção de unidade curricular?</span>,
      answer: (
        <div className="space-y-3">
          <p>
            Os cadeados servem para conseguires bloqueares a opção atual de tal forma a que te impeça de alterares
            acidentalmente a opção exceto se voltares a desbloquear.
          </p>
          <p>
            Esta funcionalidade é particularmente útil para as <strong>opções que já não tens dúvidas</strong> e também
            para que a opção <strong>não seja alterada ao utilizares o preenchimento aleatório</strong>.
          </p>
        </div>
      ),
    },
  ]

  const id = 'planner'
  const scrollToComponentTop = () => document.getElementById(id).scrollIntoView()

  useEffect(() => {
    if (window.location.href.split('#')[1] === id) scrollToComponentTop()
  }, [])

  return (
    <div id={id} className="mx-auto flex flex-col items-center justify-center gap-6 pt-14">
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={scrollToComponentTop}
          className="relative mb-2 text-center text-3xl font-bold capitalize text-slate-700 transition 
          before:absolute before:-left-8 hover:opacity-80 hover:before:content-['#'] dark:text-white"
        >
          Time Table Selector
        </button>
      </div>

      <div className="mx-auto flex w-full flex-col gap-8">
        {data.map((faq, faqIdx) => (
          <Disclosure
            as="div"
            defaultOpen={false}
            key={`planner-faq-${faqIdx}`}
            className="rounded-2xl bg-white p-3 dark:bg-dark"
          >
            {({ open }) => (
              <>
                <Disclosure.Button className="group flex w-full items-center justify-between gap-1 rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium tracking-tight text-slate-800 transition hover:bg-slate-700 hover:text-white dark:bg-primary/40 dark:text-white dark:hover:bg-primary/60 lg:px-4 lg:text-base">
                  <span className="text-left">{faq.question}</span>
                  <ChevronUpIcon
                    className={classNames(
                      'h-5 w-5 min-w-[1.25rem] transition group-hover:text-white lg:h-6 lg:w-6 lg:min-w-[1.5rem]',
                      open ? 'rotate-180 transform' : ''
                    )}
                  />
                </Disclosure.Button>

                <Transition
                  show={open}
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="w-full px-2 py-3 text-gray-700 dark:text-white">
                    {faq.answer}
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  )
}

export default PlannerFaqs
