import FaqBox from '../components/exchange/FaqBox'

const FeupExchangePageFaqs = () => {

    return (
        <div className="container mx-auto w-full space-y-12 py-6 px-4 md:py-10 md:px-6">
            <div >
                <h2 className="mb-2 text-center text-3xl font-bold uppercase text-primary"> Frequently asked questions</h2>
            </div>
            <div className='flex flex-col gap-4 mx-90'>
                <FaqBox
                    question="Se quiser mudar de turma a uma cadeira, preciso de encontrar previamente um outro aluno nessa turma que esteja disposto a fazer a troca comigo? "
                    answer="Não! Basta cada aluno indicar as suas preferências a cada cadeira, e o algoritmo irá automaticamente encontrar alguém que faça a troca com o mesmo."
                />
                <FaqBox
                    question="Posso fazer alterações às minhas preferências, ou desistir de a utilizar?"
                    answer="Sim, mas apenas antes da data limite. A data limite será apresentada na página principal do FEUPExchange. Até esse limite, os estudantes podem alterá-las, ou até desistir de utilizar a plataforma. Depois desse limite, as preferências ficam bloqueadas, e o algoritmo é executado."
                />
                <FaqBox
                    question="Quando é que posso ver o meu novo horário?"
                    answer="Após chegar a data limite e após o algoritmo ser executado, a platforma irá enviar um email a cada estudante, que irá conter o seu novo horário! Esses horários são depois enviados para a secretaria da FEUP, e pouco depois o novo horário ficará visível no SIGARRA!"
                />
                <FaqBox
                    question="E se eu fico com um horário que não gosto?"
                    answer="O algoritmo do FEUPExchange não irá gerar, para nenhum estudante, um horário cujas cadeiras não sejam especificadas nas suas indicações (quer seja nas preferências, nos give-ins ou nos buddies). Tendo isto em conta, o FEUPExchange não se responsabiliza caso o estudante prefira o seu horário antigo, face ao novo horário gerado."
                />
                <FaqBox
                    question="Quanto tempo demora até as alterações serem visíveis no SIGARRA?"
                    answer="Após correr o algoritmo, todos os novos horários serão enviados para secretaria da FEUP passado alguns minutos. Depois cabe à secretaria processar as alterações de horário para cada estudante. É previsto que as mudanças sejam visíveis no SIGARRA dentro de 1 a 2 dias úteis."
                />
            </div>
        </div>
    )
}
export default FeupExchangePageFaqs