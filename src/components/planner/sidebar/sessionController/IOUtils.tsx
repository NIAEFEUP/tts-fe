const csvEncode = (text: string | null | undefined) => {
  if (!text)
    return ''
  if (text.includes(','))
    return `'${text}'`
  return text
}

const csvDecode = (text: string | null | undefined) => {
  return text.split('\n').map(line => {
    const quotesIndex = line.indexOf('\'');
    if (quotesIndex !== -1) {
      const start = quotesIndex;
      const end = line.lastIndexOf('\'');
      const slicedContent = line.slice(0, start) + line.slice(end + 1);
      const parts = slicedContent.split(',');
      parts[1] = line.slice(start + 1, end);
      return parts;
    }
    return line.split(',');
  });
};


export {
  csvEncode,
  csvDecode
}