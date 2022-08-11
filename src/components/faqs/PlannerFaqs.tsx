import classNames from 'classnames'
import { useEffect } from 'react'
import { Transition, Disclosure } from '@headlessui/react'
import { ChevronUpIcon, DotsHorizontalIcon } from '@heroicons/react/outline'

const PlannerFaqs = () => {
  const data = [
    {
      question: <span>O que é que mudou relativamente à versão anterior do TTS?</span>,
      answer: (
        <div className="space-y-3">
          <p>A nova versão do Time Table Selector tem várias novas funcionalidades entre elas:</p>
          <ul className="ml-5 list-disc">
            <li>
              Pesquisar e <strong>filtrar cursos</strong> usando texto.
            </li>
            <li>
              Inspecionar <strong>sobreposições</strong> de horários.
            </li>
            <li>
              Inspecionar <strong>uma aula</strong> individualmente.
            </li>
            <li>
              Fazer <strong>múltiplas opções</strong> de horário (até 10).
            </li>
            <li>
              <strong>Guardar</strong> estado/progresso na plataforma <strong>automaticamente</strong> no mesmo browser.
            </li>
            <li>
              <strong>Exportar/importar</strong> horários.
            </li>
            <li>
              Transferir ficheiros <strong>CSV com as 10 opções</strong> de horário.
            </li>
            <li>
              Usar <strong>modo claro</strong> e <strong>modo escuro</strong>.
            </li>
            <li>
              Usar a plataforma adequadamente em <strong>dispositivos móveis</strong>.
            </li>
          </ul>
          <p>
            Para além disso a nova versão do TTS inclui uma interface mais polida e robusta, com melhor acessibilidade e
            usabilidade.
          </p>
        </div>
      ),
    },
    {
      question: <span>Qual o caso de uso do TTS mais comum?</span>,
      answer: (
        <div className="space-y-3">
          <ol className="mt-1 ml-5 list-decimal">
            <li className="font-bold">
              <span className="font-normal">
                Escolher o <strong>ciclo de estudos</strong> (curso) que frequenta.
              </span>
            </li>
            <li className="font-bold">
              <span className="font-normal">
                Selecionar as <strong>unidades curriculares</strong> que pretende realizar no semestre e confirmar.
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
                No menu com opções extra <DotsHorizontalIcon className="mx-1 inline-flex h-5 w-5" />,{' '}
                <strong>exportar as opções em CSV</strong> e usar esse ficheiro para preencher no SIGARRA.
              </span>
            </li>
          </ol>
        </div>
      ),
    },
    {
      question: <span>O que devo fazer se tenho cadeiras em vários cursos?</span>,
      answer: (
        <div className="space-y-3">
          <p>
            Esta funcionalidade estava planeada para a nova versão do TTS e pode futuramente ser implementada. No
            entanto, o planeador de horário apenas permite selecionar unidades curriculares de um curso. Esta
            funcionalidade foi considerada ser de prioridade baixa para o planeador de horários por{' '}
            <strong>4 motivos</strong>:
          </p>
          <ul className="ml-5 list-disc">
            <li>Não são muito comuns casos de alunos nesta situação na UPorto.</li>
            <li>Alunos nesta situação não costumam ter mais do que 1 ou 2 unidades curriculares noutro curso.</li>
            <li>A submissão de horários para cursos diferentes é feita em momentos diferentes.</li>
            <li>
              <strong>Eventualmente</strong>, alunos em 2 cursos fruto da cisão dos mestrados integrados (exemplo:
              L.EIC, M.EIC) estarão obrigados a concluir a licenciatura antes de prosseguir para o mestrado.
            </li>
          </ul>

          <p>
            Assim sendo, recomendamos <strong>fazer as opções de horário num curso e depois no outro</strong> e exportar
            ambos os CSVs, já que a submissão é <strong>geralmente feita no SIGARRA</strong> e no mesmo formato que o
            CSV oferece. Resumidamente, no que toca a{' '}
            <strong>sobreposições de horário em unidades curriculares de cursos diferentes</strong>, essa gestão fica da
            responsabilidade do utilizador.
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
            No entanto, no caso de encontrar outro estudantes que quer fazer a <strong>troca inversa</strong> é sempre
            possível fazer a troca de turma numa fase inicial do semestre. Um{' '}
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
            o departamento do curso e pedir a troca direta. Relativamente a <strong>trocas de turmas indiretas</strong>,
            o aluno deve fazer um pedido de troca de turma junto do departamento de curso e, no caso do limite de alunos
            da turma de destino não ser excedido o pedido será, em princípio concretizado.
          </p>
          <p className="quote">
            Tanto as <strong>trocas de turmas diretas</strong> como as <strong>indiretas</strong> serão facilitadas uma
            vez que a plataforma de mudança de turma <strong>FEUP Exchange</strong> esteja desenvolvida também pelo
            NIAEFEUP. Esta plataforma está <strong>em desenvolvimento</strong> e está planeado que saia a tempo do{' '}
            <strong>ano letivo de 2023/2024</strong>.
          </p>
        </div>
      ),
    },
    {
      question: <span>O planeador deixa-me selecionar as cadeiras que eu quiser no meu curso?</span>,
      answer: (
        <div className="space-y-3">
          <p>
            Sim, o planeador de horário permite selecionar as cadeiras que pretende no seu curso, no respetivo semestre.
            No entanto, o planeador <strong>não se responsabiliza pela contagem de créditos ECTS</strong>. O máximo de
            créditos na Universidade do Porto é <strong>42 ECTS num semestre</strong> e{' '}
            <strong>75 ECTS num ano letivo</strong>. O NIAEFEUP recomenda que os estudantes evitem ultrapassar os{' '}
            <strong>36 ECTS por semestre</strong>, já que um número superior a 36 corresponde (geralmente) a uma carga
            horária pesada, pouco saudável e difícil de gerir.
          </p>
          <p>Avisos e contagem de créditos está planeada como uma funcionalidade para o futuro.</p>
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
    <div id={id} className="mx-auto flex flex-col items-center justify-center gap-6 pt-20">
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={scrollToComponentTop}
          className="relative mb-2 text-center text-3xl font-bold capitalize text-slate-700 transition 
          before:absolute before:-left-8 hover:opacity-80 hover:before:content-['#'] dark:text-white"
        >
          Time Table Selector
        </button>
        <p className="w-full text-lg">
          Nesta secção podes ver as questão relacionadas com o{' '}
          <strong className="text-slate-700 dark:text-white">planeamento de horário</strong>.
        </p>
      </div>

      <div className="mx-auto flex w-full flex-col gap-8">
        {data.map((faq, faqIdx) => (
          <Disclosure
            as="div"
            defaultOpen={true}
            key={`planner-faq-${faqIdx}`}
            className="rounded-2xl bg-white p-3 dark:bg-dark"
          >
            {({ open }) => (
              <>
                <Disclosure.Button
                  className="group flex w-full justify-between rounded-lg bg-slate-200 px-4 py-2 font-medium tracking-tight 
                  text-slate-800 transition hover:bg-slate-700 hover:text-white dark:bg-primary/40 dark:text-white dark:hover:bg-primary/60"
                >
                  {faq.question}
                  <ChevronUpIcon
                    className={classNames(
                      'ml-4 h-6 w-6 transition group-hover:text-white',
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
