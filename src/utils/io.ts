const csvEncode = (text: string | null | undefined) => {
  if (!text)
    return ''
  if (text.includes(','))
    return `"${text}"`
  return text
}

const csvDecode = (text: string | null | undefined) => {
  return text
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map(line => {
      const fields: string[] = [];
      line.replace(/("([^"]|"")*"|[^,]*)(,|$)/g, (_, field) => {
        const unquoted = field.replace(/^"|"$/g, '').replace(/""/g, '"');
        fields.push(unquoted);
        return '';
      });
      return fields;
    });
};


export {
  csvEncode,
  csvDecode
}