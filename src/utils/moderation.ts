import Filter from "bad-words";
import { ModTypesEnum } from "../Models";

let selfHarmre = /murder|gun|psycho|suicide|hate|kill|attack|own life|live anymore|life isn't worth it|life is not worth it|shoot|rifle|handgun|shotgun|beat the shit/gim;

function flagSelfHarm(message: string) {
  const arr = message.match(selfHarmre);
  return arr !== null;
}

export default function moderate(message: string) {
  const filter = new Filter();
  if (flagSelfHarm(message)) {
    return ModTypesEnum.selfHarm;
  } else if (filter.isProfane(message)) {
    return ModTypesEnum.offensive;
  }
  else {
    return ModTypesEnum.ok;
  }
}

export { moderate };
