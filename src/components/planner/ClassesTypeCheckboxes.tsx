type Props = {
  classesTHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  classesTPHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

const ClassesTypeCheckboxes = ({ classesTHook, classesTPHook }: Props) => {
  const [classesT, setClassesT] = classesTHook
  const [classesTP, setClassesTP] = classesTPHook

  return (
    <div className="flex flex-row items-center justify-start space-x-4 space-y-0 md:flex-col md:space-y-1 md:space-x-0">
      <div className="flex items-center justify-start">
        <input
          type="checkbox"
          id="checkbox-classesT"
          className="cursor-pointer rounded text-gray-800 hover:opacity-90 focus:ring-gray-800 dark:text-primary dark:focus:ring-primary"
          checked={classesT}
          onChange={(event) => setClassesT(event.target.checked)}
        />
        <label className="ml-1.5 cursor-pointer text-sm" htmlFor="checkbox-classesT">
          <span>Teóricas</span>
        </label>
      </div>
      <div className="flex items-center justify-start">
        <input
          type="checkbox"
          id="checkbox-classesTP"
          className="cursor-pointer rounded text-gray-800 hover:opacity-90 focus:ring-gray-800 dark:text-primary dark:focus:ring-primary"
          checked={classesTP}
          onChange={(event) => setClassesTP(event.target.checked)}
        />
        <label className="ml-1.5 cursor-pointer text-sm" htmlFor="checkbox-classesTP">
          <span>Práticas</span>
        </label>
      </div>
    </div>
  )
}

export default ClassesTypeCheckboxes
