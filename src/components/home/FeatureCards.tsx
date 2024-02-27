import { Button } from '../ui/button'
import { BoltIcon, FunnelIcon, CameraIcon, ShareIcon, HashtagIcon, PencilIcon} from '@heroicons/react/24/outline';

// Define features with title, description, and the Icon component
const features = [
    {
        title: "Reordenar e personalizar as opções de horário",
        description: "Dá-te controlo total para ajustar e personalizar as tuas opções de horário conforme a tua disponibilidade e necessidade.",
        Icon: PencilIcon,
    },
    {
        title: "Partilhar horários com amigos",
        description: "Permite que compartilhes facilmente o teu horário de modo a que escolhas as mesmas turmas que os teus amigos.",
        Icon: ShareIcon,
    },
    {
        title: "Definir até 10 opções de horários",
        description: "Oferece a flexibilidade de gerir múltiplas opções de horários conforme a definido nos parâmetros do SIGARRA.",
        Icon: HashtagIcon,
    },
    {
        title: "Completar o horário com cadeiras aleatórias",
        description: "No caso de indecisão, preenche automaticamente o teu horário com cadeiras aleatórias para explorar as diferentes possibilidades.",
        Icon: BoltIcon,
    },
    {
        title: "Tirar print ao horário",
        description: "Permite que guardes ou imprimas o teu horário para referência rápida.",
        Icon: CameraIcon,
    },
    {
        title: "Filtrar as opções de horários pelos professores",
        description: "Facilita a escolha de horários com base nos teus professores preferidos.",
        Icon: FunnelIcon,
    },
];

const FeatureCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-12 m-4 sm:m-8 lg:m-12">
      {features.map((feature, index) => (
        <div key={index} className="bg-white p-4 sm:p-5 rounded-lg dark:bg-dark text-center shadow-lg">
          <Button className="flex-grow rounded-full border-4 border-primary bg-inherit hover:bg-secondary text-primary dark:bg-inherit dark:text-primary relative h-16 w-16 sm:h-20 sm:w-20 top-0 left-0 mx-auto">
            <feature.Icon className="h-10 w-10 sm:h-15 sm:w-15 mx-auto" />
          </Button>
          <h3 className="font-bold text-sm sm:text-md py-2">{feature.title}</h3>
          <p className="text-xs sm:text-sm">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
