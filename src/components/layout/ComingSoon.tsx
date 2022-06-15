export const ComingSoon = () => {
  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center">
      <h1 className="mb-16 text-center font-headings text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
        Coming soon
      </h1>
      <div className="relative mx-auto w-full max-w-lg">
        <div className="animate-blob absolute -top-4 -left-12 h-72 w-72 rounded-full bg-primary opacity-70 mix-blend-multiply blur-xl filter dark:mix-blend-normal"></div>
        <div className="animate-blob animation-delay-4000 absolute -bottom-20 left-20 h-72 w-72 rounded-full bg-secondary opacity-70 mix-blend-multiply blur-xl filter dark:mix-blend-normal"></div>
        <div className="animate-blob animation-delay-2000 absolute -top-8 -right-4 h-72 w-72 rounded-full bg-tertiary opacity-70 mix-blend-multiply blur-xl filter dark:mix-blend-normal"></div>
        <div className="relative m-8 space-y-4">
          <div className="flex items-center justify-between space-x-8 rounded bg-white p-5">
            <div className="flex-1">
              <div className="h-4 w-36 rounded bg-gray-300 md:w-48"></div>
            </div>
            <div>
              <div className="h-6 w-12 rounded bg-primary md:w-24"></div>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-8 rounded bg-white p-5">
            <div className="flex-1">
              <div className="h-4 w-24 rounded bg-gray-300 md:w-44"></div>
            </div>
            <div>
              <div className="h-6 w-14 rounded bg-secondary md:w-28"></div>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-8 rounded bg-white p-5">
            <div className="flex-1">
              <div className="h-4 w-32 rounded bg-gray-300 md:w-56"></div>
            </div>
            <div>
              <div className="h-6 w-16 rounded bg-tertiary md:w-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
