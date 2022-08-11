import { Transition, Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/outline'
import classNames from 'classnames'

const ExchangeFaqs = (props) => {
  if (props.hidden) return null

  const data = [
    {
      question: (
        <span>
          Se quiser mudar de turma a uma cadeira, preciso de encontrar previamente um outro aluno nessa turma que esteja
          disposto a fazer a troca comigo?
        </span>
      ),
      answer: (
        <p>
          Não! Basta cada aluno indicar as suas preferências a cada cadeira, e o algoritmo irá automaticamente encontrar
          alguém que faça a troca com o mesmo
        </p>
      ),
    },
    {
      question: <span>Posso fazer alterações às minhas preferências, ou desistir de a utilizar?</span>,
      answer: (
        <p>
          Sim, mas apenas antes da data limite. A data limite será apresentada na página principal do FEUPExchange. Até
          esse limite, os estudantes podem alterá-las, ou até desistir de utilizar a plataforma. Depois desse limite, as
          preferências ficam bloqueadas, e o algoritmo é executado.
        </p>
      ),
    },
    {
      question: <span>Quando é que posso ver o meu novo horário?</span>,
      answer: (
        <p>
          Após chegar a data limite e após o algoritmo ser executado, a platforma irá enviar um email a cada estudante,
          que irá conter o seu novo horário! Esses horários são depois enviados para a secretaria da FEUP, e pouco
          depois o novo horário ficará visível no SIGARRA!
        </p>
      ),
    },
    {
      question: <span>E se eu fico com um horário que não gosto?</span>,
      answer: (
        <p>
          O algoritmo do FEUPExchange não irá gerar, para nenhum estudante, um horário cujas cadeiras não sejam
          especificadas nas suas indicações (quer seja nas preferências, nos give-ins ou nos buddies). Tendo isto em
          conta, o FEUPExchange não se responsabiliza caso o estudante prefira o seu horário antigo, face ao novo
          horário gerado.
        </p>
      ),
    },
    {
      question: <span>Quanto tempo demora até as alterações serem visíveis no SIGARRA?</span>,
      answer: (
        <p>
          Após correr o algoritmo, todos os novos horários serão enviados para secretaria da FEUP passado alguns
          minutos. Depois cabe à secretaria processar as alterações de horário para cada estudante. É previsto que as
          mudanças sejam visíveis no SIGARRA dentro de 1 a 2 dias úteis.
        </p>
      ),
    },
  ]

  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-6">
      <div>
        <h2 className="mb-2 text-center text-2xl font-bold uppercase text-primary dark:text-white">
          FEUP Exchange (Coming Soon)
        </h2>
        <p className="w-full text-base">
          Nesta secção podes ver as questão relacionadas com as{' '}
          <span className="text-primary">mudanças de horário</span>.
        </p>
      </div>

      <div className="mx-auto flex w-full flex-col gap-4 rounded-2xl bg-white p-4 dark:bg-dark">
        {data.map((faq, faqIdx) => (
          <Disclosure defaultOpen={faqIdx === 0} as="div" key={`exchange-faq-${faqIdx}`}>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className="group flex w-full justify-between rounded-lg bg-[#e7edf0] px-4 
                  py-2 text-left font-medium text-secondary transition hover:bg-secondary 
                  hover:text-white dark:bg-secondary/50 dark:text-white dark:hover:bg-secondary/90"
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

export default ExchangeFaqs
