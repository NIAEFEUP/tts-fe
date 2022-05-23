import { CalendarIcon, PencilAltIcon, ClockIcon } from '@heroicons/react/outline'

const information = [
  {
    icon: CalendarIcon,
    headline: 'Horário Inicial',
    text: 'Consultar horário inicial atribuído pelo departamento do curso após processo de alocação a turmas estar concluído',
  },
  {
    icon: PencilAltIcon,
    headline: 'Solicitar Troca',
    text: 'Escolher a(s) turma(s) de destino para as unidades curriculares com horários indesejados, nomeando diversas preferências',
  },
  {
    icon: ClockIcon,
    headline: 'Aguardar Resultados',
    text: 'Após submeter preferências na plataforma, os resultados serão processados sem ter em conta a ordem dos pedidos de alteração dos vários alunos, chegando a uma solução que satisfaz o maior número de pessoas.',
  },
]

const HeroExchange = () => (
  <div id="exchange" className="flex flex-col items-center justify-center space-y-6">
    <div>
      <h2 className="mb-2 text-center text-3xl font-bold uppercase text-primary">FEUP Exchange</h2>
      <h5 className="mb-2 text-center text-xl font-medium">
        The only place you can swap your FEUP Schedule and get on the classes with your buddies.
      </h5>
    </div>
    <div className="w-full grow rounded py-4 px-6">
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-3">
        {information.map((item, itemIdx) => (
          <div key={`item-${itemIdx}`} className="flex flex-col items-center justify-start">
            <item.icon className="z-50 mb-3 h-8 w-auto text-primary md:h-12" />
            <h2 className="text-center text-lg font-bold uppercase tracking-wide md:text-xl">{item.headline}</h2>
            <p className="text-center text-xs md:text-sm">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default HeroExchange