import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { HomePageImage, HomePageAltImage, ScheduleDarkImage, LogoNIAEFEUPAltImage } from '../../images'
import { ArrowNarrowRightIcon } from '@heroicons/react/outline'

type Card = {
  id: string
  image: string
  reverse?: boolean
  title: JSX.Element | string
  subtitle: JSX.Element | string
  content: JSX.Element
}

const HeroPlanner = () => {
  const data: Card[] = [
    {
      id: 'intro',
      reverse: false,
      title: 'O que é o TTS?',
      subtitle: 'O teu melhor amigo para escolher e gerir o teu horário na UPorto.',
      image: ScheduleDarkImage,
      content: (
        <div className="space-y-3">
          <p>
            TTS, ou <strong>Time Table Selector</strong>, é uma plataforma desenvolvida pelo <strong>NIAEFEUP</strong>{' '}
            para ajudar os estudantes da Universidade do Porto a planear e elaborar o seu horário para um semestre.
            Geralmente, no 1º semestre de faculdade o horário é <strong>atribuído automaticamente</strong>, não sendo
            possível efetuar trocas. A partir do 2º Semestre até ao fim do(s) curso(s) o aluno tem a oportunidade de{' '}
            <strong>submeter preferências</strong> para o horário, no início de cada semestre.
          </p>
          <p>
            No entanto, o sistema de informação das faculdades (SIGARRA) geralmente não permite ou não facilita delinear
            opções de horário atempadamente. Para resolver este problema e ajudar a comunidade da{' '}
            <strong>Universidade do Porto</strong>, o <strong>NIAEFEUP</strong> desenvolveu o TTS, uma ferramenta de uso
            fácil, com uma interface simples e polida, que permite aos estudantes preparar as suas opções de horário.
            Tens dúvidas sobre a plataforma? A{' '}
            <Link className="font-medium text-primary transition-all hover:underline hover:opacity-80" to="/faqs">
              página das FAQs
            </Link>{' '}
            esclarece as dúvidas mais comuns.
          </p>
        </div>
      ),
    },
    {
      id: 'why',
      title: <span>Porquê usar o TTS?</span>,
      subtitle: <span>Porque é a ferramenta ideal para teres o melhor horário possível.</span>,
      image: HomePageAltImage,
      reverse: true,
      content: (
        <div className="space-y-3">
          <p>
            O TTS permite aos estudantes <strong>criar</strong>, <strong>planear</strong> e <strong>partilhar</strong>{' '}
            os horários antes das inscrições nas turmas de forma flexível e prática. Podes planear o teu semestre com
            antecedência e ter uma visão abrangente das opções que tens e quais os horários a que queres dar prioridade.
          </p>
          <p>
            Com a nova versão do TTS podes delinear até 10 opções de horário, tal como na submissão das preferências no
            SIGARRA, que se aplica a alguns cursos da UPorto. Mais opções de horário dão-te melhor chance de ficar com
            um horário desejado, evitando alocações automáticas indesejadas.
          </p>
        </div>
      ),
    },
    {
      id: 'news',
      title: <span>O que há de novo na nova versão do TTS?</span>,
      subtitle: <span>Temos muitas novas funcionalidades do TTS e planos para futuras atualizações.</span>,
      image: HomePageImage,
      reverse: false,
      content: (
        <div className="space-y-3">
          <p>
            No seguimento do fim dos mestrados integrados foram precisas várias mudanças ao nosso sistema. Em vez de
            adaptar continuamente, o TTS foi reinventado e reimaginado.
          </p>
          <p>
            Das novas funcionalidade da nova versão destacam-se a capacidade de inspecionar conflitos de aula, exportar
            e importar horários, escolher múltiplas opções de horário, progresso guardado automaticamente e também
            capacidade de transferir um ficheiro CSV com as opções prontas a submeter no SIGARRA. Este novo lançamento,
            contempla também grandes melhoramentos a nível de acessibilidade e usabilidade, começando pelo adição do
            tema claro ou escuro. Para mais informação detalhada sobre novas funcionalidades, consulta a secção do{' '}
            <Link
              to="/faqs#planner"
              className="font-medium text-primary transition-all hover:underline hover:opacity-80"
            >
              TTS na página de FAQs
            </Link>
            .
          </p>
          <p>
            Relativamente a planos futuros, temos o <strong>FEUP Exchange</strong> (nome sujeito a mudança) em
            desenvolvimento, um serviço que permitirá a estudantes da FEUP alterar o seu horário após a atribuição
            inicial feita pelos departamentos.
          </p>
        </div>
      ),
    },
    {
      id: 'identity',
      title: <span>Quem somos nós?</span>,
      subtitle: <span>NIAEFEUP: Núcleo de Informática da AEFEUP</span>,
      image: LogoNIAEFEUPAltImage,
      reverse: true,
      content: (
        <p>
          O Núcleo de Informática da Associação de Estudantes da Faculdade de Engenharia da Universidade do Porto, ou{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://ni.fe.up.pt"
            className="font-medium text-primary transition-all hover:underline hover:opacity-80"
          >
            NIAEFEUP
          </a>{' '}
          é constituído inteiramente por alunos do curso de Engenharia Informática e Computação (L.EIC/M.EIC). A nossa
          principal motivação é ganhar experiência e competências essenciais para o mundo do trabalho assim como
          cultivar nos nossos colegas a vontade de aprender linguagens e novas tecnologias. Fruto dessa motivação surgem
          projetos úteis para a comunidade, como esta plataforma. Entre outros projetos destacamos o{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://ni.fe.up.pt/nijobs"
            className="font-medium text-primary transition-all hover:underline hover:opacity-80"
          >
            NiJobs
          </a>
          , uma plataforma dedicada a ajudar estudantes a encontrar oportunidades de emprego e/ou estágios.
        </p>
      ),
    },
  ]

  const id = 'planner'
  const scrollToComponentTop = () => document.getElementById(id).scrollIntoView()
  const scrollToComponentSection = (id: string) => {
    document.getElementById(id).scrollIntoView()
    window.location.href = window.location.href.split('#')[0] + '#' + id
  }

  useEffect(() => {
    if (window.location.href.split('#')[1] === id) scrollToComponentTop()
  }, [])

  return (
    <div id={id} className="flex flex-col items-center justify-center pt-12 xl:pt-16">
      <div className="flex flex-col items-center justify-center space-y-1">
        <button
          onClick={scrollToComponentTop}
          className="relative text-center font-headings text-3xl font-bold capitalize text-primary transition 
          before:absolute before:-left-8 hover:opacity-80 hover:before:content-['#'] dark:text-white"
        >
          Time Table Selector
        </button>
        <p className="text-center text-base font-normal xl:text-lg">
          A melhor ferramenta para escolheres e gerires o teu horário FEUP!
        </p>
      </div>

      <div className="flex flex-col px-2 xl:px-4">
        {data.map((item, itemIdx) => (
          <div id={item.id} key={`planner-card-feature-${itemIdx}`} className="pt-8 lg:pt-16">
            {/* Desktop */}
            <div className="hidden items-start justify-between xl:flex">
              <div className={classNames('container grow', item.reverse ? 'order-2 ml-8' : 'mr-8')}>
                <button
                  onClick={() => scrollToComponentSection(item.id)}
                  className="relative text-xl font-semibold transition 
                  before:absolute before:-left-5 hover:opacity-80 hover:before:content-['#']"
                >
                  {item.title}
                </button>
                <p className="mb-3 text-lg font-medium tracking-tight text-primary">{item.subtitle}</p>
                <div className="prose text-justify text-sm 2xl:text-base">{item.content}</div>
              </div>
              <img className="max-w-lg rounded shadow 2xl:max-w-xl" src={item.image} alt="card" />
            </div>

            {/* Mobile */}
            <div className="flex flex-col items-start justify-between gap-y-4 xl:hidden">
              <img className="w-full rounded shadow" src={item.image} alt="card" />
              <div className="container grow">
                <h3 className="text-center text-xl font-semibold">{item.title}</h3>
                <h5 className="mb-3 text-center text-base font-medium tracking-tight text-primary">{item.subtitle}</h5>
                <div className="prose text-justify text-sm leading-relaxed">{item.content}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex w-full items-center justify-end">
        <div className="relative mr-4">
          <Link
            to="/planner"
            className="group inline-flex items-center justify-center gap-2 rounded bg-primary px-6 py-3 text-center 
            text-lg font-normal uppercase tracking-wider text-white transition-all hover:opacity-90"
          >
            <span>Experimentar</span>
            <ArrowNarrowRightIcon className="h-5 w-5 transition-all group-hover:ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HeroPlanner
