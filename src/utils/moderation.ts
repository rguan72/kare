import Filter from "bad-words";
import { ModTypesEnum } from "../Models";

interface moderateReturn {
  moderateType: ModTypesEnum;
  words: boolean | RegExpMatchArray;
}

let selfHarmre = /murder|gun|psycho|suicide|hate|kill|attack|own life|live anymore|life isn't worth it|life is not worth it|shoot|rifle|handgun|shotgun|beat the shit/gim;

function flagSelfHarm(message: string) {
  const arr = message.match(selfHarmre);
  return [arr !== null, arr];
}

export default function moderate(message: string): moderateReturn {
  const filter = new Filter();
  const [isSelfHarm, matchedWords] = flagSelfHarm(message);
  if (isSelfHarm) {
    return { moderateType: ModTypesEnum.selfHarm, words: matchedWords };
  } else if (filter.isProfane(message)) {
    return { moderateType: ModTypesEnum.offensive, words: [] };
  } else {
    return { moderateType: ModTypesEnum.ok, words: [] };
  }
}

export { moderate };
