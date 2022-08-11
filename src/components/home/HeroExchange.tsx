import { SelectIcon, SubmitIcon, TidyIcon } from '../svgs'

const data = [
  {
    icon: SubmitIcon,
    headline: 'Horário Inicial',
    text: 'Consultar horário inicial atribuído pelo departamento do curso após processo de alocação a turmas estar concluído',
  },
  {
    icon: SelectIcon,
    headline: 'Solicitar Troca',
    text: 'Escolher a(s) turma(s) de destino para as unidades curriculares com horários indesejados, nomeando diversas preferências',
  },
  {
    icon: TidyIcon,
    headline: 'Aguardar Resultados',
    text: 'Após submeter preferências na plataforma, os resultados serão processados sem ter em conta a ordem dos pedidos de alteração dos vários alunos, chegando a uma solução que satisfaz o maior número de pessoas.',
  },
]

const HeroExchange = () => (
  <div id="exchange" className="flex flex-col items-center justify-center space-y-6">
    <div>
      <h2 className="mb-2 text-center text-3xl font-bold uppercase text-primary">FEUP Exchange (Coming Soon)</h2>
      <h5 className="mb-2 text-center text-lg md:text-xl">
        O único lugar onde podes trocar o teu horário FEUP e ficar com os teus colegas!
      </h5>
    </div>

    <ul className="grid w-full grid-cols-1 gap-6 rounded p-4 lg:grid-cols-3">
      {data.map((item, itemIdx) => (
        <li key={`item-${itemIdx}`} className="flex text-base">
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
        </li>
      ))}
    </ul>
  </div>
)

export default HeroExchange
