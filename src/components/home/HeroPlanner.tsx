import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { useEffect, useContext } from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import FeatureCards from './FeatureCards'
import { ThemeContext } from '../../contexts/ThemeContext'
import { ScheduleDarkImage, ScheduleLightImage, StampNIAEFEUPImage, BackStampNIAEFEUPImage } from '../../images'
import { getPath, config, scrollToTop } from '../../utils'

type Card = {
  id: string
  image: string
  reverse?: boolean
  title: JSX.Element | string
  subtitle: JSX.Element | string
  content: JSX.Element
}

const HeroPlanner = () => {
  const { enabled } = useContext(ThemeContext)
  const data: Card[] = [
    {
      id: 'intro',
      reverse: false,
      title: 'O que é o TTS?',
      subtitle: 'O teu melhor amigo para escolher e gerir o teu horário na UPorto.',
      image: enabled ? ScheduleDarkImage : ScheduleLightImage,
      content: (
        <div className="space-y-3">
          <p>
            TTS, ou <strong>Time Table Selector</strong>, é uma plataforma desenvolvida pelo <strong>NIAEFEUP</strong>
            {', '}
            como uma melhor alternativa à ferramenta de horários do SIGARRA, para ajudar os estudantes da Universidade
            do Porto a planear e elaborar o seu horário para um semestre.
          </p>
          <p>
            O TTS é a ferramenta que torna o processo de escolher turmas mais simples, mais flexível e da forma a
            perderes o menos tempo possível. Molda o horário à tua maneira, quer seja por preferires certos professores
            ou dias livres. Partilha facilmente os horários com os amigos e{' '}
            <strong> não deixes o horário perfeito escapar</strong>. Tens dúvidas sobre a plataforma? A{' '}
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
  ]

  //TODO(thePeras): Use useRef instead of getElementById
  const id = 'planner'
  const scrollToComponentTop = () => document.getElementById(id).scrollIntoView()
  const scrollToComponentSection = (id: string) => {
    document.getElementById(id).scrollIntoView()
    window.location.href = window.location.href.split('#')[0] + '#' + id
  }

  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <div id={id} className="relative flex flex-col items-center justify-center pt-12 xl:pt-16">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="stamp-card relative bottom-10 h-10 w-20 sm:bottom-10 md:bottom-5 md:left-[200px] md:rotate-[17deg]">
          <div className="stamp-card-inner text-align-center w-100% h-100% relative transform transition">
            <div className="stamp-card-front w-100% h-100% absolute">
              <img src={StampNIAEFEUPImage} alt="NIAEFEUP" className="h-auto w-40" />
            </div>
            <div className="stamp-card-back rotate-y-180 w-100% h-100% absolute">
              <img src={BackStampNIAEFEUPImage} alt="NIAEFEUP" className="h-auto w-40" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-15 flex flex-row items-center justify-center">
        <button
          onClick={scrollToComponentTop}
          className="w-15 relative text-center font-headings text-3xl font-bold capitalize text-primary transition 
              before:absolute before:-left-8 hover:opacity-80 hover:before:content-['#'] dark:text-white"
        >
          Time Table Selector
        </button>
      </div>
      <p className="text-center text-base font-normal xl:text-lg">Não deixes o horário perfeito escapar!</p>
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

      <div id="features">
        <div className="w-15 flex flex-row items-center justify-center">
          <button
            onClick={() => scrollToComponentSection('features')}
            className="w-15 relative pt-12 text-center font-headings text-2xl font-bold capitalize text-primary transition 
                before:absolute before:-left-8 hover:opacity-80 hover:before:content-['#'] dark:text-white"
          >
            Principais Funcionalidades
          </button>
        </div>
        <p className="text-center text-base font-normal xl:text-lg">
          Temos novas funcionalidades e planos para futuras atualizações.
        </p>
        <FeatureCards />
      </div>

      <div className="mt-4 flex w-full items-center justify-end">
        <div className="relative mr-4">
          <Link
            to={config.pathPrefix}
            className="group inline-flex items-center justify-center gap-2 rounded bg-primary px-6 py-3 text-center 
            text-lg font-normal uppercase tracking-wider text-white transition-all hover:opacity-90"
          >
            <span>Experimentar</span>
            <ArrowRightIcon className="h-5 w-5 transition-all group-hover:ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HeroPlanner
