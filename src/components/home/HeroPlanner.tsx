import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { HomePageImage, HomePageAltImage, ScheduleDarkImage, LogoNIAEFEUPAltImage } from '../../images'
import { ArrowNarrowRightIcon } from '@heroicons/react/outline'
import { getPath, config } from '../../utils'
import { StampNIAEFEUPImage, BackStampNIAEFEUPImage} from '../../images'


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
            TTS, ou <strong>Time Table Selector</strong>, é uma plataforma desenvolvida pelo <strong>NIAEFEUP</strong>{', '}
            como uma melhor alternativa à ferramenta de horários do SIGARRA, para ajudar os estudantes da Universidade do Porto a planear e elaborar o seu horário para um semestre.
          </p>
          <p>
            O TTS oferece aos estudantes a flexibilidade e praticidade de <strong>criar</strong>, <strong>planear</strong> e <strong>partilhar</strong>{' '} os horários com até 10 opções.
            Isso permite que os alunos planejem seus semestres com antecedência, 
            tenham uma visão abrangente das opções disponíveis e aumentem suas chances de obter o horário desejado, evitando alocações automáticas 
            indesejadas durante as inscrições nas turmas.
            Tens dúvidas sobre a plataforma? A{' '}
            <Link
              className="font-medium text-primary transition-all hover:underline hover:opacity-80"
              to={getPath(config.paths.faqs)}
            >
              página das FAQs
            </Link>{' '}
            esclarece as dúvidas mais comuns.
          </p>
        </div>
      ),
    },
    {
      id: 'why',
      title: <span>O que há de novo na nova versão do TTS?</span>,
      subtitle: <span>Temos muitas novas funcionalidades do TTS e planos para futuras atualizações.</span>,
      image: HomePageAltImage,
      reverse: true,
      content: (
        <div className="space-y-3">
          <p>
            
          </p>
        </div>
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
        <div className="stamp-card w-40 h-40">
          <div className="stamp-card-inner relative text-align-center transition transform w-100% h-100%">
            <div className="stamp-card-front absolute w-100% h-100%">
              <img src={StampNIAEFEUPImage} alt="NIAEFEUP" className="h-auto w-40" />
            </div>
            <div className="stamp-card-back absolute rotate-y-180 w-100% h-100%">
              <img src={BackStampNIAEFEUPImage} alt="NIAEFEUP" className="h-auto w-40" />
            </div>
          </div>
        </div> 
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
            to={config.pathPrefix}
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
