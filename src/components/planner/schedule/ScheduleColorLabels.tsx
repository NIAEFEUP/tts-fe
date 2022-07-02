const ScheduleColorLabels = () => {
  return (
    <div className="mt-4 flex items-end justify-start space-x-2 2xl:space-x-4">
      <div className="flex flex-col space-y-1 text-xxs 2xl:space-y-2 2xl:text-xs">
        <div className="inline-flex items-center gap-1 lg:gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-schedule-t/80 shadow 2xl:h-4 2xl:w-4" />
          <span>Teórica</span>
        </div>
        <div className="inline-flex items-center gap-1 lg:gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-schedule-tp/80 shadow 2xl:h-4 2xl:w-4" />
          <span>Teórico-Prática</span>
        </div>
        <div className="inline-flex items-center gap-1 lg:gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-schedule-pl/80 shadow 2xl:h-4 2xl:w-4" />
          <span>Laboratório</span>
        </div>
        <div className="inline-flex items-center gap-1 lg:gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-schedule-ot/80 shadow 2xl:h-4 2xl:w-4" />
          <span>Orientação</span>
        </div>
      </div>
    </div>
  )
}

export default ScheduleColorLabels
