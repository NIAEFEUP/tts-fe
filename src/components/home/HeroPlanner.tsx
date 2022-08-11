import classNames from 'classnames'
import { HomePageImage, HomePageAltImage, ScheduleDarkImage, LogoNIAEFEUPAltImage } from '../../images'
import { Link } from 'react-router-dom'

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
      subtitle: <span>Porque é a ferramenta ideal que precisas</span>,
      image: HomePageAltImage,
      reverse: true,
      content: (
        <p>
          O TTS é uma ferramenta criada para ajudar os estudantes a criar, planear e partilhar os horários antes das
          inscrições de turmas de forma prática. Assim, podes começar a planear o teu semestre com antecedência, e, algo
          ainda melhor: Graças às novas features adicionadas, podes fazer o download ou dar upload de qualquer horário.
          Então tornou-se mais fácil do que nunca conseguires criar um horário e enviar para que os teus amigos fiquem
          com o mesmo horário que tu e nas mesmas turmas! Para além disso, o TTS tem um algoritmo de colisão de turmas,
          portanto não precisas de preocupar-te em verificar se existe algum problema, o TTS irá advertir-te!
        </p>
      ),
    },
    {
      id: 'news',
      title: <span>Novas features do TTS e futuras atualizações</span>,
      subtitle: <span>Temos algumas novidades nesta nova versão do TTS</span>,
      image: HomePageImage,
      reverse: false,
      content: (
        <p>
          Desde o Dark Mode até ao download/upload dos horários, temos algumas novidades nesta release. Como já foi
          apresentado, criamos um método que permite que faças o teu horário e o descarregues de modo que o possas ter
          no teu computador e que consigas enviar a qualquer amigo ou até dar upload para quando voltares ao TTS. Podes
          também exportar o horário para CSV para poderes preencher no Sigarra! Adicionamos também o Dark Mode para
          aumentar a acessibilidade dos estudantes. Por fim, criamos opções de horários de modo que possas planear e
          testar vários horários em simultâneo! Pretendemos num futuro breve lançar também o FEUPExchange, que será
          ainda melhor para te ajudar a trocar de turma. Vemo-nos em breve!
        </p>
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
          projetos úteis para a comunidade, como o TTS.
        </p>
      ),
    },
  ]

  return (
    <div id="planner" className="flex flex-col items-center justify-center space-y-3">
      <div className="flex flex-col items-center justify-center">
        <h2 className="mb-2 text-center text-2xl font-bold uppercase text-primary xl:text-3xl">Time Table Selector</h2>
        <p className="mb-2 text-center text-base font-normal xl:text-lg">
          A melhor ferramenta para escolheres e gerires o teu horário FEUP!
        </p>
      </div>

      <div className="flex flex-col gap-12 px-4 py-4 xl:px-6 xl:py-6">
        {data.map((item, itemIdx) => (
          <div id={item.id} key={`planner-card-feature-${itemIdx}`}>
            {/* Desktop */}
            <div className="hidden items-start justify-between xl:flex">
              <div className={classNames('container grow', item.reverse ? 'order-2 ml-8' : 'mr-8')}>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <h5 className="mb-3 text-lg font-medium tracking-tight text-primary">{item.subtitle}</h5>
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
    </div>
  )
}

export default HeroPlanner
