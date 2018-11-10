function castIfNumber(subject) {
  const num = Number(subject);
  return Number.isNaN(num) ? subject : num;
}

export default function sortObjectKeys(a, b) {
  if (a === b) {
    return 0;
  }
  const castedA = castIfNumber(a);
  const castedB = castIfNumber(b);

  if (typeof castedA === typeof castedB) {
    return castedA < castedB ? -1 : 1;
  }

  // If types differ, numerical keys should be ordered before string keys
  return typeof castedA === 'number' ? -1 : 1;
}
