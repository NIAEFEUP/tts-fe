const csvEncode = (text: string | null | undefined) => {
    if (!text)
      return ''
    if (text.includes(','))
      return `'${text}'`
    return text
  }
  
  const csvDecode = (text: string | null | undefined) => {
    const lines = text.split('\n');
  
    const first_line = lines[0].split(',');
    const nr_of_courses = first_line[first_line.length - 1];
  
    const id_start = parseInt(nr_of_courses) + 3
  
    const id_lines = lines.slice(id_start, lines.length);
  
    return id_lines.map(line =>{
      return line.split(',').map(option_number => {
        return parseInt(option_number);
      });
    });
  };
  
  
  export {
    csvEncode,
    csvDecode
  }