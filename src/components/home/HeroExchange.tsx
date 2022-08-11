import { NoticeOldScheduleImage, SelectNewScheduleImage, WaitNewScheduleImage } from '../../images'
import { SelectIcon, ConsultIcon, TidyIcon } from '../svgs'

const data = [
  {
    icon: ConsultIcon,
    image: NoticeOldScheduleImage,
    headline: 'Horário Inicial',
    text: 'Consultar horário inicial atribuído pelo departamento do curso após processo de alocação a turmas estar concluído',
  },
  {
    icon: SelectIcon,
    image: SelectNewScheduleImage,
    headline: 'Solicitar Troca',
    text: 'Escolher a(s) turma(s) de destino para as unidades curriculares com horários indesejados, nomeando diversas preferências',
  },
  {
    icon: TidyIcon,
    image: WaitNewScheduleImage,
    headline: 'Aguardar Resultados',
    text: 'Após submeter preferências na plataforma, os resultados serão processados sem ter em conta a ordem dos pedidos de alteração dos vários alunos, chegando a uma solução que satisfaz o maior número de pessoas.',
  },
]

const HeroExchange = () => (
  <div id="exchange" className="flex flex-col items-center justify-center space-y-3">
    <div className="flex flex-col items-center justify-center">
      <h2 className="mb-2 text-center text-2xl font-bold uppercase text-primary xl:text-3xl">
        FEUP Exchange (Coming Soon)
      </h2>
      <p className="mb-2 text-center text-base font-normal xl:text-lg">
        O único lugar onde podes trocar o teu horário na <strong>FEUP</strong> e ficar com os teus colegas!
      </p>
    </div>

    <ul className="grid w-full grid-cols-1 gap-8 rounded p-4 lg:grid-cols-3">
      {data.map((item, itemIdx) => (
        <li key={`item-${itemIdx}`} className="flex flex-col gap-4 xl:gap-6">
          <img className="h-64 rounded object-cover shadow md:h-72" src={item.image} alt="card" />
          <div className="flex text-base">
            <item.icon />
            <div className="ml-4">
              {/* Desktop */}
              <div className="hidden items-center text-xl font-semibold leading-6 xl:flex">
                <span className="uppercase text-primary">Passo {itemIdx + 1}</span>
                <span className="mx-2">&middot;</span>
                <span>
                  <span className="font-bold">{item.headline}</span>
                </span>
              </div>

              {/* Mobile */}
              <div className="flex flex-col items-start gap-1 text-xl font-semibold leading-6 xl:hidden">
                <span className="uppercase text-primary">Passo {itemIdx + 1}</span>
                <span className="font-bold">{item.headline}</span>
              </div>

              <p className="mt-2 leading-7">{item.text}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
)

export default HeroExchange
