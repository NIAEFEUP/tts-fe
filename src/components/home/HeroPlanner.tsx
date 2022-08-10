import CardFeature from './CardFeature'
import { HomePageImage, HomePageAltImage, ScheduleDarkImage, LogoNIAEFEUPAltImage } from '../../images'

const HeroPlanner = () => (
  <div id="tts" className="flex flex-col items-center justify-center space-y-6">
    <div>
      <h2 className="mb-2 text-center text-3xl font-bold uppercase text-primary">Time Table Selector</h2>
      <h5 className="mb-2 text-center text-xl font-medium">
        A melhor ferramenta para escolheres e gerires o teu horário FEUP!
      </h5>
    </div>

    <div>
      <CardFeature
        id="intro"
        title="O que é o TTS?"
        subtitle="O teu melhor amigo para escolher e cuidar do horário na FEUP"
        image={ScheduleDarkImage}
        reverse={false}
      >
        <p>
          TTS, ou <strong>Time Table Selector</strong>, é uma ferramenta desenvolvida pelo <strong>NIAEFEUP</strong>{' '}
          para ajudar os estudantes da Universidade do Porto a planear e elaborar o seu horário para um semestre.
          Geralmente, no <strong>primeiro semestre de faculdade</strong> o horário é atribuído automaticamente, não
          sendo possível efetuar trocas. A partir do 2º Semestre até ao fim do(s) curso(s) o aluno tem a oportunidade de
          submeter as suas preferências para o horário de cada semestre.
        </p>
        <p>
          No entanto, o sistema de informação das faculdades geralmente não é intuitivo e/ou fácil de usar para delinear
          opções de horário. Para resolver este problema e ajudar a comunidade da Universidade do Porto, o NIAEFEUP
          desenvolveu o TTS, uma ferramenta de uso fácil, com uma interface limpa e simples, que permite aos estudantes
          preparar as suas opções de horário.
        </p>
      </CardFeature>
      <CardFeature
        id="why"
        title="Porquê usar o TTS?"
        subtitle="Porque é a ferramenta ideal que precisas"
        image={HomePageAltImage}
        reverse={true}
      >
        <p>
          O TTS é uma ferramenta criada para ajudar os estudantes a criar, planear e partilhar os horários antes das
          inscrições de turmas de forma prática. Assim, podes começar a planear o teu semestre com antecedência, e, algo
          ainda melhor: Graças às novas features adicionadas, podes fazer o download ou dar upload de qualquer horário.
          Então tornou-se mais fácil do que nunca conseguires criar um horário e enviar para que os teus amigos fiquem
          com o mesmo horário que tu e nas mesmas turmas! Para além disso, o TTS tem um algoritmo de colisão de turmas,
          portanto não precisas de preocupar-te em verificar se existe algum problema, o TTS irá advertir-te!
        </p>
      </CardFeature>
      <CardFeature
        id="news"
        title="Novas features do TTS e futuras atualizações"
        subtitle="Temos algumas novidades nesta nova versão do TTS"
        image={HomePageImage}
        reverse={false}
      >
        <p>
          Desde o Dark Mode até ao download/upload dos horários, temos algumas novidades nesta release. Como já foi
          apresentado, criamos um método que permite que faças o teu horário e o descarregues de modo que o possas ter
          no teu computador e que consigas enviar a qualquer amigo ou até dar upload para quando voltares ao TTS. Podes
          também exportar o horário para CSV para poderes preencher no Sigarra! Adicionamos também o Dark Mode para
          aumentar a acessibilidade dos estudantes. Por fim, criamos opções de horários de modo que possas planear e
          testar vários horários em simultâneo! Pretendemos num futuro breve lançar também o FEUPExchange, que será
          ainda melhor para te ajudar a trocar de turma. Vemo-nos em breve!
        </p>
      </CardFeature>
      <CardFeature
        id="identity"
        title="Quem somos nós?"
        subtitle="NIAEFEUP"
        image={LogoNIAEFEUPAltImage}
        reverse={true}
      >
        <p>
          O Núcleo de Informática da Associação de Estudantes da Faculdade de Engenharia da Universidade do Porto ou
          NIAEFEUP é constituído inteiramente por alunos do curso de Engenharia Informática e Computação (L.EIC/M.EIC).
          A nossa principal motivação é ganhar experiência e competências essenciais para o mundo do trabalho assim como
          cultivar nos nossos colegas a vontade de aprender linguagens e novas tecnologias.
        </p>
      </CardFeature>
    </div>
  </div>
)

export default HeroPlanner
