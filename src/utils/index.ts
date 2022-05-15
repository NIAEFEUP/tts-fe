const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export const getDisplayDate = () => {
  const date = new Date()
  return `${dayNames[date.getDay()]}, ${date.getDate() + 1} ${monthNames[date.getMonth()]}`
}

export const getSemester = () => {
  //jan-jul --> 2º Semestre
  const date = new Date()
  const month = date.getMonth()

  return month >= 0 && month <= 6 ? '2ºS' : '1ºS'
}

export const getSchoolYear = () => {
  const date = new Date()
  const month = date.getMonth()
  const year = date.getFullYear()

  return month >= 0 && month <= 6
    ? `${year - 1}/${year.toString().slice(2, 4)}`
    : `${year}/${(year + 1).toString().slice(2, 4)}`
}
