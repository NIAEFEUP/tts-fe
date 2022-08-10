const HeaderFaqs = () => {
  return (
    <div>
      <h2 className="mb-4 text-center text-3xl font-bold uppercase text-primary dark:text-white">
        Perguntas mais frequentes (FAQS)
      </h2>
      <p className="w-full text-lg font-medium">
        Nesta página podes encontrar respostas para as perguntas que mais frequentemente surgem, relativamente às
        plataformas de gestão de horário do NIAEFEUP. No caso de perguntas persistirem, podes contactar o nosso email{' '}
        <a
          href="mailto:projetos.niaefeup@gmail.com"
          className="text-primary transition-all hover:underline hover:opacity-80"
        >
          projetos.niaefeup@gmail.com
        </a>{' '}
        ou submeter uma <span className="font-bold underline">issue</span> diretamente no{' '}
        <a
          href="https://github.com/NIAEFEUP/tts-revamp-fe/issues"
          className="text-primary transition-all hover:underline hover:opacity-80"
        >
          repositório do projeto
        </a>
        .
      </p>
    </div>
  )
}

export default HeaderFaqs
