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

const UseCaseSection = () => (
  <div className="w-full grow rounded py-4 px-6">
    <div className="container grid grid-cols-1 gap-8 md:grid-cols-3">
      {information.map((item, itemIdx) => (
        <div key={`item-${itemIdx}`} className="flex flex-col items-center justify-start">
          <item.icon className="z-50 mb-3 h-12 w-auto text-primary" />
          <h2 className="text-center text-xl font-bold uppercase tracking-wide">{item.headline}</h2>
          <p className="text-center text-base">{item.text}</p>
        </div>
      ))}
    </div>
  </div>
)

export default UseCaseSection
