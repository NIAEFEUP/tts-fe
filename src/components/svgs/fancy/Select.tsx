const SelectIcon = () => {
  return (
    <svg
      className="h-11 w-11 shrink-0 transform-cpu rounded-lg shadow-md shadow-primary/[.12]"
      viewBox="0 0 40 40"
      fill="none"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M.75 8A7.25 7.25 0 018 .75h24A7.25 7.25 0 0139.25 8v24A7.25 7.25 0 0132 39.25H8A7.25 7.25 0 01.75 32V8z"
        className="fill-primary/[.02] stroke-primary"
      ></path>
      <path
        d="M24.847 33.25L19.82 20.113c-.324-.846.543-1.656 1.351-1.261L33.25 24.75l-6.426 2-1.977 6.5z"
        className="fill-primary/[.02] stroke-primary"
      ></path>
      <path
        d="M33.25 20.25V9.75a3 3 0 00-3-3H9.75a3 3 0 00-3 3v20.5a3 3 0 003 3h10.5"
        className="stroke-primary/40"
      ></path>
      <path d="M11.75 11.75v16.5" className="stroke-primary"></path>
    </svg>
  )
}

export default SelectIcon
