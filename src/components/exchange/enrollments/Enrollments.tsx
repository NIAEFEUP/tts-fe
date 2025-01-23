import { Button } from "../../ui/button"

export const Enrollments = () => {
  return (
  <div className="relative flex flex-row flex-wrap items-center justify-center gap-x-2 gap-y-2 lg:justify-start">
    <div className="flex flex-row justify-between items-center w-full">
      <h1 className="font-bold text-xl">Inscrições</h1>
      <Button>
        Escolher disciplinas
      </Button>
    </div>
  </div>
  )
}
