import classNames from 'classnames'
import { useEffect } from 'react'
import { Transition, Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'

const ExchangeFaqs = () => {
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

  const id = 'exchange'
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
          FEUP Exchange (Coming Soon)
        </button>
        <p className="w-full text-lg">
          Nesta secção podes ver as questão relacionadas com as{' '}
          <strong className="text-slate-700 dark:text-white">mudanças de horário</strong>.
        </p>
      </div>

      <div className="mx-auto flex w-full flex-col gap-8">
        {data.map((faq, faqIdx) => (
          <Disclosure
            as="div"
            defaultOpen={true}
            key={`exchange-faq-${faqIdx}`}
            className="rounded-2xl bg-white p-3 dark:bg-dark"
          >
            {({ open }) => (
              <>
                <Disclosure.Button
                  className="group flex w-full items-center justify-between gap-1 rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium tracking-tight text-slate-800 transition 
                  hover:bg-slate-700 hover:text-white dark:bg-primary/40 dark:text-white dark:hover:bg-primary/60 lg:px-4 lg:text-base"
                >
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

export default ExchangeFaqs
