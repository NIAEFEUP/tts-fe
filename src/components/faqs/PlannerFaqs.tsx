import classNames from 'classnames'
import { Transition, Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import { AnalyticsTracker } from '../../utils/AnalyticsTracker'

const PlannerFaqs = () => {
  const data = [
    {
      question: <span>Qual o caso de uso do TTS mais comum?</span>,
      answer: (
        <div className="space-y-3">
          <ol className="ml-5 mt-1 list-decimal">
            <li className="font-bold">
              <span className="font-normal">
                Seleciona as tuas <strong>unidades curriculares</strong> para o semestre.
              </span>
            </li>
            <li className="font-bold">
              <span className="font-normal">
                Escolhe uma <strong>turma</strong> em cada unidade curricular.
              </span>
            </li>
            <li className="font-bold">
              <span className="font-normal">
                Cria várias <strong>variações</strong> de horários e organiza-os à tua maneira.
              </span>
            </li>
            <li className="font-bold">
              <span className="font-normal">
                <strong>Partilha</strong> as tuas combinações com os teus amigos e vê o que eles te dizem.
              </span>
            </li>
          </ol>
        </div>
      ),
    },
    {
      question: <span>O TTS está associado à Universidade do Porto?</span>,
      answer: (
        <div className="space-y-3">
          <p>
            O <strong>Time Table Selector</strong> é uma ferramenta desenvolvida pelo NIAEFEUP, um grupo de estudantes
            da Faculdade de Engenharia da Universidade do Porto, e é totalmente independente de qualquer instituição. É
            uma ferramenta de apoio à escolha de horários e não substitui qualquer sistema oficial da Universidade do
            Porto.
          </p>
        </div>
      ),
    },
    {
      question: <span>Quem pode utilizar o TTS?</span>,
      answer: (
        <div className="space-y-3">
          <p>
            Esta ferramenta foi desenvolvida para ser utilizada por qualquer estudante da{' '}
            <strong>Universidade do Porto</strong>, seja estudante de licenciatura, mestrado ou doutoramento.
          </p>
        </div>
      ),
    },
    {
      question: <span>O que é um ECTS?</span>,
      answer: (
        <div className="space-y-3">
          <p>
            O <strong>European Credit Transfer and Accumulation System (ECTS)</strong> é um sistema de créditos
            académicos que permite a comparação e aferição da carga de trabalho dos estudantes no ensino superior
            europeu. Um crédito ECTS corresponde a 25-30 horas de trabalho, incluindo aulas teóricas e práticas, estudo
            individual, trabalhos de grupo, entre outros. O TTS permite-te visualizar o número de créditos ECTS de cada
            unidade curricular.
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
          <p>Os cadeados servem para bloqueares a opção atual de forma a te impedir de a alterar acidentalmente.</p>
          <p>
            Esta funcionalidade é particularmente útil para as <strong>opções que já não tens dúvidas</strong> e também
            para que a opção não seja alterada ao utilizares o <strong>preenchimento aleatório</strong>.
          </p>
        </div>
      ),
    },
    {
      question: <span>É possível selecionar unidades curriculares de diferentes cursos?</span>,
      answer: (
        <div className="space-y-3">
          <p>
            Sim! Acede ao <strong>painel de escolha das cadeiras</strong> e pesquisa o curso da unidade curricular extra
            pretendida. Vais conseguir ver todas as ucs desse curso, procura pela tua, seleciona e vais vê-la a ser
            adicionada à tua lista de cadeiras.
          </p>
        </div>
      ),
    },
    {
      question: <span>A quem devo recorrer se tiver dúvidas sobre a escolha de cadeiras?</span>,
      answer: (
        <div className="space-y-3">
          <p>
            Se tiveres dúvidas sobre a escolha de cadeiras, deves contactar a <strong>secretaria</strong> do
            departamento do teu curso ou diretamente a <strong>comssião responsável</strong> pela gestão dos teus
            horários.
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
            o departamento do curso e pedir a troca direta. Relativamente às <strong>trocas de turmas indiretas</strong>
            , o aluno deve fazer um pedido de troca de turma junto do departamento de curso e, no caso do limite de
            alunos da turma de destino não ser excedido o pedido poderá ser concretizado.
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-6 pt-14">
      <div className="mx-auto flex w-full flex-col gap-8">
        {data.map((faq, faqIdx) => (
          <Disclosure
            as="div"
            defaultOpen={faqIdx === 0}
            key={`planner-faq-${faqIdx}`}
            className={`rounded-2xl bg-white p-3 dark:bg-dark faq-disclosure-${faqIdx}`}
            onClick={() => {
              const disclosure = document.querySelector(`.faq-disclosure-${faqIdx}`);
              const isOpen = disclosure?.getAttribute('data-headlessui-state') !== 'open';
              if (isOpen && faq.question.type === 'span') {
                AnalyticsTracker.trackFaq(faq.question.props.children)
              }
            }}
          >
            {({ open }) => (
              <>
                <Disclosure.Button className="group flex w-full items-center justify-between gap-1 rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium tracking-tight text-slate-800 transition hover:bg-primary hover:text-white dark:bg-primary/40 dark:text-white dark:hover:bg-primary/60 lg:px-4 lg:text-base">
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
