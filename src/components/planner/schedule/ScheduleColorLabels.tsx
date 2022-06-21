const ScheduleColorLabels = () => {
  return (
    <div className="mt-4 flex items-center justify-start space-x-2 2xl:space-x-4">
      <div className="flex flex-col space-y-1 text-xxs 2xl:space-y-2 2xl:text-xs">
        <div className="inline-flex items-center space-x-1 lg:space-x-1.5">
          <span className="h-3 w-3 rounded bg-theoretical shadow 2xl:h-4 2xl:w-4" />
          <span>Teóricas</span>
        </div>
        <div className="inline-flex items-center space-x-1 lg:space-x-1.5">
          <span className="h-3 w-3 rounded bg-practical shadow 2xl:h-4 2xl:w-4" />
          <span>Teórico-Práticas</span>
        </div>
        <div className="inline-flex items-center space-x-1 lg:space-x-1.5">
          <span className="h-3 w-3 rounded bg-lab shadow 2xl:h-4 2xl:w-4" />
          <span>Aula Laboratorial</span>
        </div>
      </div>

      <div className="flex flex-col space-y-1 text-xxs 2xl:space-y-2 2xl:text-xs">
        <div className="inline-flex items-center space-x-1 lg:space-x-1.5">
          <span className="h-3 w-3 rounded bg-laboratory shadow 2xl:h-4 2xl:w-4" />
          <span>Laboratório</span>
        </div>
        <div className="inline-flex items-center space-x-1 lg:space-x-1.5">
          <span className="h-3 w-3 rounded bg-orientation shadow 2xl:h-4 2xl:w-4" />
          <span>Orientação</span>
        </div>
        <div className="inline-flex items-center space-x-1 lg:space-x-1.5">
          <span className="h-3 w-3 rounded bg-lunch/50 shadow 2xl:h-4 2xl:w-4" />
          <span>Almoço</span>
        </div>
      </div>
    </div>
  )
}

export default ScheduleColorLabels
