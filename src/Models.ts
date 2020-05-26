interface NewComment {
  color: string;
  commenterName: string;
  numReplies: number;
  reports: number;
  show: boolean;
  text: string;
  userId: string;
}

interface StressItem {
  id: number;
  title: string;
}

interface User {
  color: string;
  consider: number;
  groups: Array<string>;
  name: string;
  stress: Array<StressItem>;
  support: number;
  timestamp: string;
  voice: number;
}

interface UserWithId {
  id: String;
  color: String;
  consider: Number;
  groups: Array<String>;
  name: String;
  stress: Array<StressItem>;
  support: Number;
  timestamp: String;
  voice: Number;
}

enum ModTypesEnum {
  selfHarm,
  offensive,
  ok,
}

export { User, NewComment, ModTypesEnum, UserWithId };
