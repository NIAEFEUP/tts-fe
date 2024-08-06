const HeaderFaqs = () => {
  return (
    <div>
      <h2 className="mb-4 text-center text-3xl font-bold capitalize text-primary dark:text-white">
        Perguntas mais frequentes
      </h2>
      <p className="mx-auto w-3/4 text-center text-lg">
        Se continuas com dúvidas contacta-nos pelo email{' '}
        <a href="mailto:ni@aefeup.pt" className="text-primary transition-all hover:underline hover:opacity-80">
          ni@aefeup.pt
        </a>{' '}
      </p>
    </div>
  )
}

export default HeaderFaqs
