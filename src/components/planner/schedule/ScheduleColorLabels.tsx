const ScheduleColorLabels = () => {
  return (
    <div className="mt-4 flex items-end justify-start space-x-2 2xl:space-x-4">
      <div className="flex flex-col space-y-1 text-xxs 2xl:space-y-2 2xl:text-xs">
        <div className="inline-flex items-center gap-1 lg:gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-theoretical/80 shadow 2xl:h-4 2xl:w-4" />
          <span>Teórica</span>
        </div>
        <div className="inline-flex items-center gap-1 lg:gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-practical/80 shadow 2xl:h-4 2xl:w-4" />
          <span>Teórico-Prática</span>
        </div>
        <div className="inline-flex items-center gap-1 lg:gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-laboratory/80 shadow 2xl:h-4 2xl:w-4" />
          <span>Laboratório</span>
        </div>
        <div className="inline-flex items-center gap-1 lg:gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-orientation/80 shadow 2xl:h-4 2xl:w-4" />
          <span>Orientação</span>
        </div>
      </div>

      <div className="flex flex-col space-y-1 text-xxs 2xl:space-y-2 2xl:text-xs">
        <div className="inline-flex items-center gap-1 lg:gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-lunch/25 shadow dark:bg-lunch/50 2xl:h-4 2xl:w-4" />
          <span>Almoço</span>
        </div>
        <div className="inline-flex items-center gap-1 lg:gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-ppractical/80 shadow 2xl:h-4 2xl:w-4" />
          <span>Prática</span>
        </div>
        <div className="inline-flex items-center gap-1 lg:gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-lab/80 shadow 2xl:h-4 2xl:w-4" />
          <span>Prática Laboratorial</span>
        </div>
        <div className="inline-flex items-center gap-1 lg:gap-1.5">
          <span className="h-3.5 w-3.5 rounded border-2 border-red-600 bg-lightish shadow 2xl:h-4 2xl:w-4" />
          <span>Conflitos de Horário</span>
        </div>
      </div>
    </div>
  )
}

export default ScheduleColorLabels
