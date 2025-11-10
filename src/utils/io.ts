const csvEncode = (text: string | null | undefined) => {
    if (!text)
      return ''
    if (text.includes(','))
      return `'${text}'`
    return text
  }
  
  const csvDecode = (text: string | null | undefined) => {
    return text.split('\n').slice(1).map(line =>{
      return line.split(',')
    });
  };
  
  
  export {
    csvEncode,
    csvDecode
  }