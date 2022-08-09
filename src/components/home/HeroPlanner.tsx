import { HomePageImage, HomePageAltImage, ScheduleDarkImage, LogoNIAEFEUPAltImage } from '../../images'
import CardFeature from './CardFeature'

const Hero = () => (
  <div id="tts" className="flex flex-col items-center justify-center space-y-6">
    <div>
      <h2 className="mb-2 text-center text-3xl font-bold uppercase text-primary">Time Table Selector</h2>
      <h5 className="mb-2 text-center text-xl font-medium">
        A melhor ferramenta para escolheres e gerires o teu horário FEUP!
      </h5>
    </div>
    <div>
      <CardFeature
        title="O que é o tts?"
        subtitle="O teu melhor amigo para escolher e cuidar do horário na FEUP"
        text="TTS, ou Time Table Selector, é uma ferramenta desenvolvida pelo NIAEFEUP para ajudar os estudantes a construir o seu próprio horário. Se é o teu primeiro ano na FEUP não poderás mudar o teu horário, a FEUP irá atribuir-te um horário e poderás apenas trocar de horário com alguém que tenha interesse. No entanto, a partir do 2º Semestre até ao ultimo Semestre na FEUP terás de construir o teu horário. No entanto, a ferramenta que a Faculdade disponibiliza poderá não ser tão intuitiva e fácil de usar. E para isso nós decidimos criar o TTS, com o intuito de te ajudar, com uma ferramenta de fácil acesso e com uma interface limpa e simples de modo a que não tenhas complicações a construir e gerir o teu horário!"
        image={ScheduleDarkImage}
        reverse={false}
      />
      <CardFeature
        title="Porquê usar o tts?"
        subtitle="Porque é a ferramenta ideal que precisas"
        text="O TTS é uma ferramenta criada para ajudar os estudantes a criar, planear e partilhar os horários antes das inscrições de turmas de forma prática. Assim, podes começar a planear o teu semestre com antecedência, e, algo ainda melhor: Graças às novas features adicionadas, podes fazer o download ou dar upload de qualquer horário. Então tornou-se mais fácil do que nunca conseguires criar um horário e enviar para que os teus amigos fiquem com o mesmo horário que tu e nas mesmas turmas! Para além disso, o TTS tem um algoritmo de colisão de turmas, portanto não precisas de te preocupar em verificar se existe algum problema, o TTS irá advertir-te! "
        image={HomePageAltImage}
        reverse={true}
      /> 
      <CardFeature
        title="Novas features do TTS e futuras atualizações"
        subtitle="Temos algumas novidades nesta nova versão do TTS"
        text="Desde o dark mode até ao download/upload dos horários, temos algumas novidades nesta release. Como já foi apresentado, criamos um método que permite que faças o teu horário e o descarregues de modo a que o possas ter no teu computador e que possas enviar a qualquer amigo ou até dar upload para quando voltares ao TTS. Podes também exportar o horário para csv para poderes preencher no Sigarra! Adicionamos também o Dark Mode para aumentar a acessibilidade dos estudantes. Pretendemos no futuro adicionar abas para poderes criar mais do que um horário ao mesmo tempo e poderes comparar e planear ainda melhor! Para além disso, num futuro breve iremos lançar também o FEUPExchange, que será ainda melhor para te ajudar a trocar de turma. Vemo-nos em breve!"
        image={HomePageImage}
        reverse={false}
      />
      <CardFeature
        title="Quem somos nós?"
        subtitle="NIAEFEUP"
        text="O Núcleo de Informática da Associação de Estudantes da Faculdade de Engenharia da Universidade do Porto ou NIAEFEUP é constituído inteiramente por alunos do curso de Engenharia Informática e Computação (L.EIC/M.EIC). A nossa principal motivação é ganhar experiência e competências essenciais para o mundo do trabalho assim como cultivar nos nossos colegas a vontade de aprender linguagens e novas tecnologias."
        image={LogoNIAEFEUPAltImage}
        reverse={true}
      />
    </div>
  </div>
)

export default Hero
