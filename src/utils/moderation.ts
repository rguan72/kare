let selfHarmre = /murder|gun|psycho|suicide|hate|kill|attack|own life|live anymore|life isn't worth it|life is not worth it|shoot|rifle|handgun|shotgun|beat the shit/gim;

function flagSelfHarm(message: string) {
  const arr = message.match(selfHarmre);
  return arr !== null;
}

export { flagSelfHarm };
