type Props = {
  classesTHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  classesTPHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

const ClassesTypeCheckboxes = ({ classesTHook, classesTPHook }: Props) => {
  const [classesT, setClassesT] = classesTHook
  const [classesTP, setClassesTP] = classesTPHook

  return (
    <div className="flex items-center justify-center space-x-4 space-y-0 md:flex-col md:space-y-1 md:space-x-0">
      <div className="flex items-center justify-center space-x-2">
        <input
          type="checkbox"
          id="checkbox-classesT"
          className="checkbox"
          checked={classesT}
          onChange={(event) => setClassesT(event.target.checked)}
        />
        <label className="cursor-pointer text-sm font-medium capitalize tracking-tight" htmlFor="checkbox-classesT">
          <span>Teóricas</span>
        </label>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <input
          type="checkbox"
          id="checkbox-classesTP"
          className="checkbox"
          checked={classesTP}
          onChange={(event) => setClassesTP(event.target.checked)}
        />
        <label className="cursor-pointer text-sm font-medium capitalize tracking-tight" htmlFor="checkbox-classesTP">
          <span>Práticas</span>
        </label>
      </div>
    </div>
  )
}

export default ClassesTypeCheckboxes
