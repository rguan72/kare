let selfHarmre = /suicide|kill/gim;

function flagSelfHarm(message: string) {
  const arr = message.match(selfHarmre);
  return arr !== null;
}

export { flagSelfHarm };
