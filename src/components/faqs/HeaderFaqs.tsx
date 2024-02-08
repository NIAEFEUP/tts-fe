const HeaderFaqs = () => {
  return (
    <div>
      <h2 className="mb-4 text-center text-3xl font-bold capitalize text-primary dark:text-white">
        Perguntas mais frequentes (FAQs)
      </h2>
      <p className="w-3/4 text-center mx-auto text-lg">
        No caso de a tua dúvida persistir, contacta-nos pelo email{' '}
        <a
          href="mailto:projetos.niaefeup@gmail.com"
          className="text-primary transition-all hover:underline hover:opacity-80"
        >
          projetos.niaefeup@gmail.com
        </a>{' '}
        ou submete uma <span className="font-bold underline">issue</span> diretamente no{' '}
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
